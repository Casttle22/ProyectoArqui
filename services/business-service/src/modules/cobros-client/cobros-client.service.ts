import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateCobrosPaymentDto } from './presentation/dto/create-cobros-payment.dto';
import {
  CobrosApiResponseDto,
  CobrosPaymentResponseDto,
} from './presentation/dto/cobros-payment-response.dto';

type CobrosHealthResponse = {
  ok?: boolean;
  service?: string;
};

@Injectable()
export class CobrosClientService {
  private readonly logger = new Logger(CobrosClientService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'COBROS_API_URL',
      'https://cobros-api.fly.dev',
    );
  }

  async createPayment(
    dto: CreateCobrosPaymentDto,
  ): Promise<CobrosPaymentResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<CobrosApiResponseDto<CobrosPaymentResponseDto>>(
          `${this.baseUrl}/api/cobros/payments`,
          dto,
        ),
      );
      return data.result;
    } catch (error) {
      this.logger.error('Failed to create payment in cobros', error);
      throw this.mapHttpError(error);
    }
  }

  async getPayment(paymentId: string): Promise<CobrosPaymentResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<CobrosApiResponseDto<CobrosPaymentResponseDto>>(
          `${this.baseUrl}/api/cobros/payments/${paymentId}`,
        ),
      );
      return data.result;
    } catch (error) {
      this.logger.error(
        `Failed to get payment ${paymentId} from cobros`,
        error,
      );
      throw this.mapHttpError(error);
    }
  }

  async cancelPayment(
    paymentId: string,
    reason: string,
  ): Promise<CobrosPaymentResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch<CobrosApiResponseDto<CobrosPaymentResponseDto>>(
          `${this.baseUrl}/api/cobros/payments/${paymentId}/cancel`,
          { reason },
        ),
      );
      return data.result;
    } catch (error) {
      this.logger.error(
        `Failed to cancel payment ${paymentId} in cobros`,
        error,
      );
      throw this.mapHttpError(error);
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<CobrosHealthResponse>(
          `${this.baseUrl}/api/cobros/health`,
        ),
      );
      return data?.ok === true && data?.service === 'cobros';
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
        axiosError.response.data || 'Cobros service error',
        axiosError.response.status || HttpStatus.BAD_GATEWAY,
      );
    }

    return new HttpException(
      'Cobros service unavailable',
      HttpStatus.BAD_GATEWAY,
    );
  }
}
