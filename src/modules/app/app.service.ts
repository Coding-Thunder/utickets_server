import { Injectable } from '@nestjs/common';
import { sentTransactionalMail } from 'src/utils/emails';
import rootResponse from 'src/utils/response/root';

@Injectable()
export class AppService {
  async getServerStats(): Promise<any> {
    await sentTransactionalMail("TEST", "vinaymaheshwari35@gmail.com");

    return { message: rootResponse.serverHealthy };
  }
}
