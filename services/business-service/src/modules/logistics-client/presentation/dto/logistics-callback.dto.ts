import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum LogisticsDeliveryStatus {
  pending_assignment = 'pending_assignment',
  courier_assigned = 'courier_assigned',
  ready_for_pickup = 'ready_for_pickup',
  picked_up = 'picked_up',
  in_transit = 'in_transit',
  delivered = 'delivered',
  delivery_failed = 'delivery_failed',
  cancelled = 'cancelled',
}

export class LogisticsCallbackDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  negocioId!: number;

  @ApiProperty({ example: 25 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pedidoId!: number;

  @ApiProperty({
    enum: LogisticsDeliveryStatus,
    example: LogisticsDeliveryStatus.courier_assigned,
  })
  @IsEnum(LogisticsDeliveryStatus)
  estado!: LogisticsDeliveryStatus;

  @ApiPropertyOptional({ example: 'DEL-12345' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  codigo_entrega?: string;

  @ApiPropertyOptional({ example: 'LOG-ORD-10001' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  codigo_orden_logistica?: string;

  @ApiPropertyOptional({ example: 27 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  repartidor_id?: number;

  @ApiPropertyOptional({ example: 'Courier assigned to order' })
  @IsOptional()
  @IsString()
  observacion?: string;
}
