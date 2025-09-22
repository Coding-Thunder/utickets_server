import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AmadeusService {
  private amadeusClient: AxiosInstance;
  private accessToken: string | null = null;

  constructor(private configService: ConfigService) {
    const baseURL = process.env.PRODUCTION_BASE_URL;

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

      const response = await axios.post(
        'https://api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.amadeusClient.defaults.headers['Authorization'] =
        `Bearer ${this.accessToken}`;
    } catch (error) {
      console.error(
        'Error authenticating Amadeus API:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'Failed to authenticate with Amadeus API',
      );
    }
  }
  async getTransferOffers(payloadFromFrontend: any) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    // Random prefill payload
    const prefillArray = [
      {
        startLocationCode: "JFK",
        endAddressLine: "Liberty Island",
        endCityName: "New York",
        endZipCode: "10004",
        endCountryCode: "US",
        endName: "Statue of Liberty",
        endGeoCode: "40.6892,-74.0445",
        transferType: "PRIVATE",
        startDateTime: "2025-09-04T12:00:00",
        passengers: 2,
      },
      {
        startLocationCode: "LAX",
        endAddressLine: "Hollywood Blvd",
        endCityName: "Los Angeles",
        endZipCode: "90028",
        endCountryCode: "US",
        endName: "Hollywood Walk of Fame",
        endGeoCode: "34.1016,-118.3269",
        transferType: "PRIVATE",
        startDateTime: "2025-09-05T09:30:00",
        passengers: 3,
      },
      {
        startLocationCode: "ORD",
        endAddressLine: "Millennium Park",
        endCityName: "Chicago",
        endZipCode: "60601",
        endCountryCode: "US",
        endName: "Cloud Gate",
        endGeoCode: "41.8826,-87.6226",
        transferType: "PRIVATE",
        startDateTime: "2025-09-06T14:00:00",
        passengers: 1,
      },
      // … add other entries as needed
    ];

    // Pick a random base payload
    const basePayload = prefillArray[Math.floor(Math.random() * prefillArray.length)];

    // Only replace startDateTime from frontend payload, keep everything else from basePayload
    const finalPayload = {
      ...basePayload,
      startDateTime: payloadFromFrontend.startDateTime || basePayload.startDateTime,
    };

    try {
      // Remove Z if present
      if (finalPayload.startDateTime?.endsWith('Z')) {
        finalPayload.startDateTime = finalPayload.startDateTime.replace('Z', '');
      }

      const response = await this.amadeusClient.post(
        '/v1/shopping/transfer-offers?max=20',
        finalPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error('Error fetching transfer offers:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        this.accessToken = null;
        await this.authenticate();
        return this.getTransferOffers(payloadFromFrontend);
      }

      throw new InternalServerErrorException('Failed to fetch transfer offers');
    }
  }


  async getLocations(keyword: string) {
    if (!this.accessToken) {
      await this.authenticate();
    }
    try {
      const response = await this.amadeusClient.get('/v1/reference-data/locations/cities', {
        params: {
          keyword,
          max: 10,
          // include: 'AIRPORTS',
        },
      });

      console.log(response)

      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        this.accessToken = null;
        await this.authenticate();
        return this.getLocations(keyword);
      }
      throw new InternalServerErrorException('Failed to fetch locations');
    }
  }


  async getAirports(page: number, subType: string, keyword: string) {
    // Ensure access token is available
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await this.amadeusClient.get(
        '/v1/reference-data/locations',
        {
          params: {
            keyword,
            subType,
            'page[offset]': page * 10,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        'Error fetching airports:',
        error.response?.data || error.message,
      );
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
    departureDate: string; // Departure date in YYYY-MM-DD format
    returnDate: string; // Departure date in YYYY-MM-DD format
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
      console.error(
        `Invalid travel class: ${travelClass}. Allowed values are: ${allowedClasses.join(', ')}`,
      );
      throw new InternalServerErrorException(
        `Invalid travel class: ${travelClass}. Allowed values are: ${allowedClasses.join(', ')}`,
      );
    }

    const flightQuery = {
      originLocationCode: params.from,
      destinationLocationCode: params.to,
      departureDate: params.departureDate.split('T')[0],
      adults: params.adults,
      children: params.children,
      infants: params.infants,
      travelClass: travelClass,
      currencyCode: 'USD', // Ensure prices are in USD
      // includedAirlineCodes: ["NK", "DL", "WN", "UA", "HA", "AS", "F9", "B6", "G4", "AA"]
    };

    if (params.returnDate && params.returnDate !== '') {
      flightQuery['returnDate'] = params.returnDate.split('T')[0];
    }

    try {
      const response = await this.amadeusClient.get(
        '/v2/shopping/flight-offers',
        {
          params: flightQuery,
        },
      );
      // const flightOffers = response.data;

      // List of allowed airline codes
      // const allowedAirlineCodes = ["NK", "DL", "WN", "UA", "HA", "AS", "F9", "B6", "G4", "AA"];

      // Filter flight offers based on allowed airlines
      // const filteredOffers = flightOffers.data.filter((offer) =>
      //   offer.validatingAirlineCodes.some((code:string) => allowedAirlineCodes.includes(code))
      // );

      // Return filtered flight offers
      return response.data;
    } catch (error) {
      // If the access token is invalid, re-authenticate and retry the request
      if (error.response?.status === 401) {
        this.accessToken = null;
        await this.authenticate();
        return this.getFlights(params);
      }
      throw new InternalServerErrorException('Failed to fetch flights');
    }

  }
  // 🔎 1. Get hotels in a city (basic hotel list, gives you hotelIds)
  async getHotelsByCity(cityCode: string) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await this.amadeusClient.get(
        '/v1/reference-data/locations/hotels/by-city',
        {
          params: { cityCode },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching hotels by city:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        this.accessToken = null;
        await this.authenticate();
        return this.getHotelsByCity(cityCode);
      }
      throw new InternalServerErrorException('Failed to fetch hotels by city');
    }
  }

  // 🏨 2. Get offers (rooms, rates) for specific hotels
  async getHotelOffers(params: {
    hotelIds: string[];
    checkInDate: string;
    checkOutDate: string;
    adults: number;
  }) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await this.amadeusClient.get(
        '/v3/shopping/hotel-offers',
        {
          params: {
            hotelIds: params.hotelIds.join(','),
            checkInDate: params.checkInDate,
            checkOutDate: params.checkOutDate,
            adults: params.adults,
            currency: 'USD',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching hotel offers:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        this.accessToken = null;
        await this.authenticate();
        return this.getHotelOffers(params);
      }
      throw new InternalServerErrorException('Failed to fetch hotel offers');
    }
  }

  // 📌 3. Get details for a specific offerId
  async getHotelOfferDetails(offerId: string) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await this.amadeusClient.get(
        `/v3/shopping/hotel-offers/${offerId}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching hotel offer details:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        this.accessToken = null;
        await this.authenticate();
        return this.getHotelOfferDetails(offerId);
      }
      throw new InternalServerErrorException('Failed to fetch hotel offer details');
    }
  }
}
