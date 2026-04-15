import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalysisService } from './analysis.service';

@UseGuards(AuthGuard('jwt'))
@Controller('analysis')
export class AnalysisController {
    constructor(private analysisService: AnalysisService) {}

    @Post('ingest')
    ingest(@Body() body: { sku: string; unitsSold: number; returns: number }) {
        return this.analysisService.ingestSalesData(body.sku, body.unitsSold, body.returns);
    }

    @Post('insights/:seasonId')
    insights(@Request() req: any, @Param('seasonId') seasonId: string) {
        return this.analysisService.generateNextSeasonInsights(seasonId, req.user.id);
    }
}
