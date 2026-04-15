import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SettingsService } from './settings.service';

@UseGuards(AuthGuard('jwt'))
@Controller('settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) {}

    @Get('api-key')
    getProvider(@Request() req: any) {
        return this.settingsService.getActiveProvider(req.user.id);
    }

    @Post('api-key')
    saveKey(
        @Request() req: any,
        @Body() body: { provider: 'GEMINI' | 'OPENAI' | 'CLAUDE'; apiKey: string },
    ) {
        return this.settingsService.saveApiKey(req.user.id, body.provider, body.apiKey);
    }
}
