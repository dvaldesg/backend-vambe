import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto/';
import { CreateSalesmanDto } from '../src/salesman/dto';
import { ClientMeetingDto } from '../src/client_meeting/dto';
import { CreateClientClassificationDto, UpdateClientClassificationDto } from '../src/client_classification/dto';
import { CommercialSector, LeadSource, InterestReason, VambeModel } from '../src/client_classification/enum';

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

    describe('Edit Profile', () => {

      const editUserDto: EditUserDto = {
        firstName: 'NewFirstName',
        lastName: 'NewLastName',
        email: 'new-email@example.com',
      };

      it('should not edit profile if not authenticated', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .expectStatus(401);
      });

      it('should edit profile', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .withBody(editUserDto)
          .expectStatus(200)
          .expectBodyContains(editUserDto.firstName)
          .expectBodyContains(editUserDto.lastName)
          .expectBodyContains(editUserDto.email);
      });

      it('should not allow editing of the role field', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .withBody({ role: 'ADMIN' })
          .expectStatus(200)
          .expectBodyContains('USER');
      });
    });
  });

  describe('Salesman', () => {

    const salesmanDto: CreateSalesmanDto = {
      name: 'John Doe',
    }

    it('should not allow access to salesman routes if not authenticated', () => {
      return pactum
        .spec()
        .get('/salesmen/all')
        .expectStatus(401);
    });

    it('should create a salesman', () => {
      return pactum
        .spec()
        .post('/salesmen')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .withBody(salesmanDto)
        .expectStatus(201)
        .expectBodyContains(salesmanDto.name)
        .stores('salesmanId', 'id');
    });

    it('should get all salesmen', () => {
      return pactum
        .spec()
        .get('/salesmen/all')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .expectStatus(200)
        .expectJsonLength(1)
        .expectJsonLike([{
          name: salesmanDto.name,
        }]);
    });
    
    it('should get a salesman by ID', () => {
      return pactum
        .spec()
        .get('/salesmen/$S{salesmanId}')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .expectStatus(200)
        .expectBodyContains(salesmanDto.name);
    });

    it('should return error for non-existent salesman', () => {
    return pactum
      .spec()
      .get('/salesmen/999999')
      .withHeaders({ Authorization: 'Bearer $S{userToken}' })
      .expectStatus(404);
    });
  });

  describe('ClientMeeting', () => {
    const clientMeetingDto: ClientMeetingDto = {
      name: 'Client Name',
      email: 'client@example.com',
      phone: '1234567890',
      salesmanName: 'John Doe',
      date: '2023-10-01',
      closed: true,
      transcription: 'Meeting transcription',
    }

    it('should not allow access to client meetings if not authenticated', () => {
      return pactum
        .spec()
        .get('/client-meetings/all')
        .expectStatus(401);
    });

    it('should create a client meeting', () => {
      return pactum
        .spec()
        .post('/client-meetings')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .withBody(clientMeetingDto)
        .expectStatus(201)
        .expectBodyContains(clientMeetingDto.name)
        .stores('clientMeetingId', 'id');
    });

    it('should get all client meetings', () => {
      return pactum
        .spec()
        .get('/client-meetings/all')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .expectStatus(200)
        .expectJsonLength(1)
        .expectJsonLike([{
          name: clientMeetingDto.name,
        }]);
    });
  });

  describe('CSV Upload', () => {
    it('should not allow access to CSV upload if not authenticated', () => {
      return pactum
        .spec()
        .post('/csv-parser/client-meetings')
        .expectStatus(401);
    });

    it('should upload a CSV file and process it', () => {
      return pactum
        .spec()
        .post('/csv-parser/client-meetings')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .withFile('file', 'test/client-meetings.csv')
        .expectStatus(201)
        .expectBodyContains('Successfully processed');
    });
  
    it('should return error for invalid CSV file', () => {
      return pactum
        .spec()
        .post('/csv-parser/client-meetings')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .withFile('file', 'test/invalid-client-meetings.csv')
        .expectStatus(400)
        .expectBodyContains('Error processing CSV file: No valid rows found in CSV file');
    });

    it('should return error for missing CSV file', () => {
      return pactum
        .spec()
        .post('/csv-parser/client-meetings')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .expectStatus(400)
        .expectBodyContains('No file uploaded');
    });
  });

  describe('ClientClassification', () => {

    const createClassificationDto: Omit<CreateClientClassificationDto, 'clientMeetingId'> = {
      commercialSector: CommercialSector.FINANCIAL_SERVICES,
      leadSource: LeadSource.CONFERENCE,
      interestReason: InterestReason.USER_EXPERIENCE,
      hasDemandPeaks: false,
      hasSeasonalDemand: false,
      estimatedDailyInteractions: 71,
      estimatedWeeklyInteractions: 500,
      estimatedMonthlyInteractions: 2200,
      hasTechTeam: false,
      vambeModel: VambeModel.MERCUR,
      isPotentialClient: true,
      isProblemClient: false,
      isLostClient: false,
      shouldBeContacted: true,
      confidenceScore: 0.99,
      modelVersion: "test-gpt"
    };

    const updateClassificationDto: UpdateClientClassificationDto = {
      isPotentialClient: false,
      confidenceScore: 0.85
    };

    const duplicateClassificationDto: Omit<CreateClientClassificationDto, 'clientMeetingId'> = {
      commercialSector: CommercialSector.TECHNOLOGY,
      leadSource: LeadSource.REFERRAL,
      interestReason: InterestReason.FEATURES
    };

    const invalidMeetingClassificationDto: CreateClientClassificationDto = {
      clientMeetingId: 999999,
      commercialSector: CommercialSector.TECHNOLOGY,
      leadSource: LeadSource.REFERRAL,
      interestReason: InterestReason.FEATURES
    };

    it('should not allow access to client classifications if not authenticated', () => {
      return pactum
        .spec()
        .get('/client-classifications/all')
        .expectStatus(401);
    });

    it('should create a manual client classification', () => {
      return pactum
        .spec()
        .post('/client-classifications')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .withBody({
          ...createClassificationDto,
          clientMeetingId: '$S{clientMeetingId}'
        })
        .expectStatus(201)
        .stores('classificationId', 'id');
    });

    it('should get all client classifications', () => {
      return pactum
        .spec()
        .get('/client-classifications/all')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .expectStatus(200)
        .expectJsonLength(1);
    });

    it('should get a classification by ID', () => {
      return pactum
        .spec()
        .get('/client-classifications/$S{classificationId}')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .expectStatus(200)
        .expectBodyContains('FINANCIAL_SERVICES');
    });

    it('should get a classification by meeting ID', () => {
      return pactum
        .spec()
        .get('/client-classifications/meeting/$S{clientMeetingId}')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .expectStatus(200)
        .expectBodyContains('FINANCIAL_SERVICES');
    });

    it('should update a classification', () => {
      return pactum
        .spec()
        .patch('/client-classifications/$S{classificationId}')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .withBody(updateClassificationDto)
        .expectStatus(200)
        .expectBodyContains('"isPotentialClient":false')
        .expectBodyContains('0.85');
    });

    it('should not create duplicate classification for same meeting', () => {
      return pactum
        .spec()
        .post('/client-classifications')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .withBody({
          ...duplicateClassificationDto,
          clientMeetingId: '$S{clientMeetingId}'
        })
        .expectStatus(400)
        .expectBodyContains('A classification already exists for this client meeting');
    });

    it('should return error for non-existent meeting ID when creating classification', () => {
      return pactum
        .spec()
        .post('/client-classifications')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .withBody(invalidMeetingClassificationDto)
        .expectStatus(400)
        .expectBodyContains('Client meeting with the provided ID does not exist');
    });

    it('should return error for non-existent classification ID', () => {
      return pactum
        .spec()
        .get('/client-classifications/999999')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .expectStatus(404)
        .expectBodyContains('Client classification not found');
    });

    it('should delete a classification', () => {
      return pactum
        .spec()
        .delete('/client-classifications/$S{classificationId}')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .expectStatus(200)
        .expectBodyContains('Client classification deleted successfully');
    });

    it('should return error when trying to delete non-existent classification', () => {
      return pactum
        .spec()
        .delete('/client-classifications/$S{classificationId}')
        .withHeaders({ Authorization: 'Bearer $S{userToken}' })
        .expectStatus(404)
        .expectBodyContains('Client classification not found');
    });
  });
});
