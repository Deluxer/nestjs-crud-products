// src/common/common.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CsrfMiddleware } from './middleware/csrf.middleware';

@Module({
  providers: [],
  exports: [],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}