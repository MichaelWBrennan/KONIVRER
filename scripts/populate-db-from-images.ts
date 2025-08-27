import { NestFactory } from "@nestjs/core";
import { AppModule } from "../backend/src/app.module";
import { OcrService } from "../backend/src/ocr/ocr.service";
import * as fs from "fs";
import * as path from "path";

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const ocrService = appContext.get(OcrService);

  const cardsDir = path.join(__dirname, "..", "public", "assets", "cards");
  const cardImageFiles = fs
    .readdirSync(cardsDir)
    .filter((f) => f.endsWith(".png") || f.endsWith(".webp"));

  console.log(`Found ${cardImageFiles.length} card images to process.`);

  for (const fileName of cardImageFiles) {
    const imagePath = path.join(cardsDir, fileName);
    const imageBuffer = fs.readFileSync(imagePath);

    const mockFile: Express.Multer.File = {
      fieldname: "file",
      originalname: fileName,
      encoding: "7bit",
      mimetype: `image/${path.extname(fileName).substring(1)}`,
      size: imageBuffer.length,
      buffer: imageBuffer,
      stream: null,
      destination: "",
      filename: "",
      path: "",
    };

    try {
      console.log(`Processing ${fileName}...`);
      const result = await ocrService.extractCardData(mockFile);
      console.log(`Successfully processed ${result.name}.`);
    } catch (error) {
      console.error(`Failed to process ${fileName}:`, error.message);
    }
  }

  await appContext.close();
  console.log("Database population script finished.");
}

bootstrap().catch((error) => {
  console.error("An unexpected error occurred:", error);
  process.exit(1);
});
