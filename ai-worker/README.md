# AI Worker Setup

El AI Worker está configurado para procesar las clasificaciones de reuniones usando OpenAI y guardarlas en la base de datos.

## Configuración Completada

1. ✅ Instalación de Prisma y cliente de Prisma
2. ✅ Configuración del servicio y módulo de Prisma  
3. ✅ Instalación de dependencias para colas (Bull, Redis, OpenAI)
4. ✅ Creación del servicio de clasificación AI
5. ✅ Configuración del consumidor de colas
6. ✅ Dockerización del ai-worker
7. ✅ Integración en docker-compose.yml (puerto 3343)

## Arquitectura

- **API**: Se encarga de encolar trabajos de clasificación usando `AiClassificationService.enqueueClassificationJob()`
- **AI Worker**: Consume los trabajos de Redis y procesa las clasificaciones usando OpenAI, guardándolas en la base de datos

## Variables de Entorno Necesarias

Asegúrate de tener estas variables en tu archivo `.env`:

```env
# Database
DATABASE_URL="postgresql://usuario:password@dev-db:5432/vambe_db"

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# OpenAI
OPENAI_API_KEY=tu_api_key_de_openai
```

## Cómo Usar

1. **Levantar todos los servicios:**
   ```bash
   docker-compose up -d
   ```

2. **Ver logs del ai-worker:**
   ```bash
   docker-compose logs -f ai-worker
   ```

3. **Encolar un trabajo desde la API:**
   El servicio en la API ya tiene el método `enqueueClassificationJob()` configurado. Solo descomenta las líneas necesarias.

## Flujo de Trabajo

1. La API recibe una reunión con transcripción
2. La API encola un trabajo de clasificación usando `AiClassificationService.enqueueClassificationJob()`
3. El AI Worker consume el trabajo de Redis
4. El AI Worker procesa la transcripción con OpenAI
5. El AI Worker guarda la clasificación en la base de datos
6. El trabajo se marca como completado

## Testing

Para probar que todo funciona:

1. Crea una reunión con transcripción en la API
2. Llama al endpoint para clasificar la reunión
3. Verifica en los logs del ai-worker que se procesó
4. Verifica en la base de datos que se creó la clasificación

## Puertos

- API: 3333
- AI Worker: 3343  
- Redis: 6379
- PostgreSQL: 5434
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
