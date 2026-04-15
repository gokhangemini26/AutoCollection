import { Module, MiddlewareConsumer, RequestMethod, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { StrategyModule } from './modules/strategy/strategy.module';
import { CollectionModule } from './modules/collection/collection.module';
import { TrendModule } from './modules/trend/trend.module';
import { VisualModule } from './modules/visual/visual.module';
import { CostingModule } from './modules/costing/costing.module';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { SamplingModule } from './modules/sampling/sampling.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { AiModule } from './common/ai/ai.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PrismaService } from './common/prisma/prisma.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuditService } from './common/audit/audit.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AiModule,
        AuthModule,
        AdminModule,
        StrategyModule,
        CollectionModule,
        TrendModule,
        VisualModule,
        CostingModule,
        AnalysisModule,
        SamplingModule,
        SettingsModule,
        ApprovalsModule,
    ],
    controllers: [AppController],
    providers: [
        AuditService,
        PrismaService,
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
