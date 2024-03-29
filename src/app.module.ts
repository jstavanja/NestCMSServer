import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PagesController } from './pages/pages.controller';
import { PagesModule } from './pages/pages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    PagesModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [AppController, PagesController],
  providers: [AppService],
})
export class AppModule {}
