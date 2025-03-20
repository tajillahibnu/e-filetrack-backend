import { Controller, Get, Param, Post } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller()
export class HomeController {
    constructor(private readonly homeService: HomeService) { }

    @Get()
    getHello(): string {
        return this.homeService.getHello();
    }

    @Post()
    getToken(
        @Param('token') token: string,
    ) {
        return this.homeService.isTokenExpired(token);
    }
}
