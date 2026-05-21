import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogisticsCoordinatesDto {
  @ApiProperty()
  lat!: number;

  @ApiProperty()
  lng!: number;
}

export class LogisticsDeliveryResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  tipo_origen!: string;

  @ApiProperty()
  modulo_origen!: string;

  @ApiPropertyOptional({ nullable: true })
  orden_id!: number | null;

  @ApiProperty()
  empresa_id!: number;

  @ApiPropertyOptional({ nullable: true })
  cliente_id!: number | null;

  @ApiProperty()
  categoria_codigo!: string;

  @ApiProperty()
  metodo_pago!: string;

  @ApiProperty()
  estado!: string;

  @ApiProperty()
  tarifa_ofrecida!: number;

  @ApiProperty()
  monto_cobrar!: number;

  @ApiPropertyOptional({ nullable: true })
  distancia_estimada_km!: number | null;

  @ApiProperty()
  negocio_nombre!: string;

  @ApiPropertyOptional({ nullable: true })
  negocio_telefono!: string | null;

  @ApiProperty()
  negocio_direccion!: string;

  @ApiPropertyOptional({ type: LogisticsCoordinatesDto, nullable: true })
  origen_coordenadas!: LogisticsCoordinatesDto | null;

  @ApiProperty()
  cliente_nombre!: string;

  @ApiPropertyOptional({ nullable: true })
  cliente_telefono!: string | null;

  @ApiProperty()
  direccion_entrega!: string;

  @ApiPropertyOptional({ nullable: true })
  referencia_direccion!: string | null;

  @ApiPropertyOptional({ nullable: true })
  instrucciones_entrega!: string | null;

  @ApiPropertyOptional({ type: LogisticsCoordinatesDto, nullable: true })
  destino_coordenadas!: LogisticsCoordinatesDto | null;

  @ApiProperty()
  detalles_orden!: string[];

  @ApiPropertyOptional({ nullable: true })
  fecha_entrega_estimada!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
