import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RemixEngineService } from './remix.engine';

@UseGuards(AuthGuard('jwt'))
@Controller('visual')
export class VisualController {
    constructor(private remixEngine: RemixEngineService) {}

    @Post('remix')
    remix(@Body() body: { sketchUrl: string; textureDescription: string }) {
        return this.remixEngine.remixSketch(body.sketchUrl, body.textureDescription);
    }
}
