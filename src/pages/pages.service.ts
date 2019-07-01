import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Page } from './page.entity';
import { CreatePageDto } from './dto/create-page.dto';


@Injectable()
export class PagesService {

    constructor(@InjectRepository(Page) private readonly pageRepository: Repository<Page>) {}

    async findAll(): Promise<Page[]> {
        return await this.pageRepository.find();
    }

    async findOne(id: string): Promise<Page> {
        return await this.pageRepository.findOne(id);
    }

    async create(createPageDto: CreatePageDto): Promise<Page> {
        const page = this.pageRepository.create(createPageDto);
        return await this.pageRepository.save(page);
    }

    async delete(id: string): Promise<DeleteResult> {
        return await this.pageRepository.delete(id);
    }

    async update(id: string, updatePageDto: CreatePageDto): Promise<UpdateResult> {
        return await this.pageRepository.update(id, updatePageDto);
    }
}
