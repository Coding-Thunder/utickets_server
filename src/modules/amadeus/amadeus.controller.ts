import { Body, Controller, Get, InternalServerErrorException, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AmadeusService } from './amadeus.service';

@Controller('amadeus')
export class AmadeusController {
  constructor(private readonly amadeusService: AmadeusService) { }

  @Get('airports')
  async getAirports(
    @Query('page') page: string,
    @Query('subType') subType: string,
    @Query('keyword') keyword: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.amadeusService.getAirports(
        Number(page) || 0,
        subType,
        keyword
      );
      res.json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }


  @Post('transfer-offers')
  async getTransferOffers() {
    try {
      return await this.amadeusService.getTransferOffers();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unable to fetch transfer offers');
    }
  }

  @Get("/locations")
  async getCities(
    // @Query('countryCode') countryCode: string,
    @Query('keyword') keyword: string,
  ) {
    return this.amadeusService.getLocations(keyword);
  }
  @Get('search-flights') // Update route if needed
  async getFlights(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('departureDate') departureDate: string,
    @Query('returnDate') returnDate: string,
    @Query('adults') adults: string,
    @Query('children') children: string,
    @Query('infants') infants: string,
    @Query('classType') classType: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.amadeusService.getFlights({
        from,
        to,
        departureDate,
        returnDate,
        adults: Number(adults),
        children: Number(children),
        infants: Number(infants),
        classType,
      });
      res.json(result);
    } catch (err) {
      console.error('Error fetching flights:', err); // Log the error
      res.status(500).json({ message: 'Failed to fetch flights', error: err.message });
    }
  }
}
