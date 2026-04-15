import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CostingService } from './costing.service';

@UseGuards(AuthGuard('jwt'))
@Controller('costing')
export class CostingController {
    constructor(private costingService: CostingService) {}

    @Get(':designId')
    getCostSheet(@Param('designId') designId: string) {
        return this.costingService.getCostSheet(designId);
    }

    @Post(':designId')
    calculate(
        @Param('designId') designId: string,
        @Body() body: {
            fabricPrice: number;
            fabricYield: number;
            makePrice: number;
            logistics: number;
            dutyPercent: number;
            kdvOrani?: number;
        },
    ) {
        return this.costingService.calculateAndValidateCost(designId, body);
    }
}
