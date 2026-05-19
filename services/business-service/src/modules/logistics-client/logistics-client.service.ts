import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateLogisticsDeliveryDto } from './presentation/dto/create-logistics-delivery.dto';
import { LogisticsDeliveryResponseDto } from './presentation/dto/logistics-delivery-response.dto';

@Injectable()
export class LogisticsClientService {
  private readonly logger = new Logger(LogisticsClientService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('BROKER_SERVICE_URL', 'http://localhost:3002');
  }

  async createDelivery(
    dto: CreateLogisticsDeliveryDto,
  ): Promise<LogisticsDeliveryResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<LogisticsDeliveryResponseDto>(
          `${this.baseUrl}/api/logistica/entregas`,
          dto,
        ),
      );
      return data;
    } catch (error) {
      this.logger.error('Failed to create delivery in logistics', error);
      throw this.mapHttpError(error);
    }
  }

  async getDelivery(
    deliveryId: number,
  ): Promise<LogisticsDeliveryResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<LogisticsDeliveryResponseDto>(
          `${this.baseUrl}/api/logistica/entregas/${deliveryId}`,
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(
        `Failed to get delivery ${deliveryId} from logistics`,
        error,
      );
      throw this.mapHttpError(error);
    }
  }

  async getDeliveryHistory(
    deliveryId: number,
  ): Promise<unknown> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/api/logistica/entregas/${deliveryId}/historial`,
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(
        `Failed to get delivery history ${deliveryId} from logistics`,
        error,
      );
      throw this.mapHttpError(error);
    }
  }

  async listDeliveries(
    moduloOrigen: string = 'negocios',
    page: number = 1,
    limit: number = 10,
  ): Promise<unknown> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/api/logistica/entregas`, {
          params: { modulo_origen: moduloOrigen, page, limit },
        }),
      );
      return data;
    } catch (error) {
      this.logger.error('Failed to list deliveries from logistics', error);
      throw this.mapHttpError(error);
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/health`),
      );
      return data?.status === 'ok' || data?.status === 'UP';
    } catch {
      return false;
    }
  }

  private mapHttpError(error: unknown): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    const axiosError = error as {
      response?: { status?: number; data?: unknown };
      message?: string;
    };

    if (axiosError?.response) {
      return new HttpException(
        axiosError.response.data || 'Logistics service error',
        axiosError.response.status || HttpStatus.BAD_GATEWAY,
      );
    }

    return new HttpException(
      'Logistics service unavailable',
      HttpStatus.BAD_GATEWAY,
    );
  }
}
