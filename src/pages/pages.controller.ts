import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { PagesService } from './pages.service';
import { Page } from './page.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { NotFoundInterceptor } from '../interceptors/notfound.interceptor';

@Controller('pages')
@UseInterceptors(NotFoundInterceptor)
export class PagesController {

    constructor(private readonly pagesService: PagesService) {}

    @Get()
    findAll(): Promise<Page[]> {
        return this.pagesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Page> {
        return this.pagesService.findOne(id);
    }

    @Post()
    create(@Body() createPageDto: CreatePageDto): Promise<Page> {
        return this.pagesService.create(createPageDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<DeleteResult> {
        return this.pagesService.delete(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePageDto: CreatePageDto): Promise<UpdateResult> {
        return this.pagesService.update(id, updatePageDto);
    }
}
