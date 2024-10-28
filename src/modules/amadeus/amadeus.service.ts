import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AmadeusService {
  private amadeusClient: AxiosInstance;
  private accessToken: string | null = null;

  constructor(private configService: ConfigService) {

    const baseURL = process.env.PRODUCTION_BASE_URL


    
    // Initialize Axios instance
    this.amadeusClient = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  private async authenticate() {
    try {
      const clientId = this.configService.get<string>('CLIENT_ID');
      const clientSecret = this.configService.get<string>('CLIENT_SECRET');

      const response = await axios.post('https://api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.amadeusClient.defaults.headers['Authorization'] = `Bearer ${this.accessToken}`;
    } catch (error) {
      console.error('Error authenticating Amadeus API:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to authenticate with Amadeus API');
    }
  }

  async getAirports(page: number, subType: string, keyword: string) {
    // Ensure access token is available
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await this.amadeusClient.get('/v1/reference-data/locations', {
        params: {
          keyword,
          subType,
          'page[offset]': page * 10,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching airports:', error.response?.data || error.message);
      // If the access token is invalid, re-authenticate and retry the request
      if (error.response?.status === 401) {
        this.accessToken = null; // Invalidate the token
        await this.authenticate(); // Re-authenticate
        return this.getAirports(page, subType, keyword); // Retry the request
      }
      throw new InternalServerErrorException('Failed to fetch airports');
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
    // Ensure access token is available
    if (!this.accessToken) {
      await this.authenticate();
    }
  
    // Normalize travel class by replacing spaces with underscores and converting to uppercase
    const travelClass = params.classType.toUpperCase().replace(/ /g, '_');
  
    // Validate travel class
    const allowedClasses = ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'];
    if (!allowedClasses.includes(travelClass)) {
      console.error(`Invalid travel class: ${travelClass}. Allowed values are: ${allowedClasses.join(', ')}`);
      throw new InternalServerErrorException(`Invalid travel class: ${travelClass}. Allowed values are: ${allowedClasses.join(', ')}`);
    }
  
    try {
      const response = await this.amadeusClient.get('/v2/shopping/flight-offers', {
        params: {
          originLocationCode: params.from,
          destinationLocationCode: params.to,
          departureDate: params.date.split('T')[0],
          adults: params.adults,
          children: params.children,
          infants: params.infants,
          travelClass: travelClass,
          currencyCode: 'USD', // Ensure prices are in USD
        },
      });
  
      // Filter flights based on allowed carrier codes
      const allowedAirlines = ['F9', 'NK', 'WN', 'B6'];
      const filteredFlights =  response.data.data.filter((flight: any) =>
        flight.itineraries.some((itinerary: any) =>
          itinerary.segments.some((segment: any) => allowedAirlines.includes(segment.carrierCode))
        )
      );
  
      return { ...response.data, data: filteredFlights };
    } catch (error) {
      console.error('Error fetching flights:', error.response?.data || error.message);
      // If the access token is invalid, re-authenticate and retry the request
      if (error.response?.status === 401) {
        this.accessToken = null;
        await this.authenticate();
        return this.getFlights(params);
      }
      throw new InternalServerErrorException('Failed to fetch flights');
    }
  }
  
}
