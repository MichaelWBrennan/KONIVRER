import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend integration
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Global prefix for API routes
  app.setGlobalPrefix("api/v1");

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle("KONIVRER Enterprise Platform API")
    .setDescription(
      "Enterprise-grade TCG platform with card database, deck management, tournaments, and game simulation"
    )
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("cards", "Card database and search operations")
    .addTag("decks", "Deck management and analytics")
    .addTag("users", "User management and profiles")
    .addTag("auth", "Authentication and authorization")
    .addTag("tournaments", "Tournament organization and management")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 KONIVRER Backend running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
