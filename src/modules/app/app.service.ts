import { Injectable, Response } from '@nestjs/common';
import rootResponse from 'src/utils/response/root';

@Injectable()
export class AppService {
  getServerStats(): Record<string, string> {
    return { message: rootResponse.serverHealthy };
  }
}
