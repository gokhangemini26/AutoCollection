import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CollectionService } from './collection.service';

@UseGuards(AuthGuard('jwt'))
@Controller('collection')
export class CollectionController {
    constructor(private collectionService: CollectionService) {}

    @Get('line-plan/:seasonId')
    getLinePlan(@Param('seasonId') seasonId: string) {
        return this.collectionService.getLinePlan(seasonId);
    }

    @Post('line-plan')
    createLinePlanItem(@Body() body: {
        seasonId: string;
        category: string;
        pricePoint: 'ENTRY' | 'CORE' | 'PREMIUM';
    }) {
        return this.collectionService.createLinePlanItem(body);
    }

    @Get('designs/:seasonId')
    getDesigns(@Param('seasonId') seasonId: string) {
        return this.collectionService.getDesigns(seasonId);
    }

    @Post('designs')
    createDesign(@Request() req: any, @Body() body: {
        linePlanId: string;
        skuPlaceholder: string;
        notes?: string;
    }) {
        return this.collectionService.createDesign({
            ...body,
            designerId: req.user.id,
        });
    }
}
