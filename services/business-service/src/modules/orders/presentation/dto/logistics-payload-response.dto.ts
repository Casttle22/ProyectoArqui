import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogisticsPayloadItemResponseDto {
  @ApiProperty()
  productId!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty({ example: 35.5 })
  unitPrice!: number;
}

export class LogisticsPayloadResponseDto {
  @ApiProperty({ example: 'business-service' })
  sourceService!: string;

  @ApiProperty({ example: 'business' })
  sourceType!: string;

  @ApiProperty()
  businessId!: number;

  @ApiProperty()
  businessOrderId!: number;

  @ApiProperty()
  externalOrderCode!: string;

  @ApiProperty({ example: 0 })
  branchId!: number;

  @ApiPropertyOptional({ nullable: true })
  branchName!: string | null;

  @ApiProperty()
  businessName!: string;

  @ApiPropertyOptional({ nullable: true })
  originAddress!: string | null;

  @ApiPropertyOptional({ nullable: true, example: null })
  originLat!: number | null;

  @ApiPropertyOptional({ nullable: true, example: null })
  originLng!: number | null;

  @ApiProperty()
  customerId!: number;

  @ApiPropertyOptional({ nullable: true })
  customerName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  customerPhone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  destinationAddress!: string | null;

  @ApiPropertyOptional({ nullable: true, example: null })
  destinationLat!: number | null;

  @ApiPropertyOptional({ nullable: true, example: null })
  destinationLng!: number | null;

  @ApiProperty({ type: LogisticsPayloadItemResponseDto, isArray: true })
  items!: LogisticsPayloadItemResponseDto[];

  @ApiProperty({ example: 71 })
  subtotalBase!: number;

  @ApiProperty({ example: 71 })
  totalPaid!: number;

  @ApiProperty({ example: 'GTQ' })
  currency!: string;

  @ApiPropertyOptional({ nullable: true })
  notes!: string | null;
}
