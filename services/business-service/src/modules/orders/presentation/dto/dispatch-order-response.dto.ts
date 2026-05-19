import { ApiProperty } from '@nestjs/swagger';
import { LogisticsDeliveryResponseDto } from '../../../logistics-client/presentation/dto/logistics-delivery-response.dto';
import { BusinessOrderDeliveryResponseDto } from '../../../deliveries/presentation/dto/business-order-delivery-response.dto';

export class DispatchOrderResponseDto {
  @ApiProperty()
  success!: boolean;

  @ApiProperty({ type: LogisticsDeliveryResponseDto })
  logisticsDelivery!: LogisticsDeliveryResponseDto;

  @ApiProperty({ type: BusinessOrderDeliveryResponseDto })
  localDelivery!: BusinessOrderDeliveryResponseDto;
}
