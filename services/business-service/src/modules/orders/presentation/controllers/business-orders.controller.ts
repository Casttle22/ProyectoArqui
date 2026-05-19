import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from '../../application/services/orders.service';
import { BusinessOrderResponseDto } from '../dto/business-order-response.dto';
import { CreateBusinessOrderDto } from '../dto/create-business-order.dto';
import { DispatchOrderResponseDto } from '../dto/dispatch-order-response.dto';
import { ListBusinessOrdersQueryDto } from '../dto/list-business-orders-query.dto';
import { LogisticsPayloadResponseDto } from '../dto/logistics-payload-response.dto';
import { ProcessPaymentResponseDto } from '../dto/process-payment-response.dto';
import { UpdateBusinessOrderStatusDto } from '../dto/update-business-order-status.dto';

@ApiTags('Business Orders')
@Controller('businesses/:businessId/orders')
export class BusinessOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a business order and reserve stock' })
  @ApiCreatedResponse({ type: BusinessOrderResponseDto })
  async create(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Body() dto: CreateBusinessOrderDto,
  ): Promise<BusinessOrderResponseDto> {
    return this.ordersService.create(businessId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List business orders' })
  @ApiOkResponse({ type: BusinessOrderResponseDto, isArray: true })
  async list(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Query() query: ListBusinessOrdersQueryDto,
  ): Promise<BusinessOrderResponseDto[]> {
    return this.ordersService.list(businessId, query);
  }

  @Get(':businessOrderId')
  @ApiOperation({ summary: 'Get business order by id' })
  @ApiOkResponse({ type: BusinessOrderResponseDto })
  async getById(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Param('businessOrderId', ParseIntPipe) businessOrderId: number,
  ): Promise<BusinessOrderResponseDto> {
    return this.ordersService.getById(businessId, businessOrderId);
  }

  @Get(':businessOrderId/logistics')
  @ApiOperation({ summary: 'Get logistics payload for a business order' })
  @ApiOkResponse({ type: LogisticsPayloadResponseDto })
  async getLogisticsPayload(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Param('businessOrderId', ParseIntPipe) businessOrderId: number,
  ): Promise<LogisticsPayloadResponseDto> {
    return this.ordersService.getLogisticsPayloadByBusinessOrderId(
      businessId,
      businessOrderId,
    );
  }

  @Patch(':businessOrderId/preparing')
  @ApiOperation({ summary: 'Move a business order to preparing status' })
  @ApiOkResponse({ type: BusinessOrderResponseDto })
  async markPreparing(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Param('businessOrderId', ParseIntPipe) businessOrderId: number,
    @Body() dto: UpdateBusinessOrderStatusDto,
  ): Promise<BusinessOrderResponseDto> {
    return this.ordersService.markPreparing(businessId, businessOrderId, dto);
  }

  @Patch(':businessOrderId/ready-for-pickup')
  @ApiOperation({ summary: 'Move a business order to ready for pickup status' })
  @ApiOkResponse({ type: BusinessOrderResponseDto })
  async markReadyForPickup(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Param('businessOrderId', ParseIntPipe) businessOrderId: number,
    @Body() dto: UpdateBusinessOrderStatusDto,
  ): Promise<BusinessOrderResponseDto> {
    return this.ordersService.markReadyForPickup(
      businessId,
      businessOrderId,
      dto,
    );
  }

  @Post(':businessOrderId/payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Process payment for an order.',
    description:
      'Creates a payment in the Cobros microservice and stores the cobro_id on the order. ' +
      'Must be called before dispatching to logistics.',
  })
  @ApiOkResponse({ type: ProcessPaymentResponseDto })
  async processPayment(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Param('businessOrderId', ParseIntPipe) businessOrderId: number,
  ): Promise<ProcessPaymentResponseDto> {
    return this.ordersService.processPayment(businessId, businessOrderId);
  }

  @Post(':businessOrderId/dispatch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Dispatch an order to logistics for delivery.',
    description:
      'Creates a delivery in the logistics microservice and links it to the order. ' +
      'Order must have a cobro_id (payment processed) and be in confirmed, preparing, or ready_for_pickup status.',
  })
  @ApiOkResponse({ type: DispatchOrderResponseDto })
  async dispatchToLogistics(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Param('businessOrderId', ParseIntPipe) businessOrderId: number,
  ): Promise<DispatchOrderResponseDto> {
    return this.ordersService.requestLogisticsDispatch(
      businessId,
      businessOrderId,
    );
  }
}
