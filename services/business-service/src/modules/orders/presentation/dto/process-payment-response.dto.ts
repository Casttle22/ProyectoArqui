import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentResponseDto {
  @ApiProperty()
  success!: boolean;

  @ApiProperty()
  cobro_id!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  settlement_status!: string;
}
