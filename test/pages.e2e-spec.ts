import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';

import { Page } from './../src/pages/page.entity';
import { PagesModule } from '../src/pages/pages.module';

const examplePage = {id: 2, title: 'Test', permalink: 'test123', content: 'boiii', isPublished: true};
const examplePageModified = {id: 2, title: 'Test2', permalink: 'test1234', content: 'guuurl', isPublished: false};

describe('PagesController (e2e)', () => {
    let app;
    let repository;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                PagesModule,
            ],
        })
            .overrideProvider(getRepositoryToken(Page))
            .useValue({
                find: jest.fn(() => [examplePage]),
                findOne: jest.fn(() => examplePage),
                save: jest.fn(() => examplePage),
                delete: jest.fn(() => true),
                update: jest.fn(() => examplePageModified),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        repository = moduleFixture.get<Repository<Page>>(getRepositoryToken(Page));
        await app.init();
    });

    it('returns all pages', () => {
        return request(app.getHttpServer())
            .get('/pages')
            .expect(200)
            .expect([examplePage]);
    });

    it('returns a single page', async () => {
        await request(app.getHttpServer())
            .get('/pages/1')
            .expect(200)
            .expect(examplePage);

        expect(repository.findOne).toHaveBeenCalledWith('1');
    });

    it('doesn\'t create a page if a user is not authenticated', () => {
        return request(app.getHttpServer())
            .post('/pages')
            .send(examplePage)
            .expect(HttpStatus.FORBIDDEN);
    });

    it('creates a page if a user is authenticated', async () => {
        await request(app.getHttpServer())
            .post('/pages')
            .set('Authorization', 'Bearer authenticated') // only works when process.env.NODE_ENV === 'test'
            .send(examplePage)
            .expect(201)
            .expect(examplePage);

        expect(repository.save).toHaveBeenCalledWith(examplePage);
    });

    it('doesn\'t delete a page if a user is not authenticated', () => {
        return request(app.getHttpServer())
            .delete('/pages/1')
            .expect(HttpStatus.FORBIDDEN);
    });

    it('deletes a page if a user is authenticated', async () => {
        await request(app.getHttpServer())
            .delete('/pages/1')
            .set('Authorization', 'Bearer authenticated') // only works when process.env.NODE_ENV === 'test'
            .expect(200);

        expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('doesn\'t update a page if a user is not authenticated', () => {
        return request(app.getHttpServer())
            .put('/pages/1')
            .send(examplePageModified)
            .expect(HttpStatus.FORBIDDEN);
    });

    it('deletes a page if a user is authenticated', async () => {
        await request(app.getHttpServer())
            .put('/pages/1')
            .set('Authorization', 'Bearer authenticated') // only works when process.env.NODE_ENV === 'test'
            .send(examplePageModified)
            .expect(200)
            .expect(examplePageModified);

        expect(repository.update).toHaveBeenCalledWith('1', examplePageModified);
    });

    afterAll(async () => {
        await app.close();
    });
});
