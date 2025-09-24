import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { sentTransactionalMail } from 'src/utils/emails';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<Record<string, string>> {
    try {
      await sentTransactionalMail("TEST", "vinaymaheshwari35@gmail.com");
    } catch (error) {
      console.error("Failed to send transactional mail:", error);
    }

    return this.appService.getServerStats();
  }
}
