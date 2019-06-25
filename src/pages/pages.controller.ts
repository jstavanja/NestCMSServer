import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { PagesService } from './pages.service';
import { Page } from './interfaces/page.interface';

@Controller('pages')
export class PagesController {

    constructor(private readonly pagesService: PagesService) {}

    @Get()
    findAll(): Promise<Page[]> {
        return this.pagesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id): Promise<Page> {
        return this.pagesService.findOne(id);
    }

    @Post()
    create(@Body() createPageDto: CreatePageDto): Promise<Page> {
        return this.pagesService.create(createPageDto);
    }

    @Delete(':id')
    delete(@Param('id') id): Promise<Page> {
        return this.pagesService.delete(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePageDto: CreatePageDto) {
        return this.pagesService.update(id, updatePageDto);
    }
}
