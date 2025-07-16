import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';

describe('AppModule (e2e)', () => {

  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3334);

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3334');
  });

  afterAll(() => {
    app.close();
  });
  
  describe('Auth', () => {

    const dto: AuthDto = {
      email: 'test@example.com',
      password: 'password',
    };

    describe('Sign Up', () => {
      it('should throw an error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw an error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should throw an error if email and password are empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });

      it('should throw an error if email is invalid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: 'invalid-email', password: dto.password })
          .expectStatus(400);
      });

      it('should sign up a user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it('should throw an error if email is already taken', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Sign In', () => {
      it('should throw an error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw an error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should throw an error if email and password are empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });

      it('should throw an error if email is invalid', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: 'invalid-email', password: dto.password })
          .expectStatus(400);
      });

      it('should throw an error if password is incorrect', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email, password: 'wrong-password' })
          .expectStatus(403);
      });

      it('should sign in a user', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get Me', () => {
      it('should not get current user if not authenticated', () => {
        return pactum
          .spec()
          .get('/users/me')
          .expectStatus(401);
      });

      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200);
      });
    });

    describe('Edit Profile', () => {});
  });
});
