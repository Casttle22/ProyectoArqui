import { Module } from '@nestjs/common';
import { CobrosClientModule } from '../cobros-client/cobros-client.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { InventoryModule } from '../inventory/inventory.module';
import { LogisticsClientModule } from '../logistics-client/logistics-client.module';
import { OrdersService } from './application/services/orders.service';
import { PrismaOrdersRepository } from './infrastructure/repositories/prisma-orders.repository';
import { BusinessOrdersController } from './presentation/controllers/business-orders.controller';
import { InternalBusinessOrdersController } from './presentation/controllers/internal-business-orders.controller';

@Module({
  imports: [
    CobrosClientModule,
    DeliveriesModule,
    InventoryModule,
    LogisticsClientModule,
  ],
  controllers: [BusinessOrdersController, InternalBusinessOrdersController],
  providers: [OrdersService, PrismaOrdersRepository],
  exports: [OrdersService, PrismaOrdersRepository],
})
export class OrdersModule {}
