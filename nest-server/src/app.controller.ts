import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('a')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('a')
  getHello(): string {
    return this.appService.getHello();
  }
}
