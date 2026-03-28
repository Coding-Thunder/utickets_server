import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { getFutureDateTime } from 'src/utils/helpers';

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

  async getTransferOffers() {
    if (!this.accessToken) {
      await this.authenticate();
    }
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
        startDateTime: getFutureDateTime(),
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
        startDateTime: getFutureDateTime(),
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
        startDateTime: getFutureDateTime(),
        passengers: 1,
      },
      {
        startLocationCode: "SFO",
        endAddressLine: "Golden Gate Bridge",
        endCityName: "San Francisco",
        endZipCode: "94129",
        endCountryCode: "US",
        endName: "Golden Gate Bridge",
        endGeoCode: "37.8199,-122.4783",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 4,
      },
      {
        startLocationCode: "MIA",
        endAddressLine: "Ocean Drive",
        endCityName: "Miami",
        endZipCode: "33139",
        endCountryCode: "US",
        endName: "South Beach",
        endGeoCode: "25.7820,-80.1340",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 2,
      },
      {
        startLocationCode: "BOS",
        endAddressLine: "Freedom Trail",
        endCityName: "Boston",
        endZipCode: "02108",
        endCountryCode: "US",
        endName: "Boston Common",
        endGeoCode: "42.3551,-71.0656",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 1,
      },
      {
        startLocationCode: "SEA",
        endAddressLine: "Pike Place Market",
        endCityName: "Seattle",
        endZipCode: "98101",
        endCountryCode: "US",
        endName: "Seattle Aquarium",
        endGeoCode: "47.6097,-122.3425",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 2,
      },
      {
        startLocationCode: "ATL",
        endAddressLine: "World of Coca-Cola",
        endCityName: "Atlanta",
        endZipCode: "30313",
        endCountryCode: "US",
        endName: "Georgia Aquarium",
        endGeoCode: "33.7627,-84.3950",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 3,
      },
      {
        startLocationCode: "PHX",
        endAddressLine: "Desert Botanical Garden",
        endCityName: "Phoenix",
        endZipCode: "85008",
        endCountryCode: "US",
        endName: "Papago Park",
        endGeoCode: "33.4625,-111.9461",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 1,
      },
      {
        startLocationCode: "DEN",
        endAddressLine: "Red Rocks Amphitheatre",
        endCityName: "Denver",
        endZipCode: "80216",
        endCountryCode: "US",
        endName: "Denver Botanic Gardens",
        endGeoCode: "39.6654,-105.2057",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 2,
      },
      {
        startLocationCode: "LAS",
        endAddressLine: "The Strip",
        endCityName: "Las Vegas",
        endZipCode: "89109",
        endCountryCode: "US",
        endName: "Bellagio Fountains",
        endGeoCode: "36.1126,-115.1767",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 4,
      },
      {
        startLocationCode: "PHL",
        endAddressLine: "Independence Hall",
        endCityName: "Philadelphia",
        endZipCode: "19106",
        endCountryCode: "US",
        endName: "Liberty Bell",
        endGeoCode: "39.9489,-75.1500",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 2,
      },
      {
        startLocationCode: "DC",
        endAddressLine: "National Mall",
        endCityName: "Washington",
        endZipCode: "20004",
        endCountryCode: "US",
        endName: "Lincoln Memorial",
        endGeoCode: "38.8893,-77.0502",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 3,
      },
      {
        startLocationCode: "SD",
        endAddressLine: "Gaslamp Quarter",
        endCityName: "San Diego",
        endZipCode: "92101",
        endCountryCode: "US",
        endName: "Balboa Park",
        endGeoCode: "32.7341,-117.1446",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 1,
      },
      {
        startLocationCode: "AUS",
        endAddressLine: "Zilker Park",
        endCityName: "Austin",
        endZipCode: "78704",
        endCountryCode: "US",
        endName: "State Capitol",
        endGeoCode: "30.2747,-97.7404",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 2,
      },
      {
        startLocationCode: "NOLA",
        endAddressLine: "French Quarter",
        endCityName: "New Orleans",
        endZipCode: "70116",
        endCountryCode: "US",
        endName: "Jackson Square",
        endGeoCode: "29.9574,-90.0622",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 3,
      },
      {
        startLocationCode: "SEA",
        endAddressLine: "Space Needle",
        endCityName: "Seattle",
        endZipCode: "98109",
        endCountryCode: "US",
        endName: "Chihuly Garden and Glass",
        endGeoCode: "47.6205,-122.3493",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 2,
      },
      {
        startLocationCode: "MCO",
        endAddressLine: "Disney Springs",
        endCityName: "Orlando",
        endZipCode: "32830",
        endCountryCode: "US",
        endName: "Magic Kingdom",
        endGeoCode: "28.4177,-81.5812",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 4,
      },
      {
        startLocationCode: "CLT",
        endAddressLine: "NASCAR Hall of Fame",
        endCityName: "Charlotte",
        endZipCode: "28202",
        endCountryCode: "US",
        endName: "Bank of America Stadium",
        endGeoCode: "35.2251,-80.8431",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 2,
      },
      {
        startLocationCode: "BNA",
        endAddressLine: "Broadway Street",
        endCityName: "Nashville",
        endZipCode: "37203",
        endCountryCode: "US",
        endName: "Ryman Auditorium",
        endGeoCode: "36.1627,-86.7816",
        transferType: "PRIVATE",
        startDateTime: getFutureDateTime(),
        passengers: 3,
      },
    ];

    const payload = prefillArray[Math.floor(Math.random() * prefillArray.length)];
    console.log(payload)

    try {
      if (payload.startDateTime?.endsWith('Z')) {
        payload.startDateTime = payload.startDateTime.replace('Z', '');
      }

      const response = await this.amadeusClient.post(
        '/v1/shopping/transfer-offers?max=20',
        payload,
        {
          headers: {
            'Content-Type': 'application/json', // override here!
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        'Error fetching transfer offers:',
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        this.accessToken = null;
        await this.authenticate();
        return this.getTransferOffers();
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
}
