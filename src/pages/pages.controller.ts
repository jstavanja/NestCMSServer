import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UseGuards } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { PagesService } from './pages.service';
import { Page } from './page.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { NotFoundInterceptor } from '../interceptors/notfound.interceptor';
import { AuthGuard } from '../guards/auth.guard';

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
    @UseGuards(new AuthGuard())
    create(@Body() createPageDto: CreatePageDto): Promise<Page> {
        return this.pagesService.create(createPageDto);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    delete(@Param('id') id: string): Promise<DeleteResult> {
        return this.pagesService.delete(id);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    update(@Param('id') id: string, @Body() updatePageDto: CreatePageDto): Promise<UpdateResult> {
        return this.pagesService.update(id, updatePageDto);
    }
}
