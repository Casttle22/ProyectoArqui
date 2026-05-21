import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LogisticsClientService } from './logistics-client.service';
import { LogisticsCallbackController } from './presentation/controllers/logistics-callback.controller';
import { DeliveriesModule } from '../deliveries/deliveries.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
    ConfigModule,
    DeliveriesModule,
  ],
  controllers: [LogisticsCallbackController],
  providers: [LogisticsClientService],
  exports: [LogisticsClientService],
})
export class LogisticsClientModule {}
