import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PagesController } from './pages/pages.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PagesModule } from './pages/pages.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm';

@Module({
  imports: [PagesModule, TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  })],
  controllers: [AppController, PagesController],
  providers: [AppService],
})
export class AppModule {}
