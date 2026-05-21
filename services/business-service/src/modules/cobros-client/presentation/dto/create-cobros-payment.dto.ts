import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CobrosPaymentItemDto {
  @ApiProperty({ example: '11111111-1111-1111-1111-111111111111' })
  @IsString()
  @IsNotEmpty()
  product_id!: string;

  @ApiPropertyOptional({ example: 'REST-PROD-10' })
  @IsOptional()
  @IsString()
  external_product_id?: string;

  @ApiProperty({ example: 'Hamburguesa' })
  @IsString()
  @IsNotEmpty()
  product_name!: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 40 })
  @IsNumber()
  @Min(0)
  unit_price!: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  item_discount?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_combo?: boolean;
}

export class CreateCobrosPaymentDto {
  @ApiProperty({ example: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' })
  @IsString()
  @IsNotEmpty()
  customer_id!: string;

  @ApiProperty({ example: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' })
  @IsString()
  @IsNotEmpty()
  courier_id!: string;

  @ApiProperty({ example: 'cccccccc-cccc-cccc-cccc-cccccccccccc' })
  @IsString()
  @IsNotEmpty()
  business_id!: string;

  @ApiProperty({ example: 'dddddddd-dddd-dddd-dddd-dddddddddddd' })
  @IsString()
  @IsNotEmpty()
  delivery_address_id!: string;

  @ApiProperty({ example: 'RES-REST-1710000000000' })
  @IsString()
  @IsNotEmpty()
  reservation_id!: string;

  @ApiProperty({ example: 'ORD-REST-1710000000000' })
  @IsString()
  @IsNotEmpty()
  order_id!: string;

  @ApiProperty({ example: 'GTQ' })
  @IsString()
  @IsNotEmpty()
  currency_code!: string;

  @ApiProperty({ example: 'CARD_CREDIT' })
  @IsString()
  @IsNotEmpty()
  payment_method_code!: string;

  @ApiPropertyOptional({ example: 'CREDIT' })
  @IsOptional()
  @IsString()
  card_type?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  product_discounts?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  coupon_discount?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  service_fee?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  courier_earned_fee?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  approved_extra_fee?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tip_amount?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight_lbs?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  insurance_value?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  priority_shipping?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  apply_weather_surcharge?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  apply_traffic_surcharge?: boolean;

  @ApiProperty({ type: [CobrosPaymentItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CobrosPaymentItemDto)
  items!: CobrosPaymentItemDto[];

  @ApiProperty({ example: 'rest-card-1710000000000' })
  @IsString()
  @IsNotEmpty()
  idempotency_key!: string;
}
