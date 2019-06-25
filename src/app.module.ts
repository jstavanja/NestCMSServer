import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PagesController } from './pages/pages.controller';
import { PagesService } from './pages/pages.service';
import { PagesModule } from './pages/pages.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/keys';

const mongoURI: string = `mongodb://${config.mongoDBUsername}:${config.mongoDBPassword}@${config.mongoURI}/${config.mongoDBName}`;

@Module({
  imports: [PagesModule, MongooseModule.forRoot(mongoURI)],
  controllers: [AppController, PagesController],
  providers: [AppService],
})
export class AppModule {}
