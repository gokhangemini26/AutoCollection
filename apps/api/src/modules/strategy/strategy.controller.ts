import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyService } from './strategy.service';

@UseGuards(AuthGuard('jwt'))
@Controller('strategy')
export class StrategyController {
    constructor(private strategyService: StrategyService) {}

    @Get('seasons')
    getSeasons() {
        return this.strategyService.getAllSeasons();
    }

    @Get('seasons/:id')
    getSeason(@Param('id') id: string) {
        return this.strategyService.getSeasonById(id);
    }

    @Post('seasons')
    createSeason(@Body() body: {
        name: string;
        budget: number;
        skuTarget: number;
        targetMargin?: number;
        startDate?: string;
        endDate?: string;
    }) {
        return this.strategyService.createSeason(body);
    }
}
