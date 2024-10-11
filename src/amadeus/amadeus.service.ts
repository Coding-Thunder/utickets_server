import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Amadeus from 'amadeus'; // Ensure this line is correct

@Injectable()
export class AmadeusService {
  private amadeus: Amadeus;

  constructor(private configService: ConfigService) {
    const CLIENT_ID = this.configService.get<string>('CLIENT_ID');
    const CLIENT_SECRET = this.configService.get<string>('CLIENT_SECRET');

    // Initialize Amadeus client
    this.amadeus = new Amadeus({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    });
  }

  async getAirports(page: number, subType: string, keyword: string) {
    try {
      const response = await this.amadeus.client.get('/v1/reference-data/locations', {
        keyword,
        subType,
        'page[offset]': page * 10,
      });
      return JSON.parse(response.body);
    } catch (error) {
      throw error;
    }
  }

  async getFlights(params: {
    from: string; // IATA code for origin
    to: string; // IATA code for destination
    date: string; // Departure date in YYYY-MM-DD format
    adults: number; // Number of adults
    children: number; // Number of children
    infants: number; // Number of infants
    classType: string; // Travel class (e.g., "ECONOMY", "BUSINESS")
  }) {
    try {
      const response = await this.amadeus.shopping.flightOffersSearch.get({
        originLocationCode: params.from, // Correctly map to the expected parameter
        destinationLocationCode: params.to, // Correctly map to the expected parameter
        departureDate: params.date.split('T')[0], // Use only the date part in YYYY-MM-DD format
        adults: params.adults,
        children: params.children,
        infants: params.infants,
        travelClass: params.classType.toUpperCase(), // Ensure classType is uppercase
      });

      return response.data; // Adjust based on your API response structure
    } catch (error) {
      console.error('Error in Amadeus API:', error); // Log the error
      throw error; // Rethrow to handle it in the controller
    }
  }

}
