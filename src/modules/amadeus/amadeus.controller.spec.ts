import { Test, TestingModule } from '@nestjs/testing';
import { AmadeusController } from './amadeus.controller';

describe('AmadeusController', () => {
  let controller: AmadeusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmadeusController],
    }).compile();

    controller = module.get<AmadeusController>(AmadeusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
