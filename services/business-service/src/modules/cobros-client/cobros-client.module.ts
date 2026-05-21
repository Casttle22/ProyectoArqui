import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CobrosClientService } from './cobros-client.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
    ConfigModule,
  ],
  providers: [CobrosClientService],
  exports: [CobrosClientService],
})
export class CobrosClientModule {}
