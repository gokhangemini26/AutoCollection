import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApprovalsService } from './approvals.service';

@UseGuards(AuthGuard('jwt'))
@Controller('approvals')
export class ApprovalsController {
    constructor(private approvalsService: ApprovalsService) {}

    @Post()
    approve(
        @Request() req: any,
        @Body() body: {
            entityType: string;
            entityId: string;
            verdict: 'APPROVED' | 'REJECTED';
            notes?: string;
        },
    ) {
        return this.approvalsService.approve({
            ...body,
            approverId: req.user.id,
            approverRole: req.user.role,
        });
    }

    @Get(':entityId')
    getApprovals(@Param('entityId') entityId: string) {
        return this.approvalsService.getApprovals(entityId);
    }
}
