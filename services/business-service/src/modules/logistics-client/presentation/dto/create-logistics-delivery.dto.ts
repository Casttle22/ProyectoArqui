import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CoordinatesDto {
  @ApiProperty({ example: 14.84 })
  @IsNumber()
  lat!: number;

  @ApiProperty({ example: -91.52 })
  @IsNumber()
  lng!: number;
}

export class CreateLogisticsDeliveryDto {
  @ApiProperty({ example: 'pedido' })
  @IsString()
  @IsNotEmpty()
  tipo_origen!: string;

  @ApiProperty({ example: 'negocios' })
  @IsString()
  @IsNotEmpty()
  modulo_origen!: string;

  @ApiProperty({ example: 1001 })
  @IsNumber()
  @Min(1)
  orden_id!: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  empresa_id!: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(1)
  cliente_id!: number;

  @ApiProperty({ example: 'PACKAGE' })
  @IsString()
  @IsNotEmpty()
  categoria_codigo!: string;

  @ApiProperty({ example: 'CASH' })
  @IsString()
  @IsNotEmpty()
  metodo_pago!: string;

  @ApiProperty({ example: 30.0 })
  @IsNumber()
  @Min(0)
  tarifa_ofrecida!: number;

  @ApiProperty({ example: 200.0 })
  @IsNumber()
  @Min(0)
  monto_cobrar!: number;

  @ApiPropertyOptional({ example: 5.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  distancia_estimada_km?: number;

  @ApiProperty({ example: 'Tienda Don Juan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  negocio_nombre!: string;

  @ApiPropertyOptional({ example: '5555-3333' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  negocio_telefono?: string;

  @ApiProperty({ example: 'Av. Central 10-20, Zona 1' })
  @IsString()
  @IsNotEmpty()
  negocio_direccion!: string;

  @ApiPropertyOptional({ type: CoordinatesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  origen_coordenadas?: CoordinatesDto;

  @ApiPropertyOptional({ example: 'Maria Lopez' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  cliente_nombre?: string;

  @ApiPropertyOptional({ example: '5555-4444' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  cliente_telefono?: string;

  @ApiPropertyOptional({ example: '6a Calle 5-30, Zona 2' })
  @IsOptional()
  @IsString()
  direccion_entrega?: string;

  @ApiPropertyOptional({ example: 'Casa blanca esquina' })
  @IsOptional()
  @IsString()
  referencia_direccion?: string;

  @ApiPropertyOptional({ example: 'Dejar en recepcion' })
  @IsOptional()
  @IsString()
  instrucciones_entrega?: string;

  @ApiPropertyOptional({ type: CoordinatesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  destino_coordenadas?: CoordinatesDto;

  @ApiProperty({ example: ['2x Producto A', '1x Producto B'] })
  @IsArray()
  @IsString({ each: true })
  detalles_orden!: string[];

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  fecha_entrega_estimada?: string | null;
}
