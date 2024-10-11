import { Module } from '@nestjs/common';
import { AmadeusController } from './amadeus.controller';
import { AmadeusService } from './amadeus.service';

@Module({
  controllers: [AmadeusController],
  providers: [AmadeusService],
})
export class AmadeusModule {}
