import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TrendAgentService } from './trend.agent';

@UseGuards(AuthGuard('jwt'))
@Controller('trend')
export class TrendController {
    constructor(private trendAgent: TrendAgentService) {}

    @Post('generate')
    generate(@Request() req: any, @Body() body: { query: string }) {
        return this.trendAgent.generateTrendReport(body.query, req.user.id);
    }
}
