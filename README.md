# Backend Vambe

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0+-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.12+-darkblue.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7+-red.svg)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green.svg)](https://openai.com/)

A comprehensive **sales management and AI-powered client classification system** built with NestJS, featuring automated AI analysis of client meetings, KPI tracking, and real-time data processing through microservices architecture.

> **🎥 Project Development**: This project was built following the tutorial: [Building a NestJS REST API with Prisma and PostgreSQL](https://youtu.be/GHTA143_b-s?si=HB7KmacKaf6QG2yi)

> **🖥️ Frontend Integration**: This backend is designed to work with the frontend application: [Frontend Vambe](https://github.com/dvaldesg/frontend-vambe)

## ✨ Features

### 🤖 AI-Powered Client Classification
- **Automated Meeting Analysis**: Uses OpenAI GPT-4o-mini to analyze meeting transcriptions
- **Smart Client Categorization**: Classifies clients by commercial sector, lead source, and interest reason
- **Business Intelligence**: Determines client potential, tech requirements, and interaction estimates
- **Queue-based Processing**: Asynchronous classification jobs using Redis and Bull queues
- **Confidence Scoring**: AI-generated confidence scores for classification accuracy

### 👥 Sales Management
- **Salesman Management**: Complete CRUD operations for sales team members
- **Meeting Tracking**: Comprehensive client meeting management with transcription support
- **Deal Status**: Track closed/open deals and follow-up requirements
- **Bulk Import**: CSV file processing for batch meeting imports

### 📊 Analytics & KPIs
- **Performance Metrics**: Salesman performance tracking with temporal data
- **Success Rate Analysis**: Commercial sector-based success rate calculations
- **Temporal Analytics**: Month-over-month performance comparisons
- **Data Visualization Ready**: Structured data for frontend dashboards

### 🔐 Security & Authentication
- **JWT Authentication**: Secure API access with JSON Web Tokens
- **Role-based Access**: Protected endpoints with guard-based security
- **Password Hashing**: Argon2 encryption for user credentials
- **Session Management**: Stateless authentication system

### 🏗️ Architecture & Infrastructure
- **Microservices Design**: Separate API and AI Worker services
- **Event-driven Processing**: Redis-based job queues for scalability
- **Database Management**: Prisma ORM with PostgreSQL
- **Containerized Deployment**: Full Docker Compose orchestration
- **Development Tools**: Hot reload, testing, and debugging support

### 📁 Data Management
- **Schema Management**: Prisma migrations with version control
- **Data Seeding**: Automated initial data population
- **CSV Processing**: Intelligent CSV parsing with error handling
- **Data Validation**: Comprehensive input validation with class-validator

## 🛠 Requirements

Before running the application, ensure you have the following installed:

- **[Docker](https://docs.docker.com/get-docker/)** and **[Docker Compose](https://docs.docker.com/compose/install/)**
- **[Node.js](https://nodejs.org/en/download/)** (version 20 or higher)
- **[Git](https://git-scm.com/downloads)**

### Additional Resources
- **[PostgreSQL Documentation](https://www.postgresql.org/docs/)**
- **[Redis Documentation](https://redis.io/docs/)**
- **[Prisma Getting Started](https://www.prisma.io/docs/getting-started)**
- **[NestJS Documentation](https://docs.nestjs.com/)**

## 🚀 Initial Setup

### 1. Environment Configuration

First, configure your environment variables. There's a `.env.example` file in the project root that you can use as a template.

```bash
cp .env.example .env
```

**Important**: You need to copy the `.env` file to both services:

```bash
# Copy .env to the api directory
cp .env ./api/.env

# Copy .env to the ai-worker directory  
cp .env ./ai-worker/.env
```

Then edit the `.env` file with your specific values:

```bash
# Database
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database_name

DATABASE_URL="postgresql://your_username:your_password@localhost:5434/your_database_name?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Important:** Keep database configurations consistent across all 3 sections (individual variables and DATABASE_URL).

> **📦 For Vambe Team**: The complete `.env` configuration file with all necessary values will be provided separately in a ZIP package for security purposes.

### 2. Database and Prisma Setup

**⚠️ Do NOT run `docker compose up --build` directly**, as it will fail because Prisma needs to be configured first.

Follow these steps in order:

#### Step 1: Start Database Only

```bash
docker compose up --build dev-db -d
```

#### Step 2: Run Prisma Migrations (API)

```bash
docker compose run --rm api npx prisma migrate dev --name init
```

#### Step 3: Generate Prisma Client (AI Worker)

```bash
docker compose run --rm ai-worker npx prisma generate
```

#### Step 4: Start Full Application

```bash
docker compose up --build
```

If this is your first time running the application, you can start using it immediately. However, if you add a new meeting, it might take some time because the seed data is loading and the queue processes requests one by one between Redis and the AI worker to prevent API overload.

## 🌐 Available Services

Once the application is running, you'll have access to the following services:

- **Main API**: `http://localhost:3333`
- **AI Worker**: `http://localhost:3343`
- **Redis**: `localhost:6379`
- **PostgreSQL Database (dev)**: `localhost:5434`
- **PostgreSQL Database (test)**: `localhost:5435`
- **Prisma Studio** (if enabled): `http://localhost:5555`

## 🔧 Local Development

For local development, make sure to add CORS for `http://localhost:3333` in your configuration if you plan to make requests from the frontend. You should do this in [main.ts](./api/src/main.ts).

### API Endpoints Overview

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

#### Salesmen Management
- `GET /salesmen/all` - List all salesmen
- `POST /salesmen` - Create new salesman
- `GET /salesmen/:id` - Get salesman by ID

#### Client Meetings
- `GET /client-meetings/all` - List all meetings
- `POST /client-meetings` - Create new meeting
- `GET /client-meetings/:id` - Get meeting by ID

#### Client Classifications
- `GET /client-classifications/all` - List all classifications
- `POST /client-classifications` - Create manual classification
- `GET /client-classifications/:id` - Get classification by ID
- `PATCH /client-classifications/:id` - Update classification
- `DELETE /client-classifications/:id` - Delete classification

#### Data Import
- `POST /csv-parser/process-meetings` - Bulk import meetings from CSV

#### KPIs & Analytics
- Various KPI endpoints for performance tracking

### Additional Scripts

In the `api/` directory, you have several useful scripts available:

```bash
# Restart development database
npm run db:dev:restart

# Restart testing database
npm run db:test:restart

# Run migrations
npm run prisma:dev:deploy

# Run data seeds
npm run seed

# Tests
npm run test
npm run test:e2e
```

## 📁 Project Structure

```
├── api/                    # Main API service
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── client_meeting/ # Meeting management
│   │   ├── client_classification/ # Classification CRUD
│   │   ├── salesman/      # Salesman management
│   │   ├── ai-classification/ # AI job queueing
│   │   ├── csv_parser/    # CSV import functionality
│   │   ├── kpi/          # Analytics and KPIs
│   │   ├── user/         # User management
│   │   ├── queue/        # Redis queue management
│   │   └── prisma/       # Database service
│   └── prisma/           # Database schemas and migrations
├── ai-worker/             # AI processing service
│   └── src/
│       └── ai-classification/ # OpenAI integration and processing
├── docker-compose.yml     # Container orchestration
└── .env                  # Environment variables (not in git)
```

## 🧪 Testing

The application includes comprehensive testing capabilities:

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🚨 Troubleshooting

### Issue: Error running docker compose up directly

**Solution**: Make sure to follow the Prisma configuration steps before starting all services.

### Issue: Database connection error

**Solution**: Verify that your environment variables in `.env` are correct and the database is running.

### Issue: Port conflicts

**Solution**: If you have other services running on the mentioned ports, you can change them in the `docker-compose.yml`.

### Issue: AI Worker not processing jobs

**Solution**: 
1. Check that your OpenAI API key is valid
2. Verify Redis is running properly
3. Check AI Worker logs: `docker logs ai-worker`

### Issue: Classification jobs failing

**Solution**:
1. Ensure meeting transcriptions are not empty
2. Verify OpenAI API quotas and limits
3. Check the AI Worker service logs for detailed error messages

## 🏭 Production Considerations

For production deployment, ensure you:

1. **Change all sensitive variables** in `.env`
2. **Use a secure JWT_SECRET**
3. **Configure appropriate OpenAI variables**
4. **Review CORS configuration** in the application code
5. **Set up proper SSL/TLS certificates**
6. **Configure database backups**
7. **Set up monitoring and logging**
8. **Scale Redis and PostgreSQL** appropriately

## 📚 Documentation Links

- **[NestJS Documentation](https://docs.nestjs.com/)**
- **[Prisma Documentation](https://www.prisma.io/docs/)**
- **[Bull Queue Documentation](https://docs.bullmq.io/)**
- **[OpenAI API Documentation](https://platform.openai.com/docs/)**
- **[PostgreSQL Documentation](https://www.postgresql.org/docs/)**
- **[Redis Documentation](https://redis.io/docs/)**
- **[Docker Compose Documentation](https://docs.docker.com/compose/)**

## 🎨 Creative Process

The following images showcase the development and design process:

![Creative Process Image 1](./readme-images/schema-prev.png)
*Schema planning*

![Creative Process Image 2](./readme-images/system-design.png)
*System design planning*

## 🚀 Future Improvements & Wishlist

Here are features and improvements that i would loved to implement:

### 🔐 **Enhanced Security & Role Management**
- **Token-based Role Management**: Implement comprehensive role-based access control through JWT tokens, especially on the topic of uploading csv
- **API Gateway**: Add quota limiting and enhanced token security through a dedicated API gateway
- **Advanced Authentication**: Multi-level permissions for different user types and access patterns

### 🤖 **Advanced AI Classification**
- **Custom Client Profiling**: AI classification tailored specifically for Vambe's ideal client profile
- **Salesman Behavior Analysis**: Individual salesman performance classification based on behavioral patterns
- **Predictive Analytics**: ML models to predict deal closure probability and optimal follow-up timing

### 🏗️ **Infrastructure & DevOps**
- **Continuous Integration**: Implement the existing test suite in CI pipelines for automated testing
- **Continuous Deployment**: Set up CD pipeline to automatically deploy to EC2 instances

### ☁️ **Cloud Architecture**
- **AWS RDS Integration**: Replace local PostgreSQL with managed AWS RDS for better reliability and backup
- **Microservices Distribution**: Separate AI Worker into independent EC2 instances for better performance
- **Load Balancing**: Implement proper load balancing for high-availability deployments

### 📊 **Analytics & Monitoring**
- **Real-time Dashboards**: Live KPI monitoring and performance metrics
- **Advanced Reporting**: Comprehensive business intelligence reports
- **System Monitoring**: Full observability with logging, metrics, and alerting

> **Note**: These improvements would require additional development time and infrastructure setup that wasn't feasible within the current project timeline, but represent the natural evolution of this system for production use. Anyways, kind of an overkill...
