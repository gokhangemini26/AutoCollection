import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SamplingService } from './sampling.service';

@UseGuards(AuthGuard('jwt'))
@Controller('sampling')
export class SamplingController {
    constructor(private samplingService: SamplingService) {}

    @Post('request')
    createRequest(@Body() body: {
        designId: string;
        stage: 'PROTO_1' | 'PROTO_2' | 'SMS';
    }) {
        return this.samplingService.createSampleRequest(body.designId, body.stage);
    }

    @Post('feedback')
    recordFeedback(@Body() body: {
        trackingId: string;
        verdict: 'APPROVED' | 'REJECTED';
        comments: string;
    }) {
        return this.samplingService.recordFitComment(body.trackingId, body.verdict, body.comments);
    }
}
