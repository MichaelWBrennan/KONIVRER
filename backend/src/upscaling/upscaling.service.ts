import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { upscale } from "pixteroid";
import axios from "axios";
import * as fs from "fs/promises";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UpscalingService {
  private readonly tempDir = path.join(__dirname, "..", "..", "temp");

  constructor() {
    this.initTempDir();
  }

  private async initTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create temp directory:", error);
    }
  }

  async upscaleImage(
    imageUrl: string,
    level: "level1" | "level2" | "level3"
  ): Promise<Buffer> {
    if (!imageUrl) {
      throw new BadRequestException("Image URL is required.");
    }

    const tempId = uuidv4();
    const inputPath = path.join(this.tempDir, `${tempId}_input.png`);
    const outputPath = path.join(this.tempDir, `${tempId}_output.png`);

    try {
      // 1. Download the image
      const response = await axios({
        url: imageUrl,
        responseType: "arraybuffer",
      });
      await fs.writeFile(inputPath, response.data);

      // 2. Upscale the image
      await upscale(inputPath, outputPath, level);

      // 3. Read the upscaled image into a buffer
      const upscaledBuffer = await fs.readFile(outputPath);

      return upscaledBuffer;
    } catch (error) {
      console.error("Image upscaling failed:", error);
      throw new InternalServerErrorException("Failed to upscale image.");
    } finally {
      // 4. Clean up temporary files
      await this.cleanupFile(inputPath);
      await this.cleanupFile(outputPath);
    }
  }

  private async cleanupFile(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error(`Failed to delete temp file ${filePath}:`, error);
      }
    }
  }
}
