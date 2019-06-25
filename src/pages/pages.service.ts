import { Injectable } from '@nestjs/common';
import { Page } from './interfaces/page.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PagesService {

    constructor(@InjectModel('Page') private readonly pageModel: Model<Page>) {}

    async findAll(): Promise<Page[]> {
        return await this.pageModel.find();
    }

    async findOne(id: string): Promise<Page> {
        return await this.pageModel.findOne({ _id: id });
    }

    async create(page: Page): Promise<Page> {
        const newPage = new this.pageModel(page);
        return await newPage.save();
    }

    async delete(id: string): Promise<Page> {
        return await this.pageModel.findByIdAndRemove(id);
    }

    async update(id: string, page: Page): Promise<Page> {
        return await this.pageModel.findByIdAndUpdate(id, page, { new: true });
    }
}
