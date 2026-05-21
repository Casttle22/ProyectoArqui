import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DeliveriesService } from '../../../deliveries/application/services/deliveries.service';
import {
  LogisticsCallbackDto,
  LogisticsDeliveryStatus,
} from '../dto/logistics-callback.dto';
import { BusinessOrderDeliveryResponseDto } from '../../../deliveries/presentation/dto/business-order-delivery-response.dto';
import {
  business_order_delivery_delivery_status,
  business_order_delivery_status_history_status_origin,
} from '@prisma/client';
import { UpdateBusinessOrderDeliveryStatusDto } from '../../../deliveries/presentation/dto/update-business-order-delivery-status.dto';

const STATUS_MAP: Record<
  LogisticsDeliveryStatus,
  business_order_delivery_delivery_status
> = {
  [LogisticsDeliveryStatus.pending_assignment]:
    business_order_delivery_delivery_status.pending_assignment,
  [LogisticsDeliveryStatus.courier_assigned]:
    business_order_delivery_delivery_status.courier_assigned,
  [LogisticsDeliveryStatus.ready_for_pickup]:
    business_order_delivery_delivery_status.ready_for_pickup,
  [LogisticsDeliveryStatus.picked_up]:
    business_order_delivery_delivery_status.picked_up,
  [LogisticsDeliveryStatus.in_transit]:
    business_order_delivery_delivery_status.in_transit,
  [LogisticsDeliveryStatus.delivered]:
    business_order_delivery_delivery_status.delivered,
  [LogisticsDeliveryStatus.delivery_failed]:
    business_order_delivery_delivery_status.delivery_failed,
  [LogisticsDeliveryStatus.cancelled]:
    business_order_delivery_delivery_status.cancelled,
};

@ApiTags('Logistics Callback (Integrations)')
@Controller('negocios')
export class LogisticsCallbackController {
  private readonly logger = new Logger(LogisticsCallbackController.name);

  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Patch(':businessId/pedidos/:businessOrderId/estado-logistica')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Callback endpoint for logistics service to notify delivery status changes.',
    description:
      'Logistica calls this endpoint when a delivery status changes. ' +
      'It updates the local delivery record and records status history.',
  })
  @ApiOkResponse({ type: BusinessOrderDeliveryResponseDto })
  @ApiNotFoundResponse({ description: 'Delivery not found for the order' })
  async handleLogisticsCallback(
    @Param('businessId', ParseIntPipe) _businessId: number,
    @Param('businessOrderId', ParseIntPipe) _businessOrderId: number,
    @Body() callbackDto: LogisticsCallbackDto,
  ): Promise<BusinessOrderDeliveryResponseDto> {
    this.logger.log(
      `Logistics callback for negocio ${callbackDto.negocioId}, pedido ${callbackDto.pedidoId}: ${callbackDto.estado}`,
    );

    const mappedStatus = STATUS_MAP[callbackDto.estado];

    if (!mappedStatus) {
      throw new ConflictException(
        `Unknown delivery status: ${callbackDto.estado}`,
      );
    }

    const updateDto: UpdateBusinessOrderDeliveryStatusDto = {
      externalOrderCode: callbackDto.codigo_entrega
        ? undefined
        : `${callbackDto.pedidoId}`,
      externalDeliveryCode: callbackDto.codigo_entrega,
      externalLogisticsOrderCode: callbackDto.codigo_orden_logistica,
      newStatus: mappedStatus,
      statusOrigin:
        business_order_delivery_status_history_status_origin.couriers,
      observation:
        callbackDto.observacion ??
        `Logistics callback: status changed to ${callbackDto.estado}`,
      externalCourierId: callbackDto.repartidor_id,
    };

    try {
      return await this.deliveriesService.updateStatus(updateDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(
          `Delivery not found for logistics callback on order ${callbackDto.pedidoId}`,
        );
      }
      throw error;
    }
  }
}
