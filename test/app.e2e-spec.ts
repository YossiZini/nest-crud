import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from '../src/items/items.module.js';
import { Item } from '../src/items/item.entity.js';

describe('Items CRUD (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT, 10) || 5432,
          username: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASS || 'postgres',
          database: process.env.DB_NAME || 'nest_crud_test',
          entities: [Item],
          synchronize: true,
          dropSchema: true,
        }),
        ItemsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdId: number;

  it('POST /items', async () => {
    const res = await request(app.getHttpServer())
      .post('/items')
      .send({ name: 'Widget', description: 'A test widget' })
      .expect(201);

    expect(res.body.name).toBe('Widget');
    createdId = res.body.id;
  });

  it('GET /items', async () => {
    const res = await request(app.getHttpServer()).get('/items').expect(200);
    expect(res.body).toHaveLength(1);
  });

  it('GET /items/:id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/items/${createdId}`)
      .expect(200);
    expect(res.body.name).toBe('Widget');
  });

  it('PUT /items/:id', async () => {
    const res = await request(app.getHttpServer())
      .put(`/items/${createdId}`)
      .send({ name: 'Updated Widget' })
      .expect(200);
    expect(res.body.name).toBe('Updated Widget');
  });

  it('DELETE /items/:id', async () => {
    await request(app.getHttpServer())
      .delete(`/items/${createdId}`)
      .expect(200);
  });

  it('GET /items/:id returns 404 after delete', async () => {
    await request(app.getHttpServer())
      .get(`/items/${createdId}`)
      .expect(404);
  });
});
