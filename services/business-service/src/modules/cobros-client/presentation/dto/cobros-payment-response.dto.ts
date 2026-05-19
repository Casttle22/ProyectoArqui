import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CobrosPaymentTotalsDto {
  @ApiProperty()
  subtotal!: number;

  @ApiProperty()
  total_discounts!: number;

  @ApiProperty()
  service_fee!: number;

  @ApiProperty()
  weight_fee!: number;

  @ApiProperty()
  tip_amount!: number;

  @ApiProperty()
  total_amount!: number;
}

export class CobrosPaymentResponseDto {
  @ApiProperty()
  payment_id!: string;

  @ApiProperty()
  order_snapshot_id!: string;

  @ApiProperty()
  reservation_id!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  settlement_status!: string;

  @ApiPropertyOptional({ type: CobrosPaymentTotalsDto })
  totals?: CobrosPaymentTotalsDto;
}

export class CobrosApiResponseDto<T> {
  @ApiProperty()
  ok!: boolean;

  @ApiProperty()
  result!: T;
}
