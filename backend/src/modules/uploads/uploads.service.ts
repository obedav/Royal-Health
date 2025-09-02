// backend/src/modules/uploads/uploads.service.ts
import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../common/logger/logger.service';
import * as fs from 'fs';
import * as path from 'path';

export interface FileUploadResult {
  success: boolean;
  filename?: string;
  path?: string;
  size?: number;
  mimetype?: string;
  url?: string;
  error?: string;
}

@Injectable()
export class UploadsService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor(private readonly logger: AppLoggerService) {
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
      this.logger.log('Upload directory created', 'UploadsService');
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    options?: {
      folder?: string;
      maxSize?: number;
      allowedMimeTypes?: string[];
    },
  ): Promise<FileUploadResult> {
    try {
      // Validate file size
      if (options?.maxSize && file.size > options.maxSize) {
        return {
          success: false,
          error: `File size exceeds maximum allowed size of ${options.maxSize} bytes`,
        };
      }

      // Validate MIME type
      if (
        options?.allowedMimeTypes &&
        !options.allowedMimeTypes.includes(file.mimetype)
      ) {
        return {
          success: false,
          error: `File type ${file.mimetype} is not allowed`,
        };
      }

      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substr(2, 9);
      const extension = path.extname(file.originalname);
      const filename = `${timestamp}_${random}${extension}`;

      // Create subfolder if specified
      let uploadDir = this.uploadPath;
      if (options?.folder) {
        uploadDir = path.join(this.uploadPath, options.folder);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
      }

      const filePath = path.join(uploadDir, filename);

      // Write file to disk
      fs.writeFileSync(filePath, file.buffer);

      const result: FileUploadResult = {
        success: true,
        filename,
        path: filePath,
        size: file.size,
        mimetype: file.mimetype,
        url: `/uploads${options?.folder ? `/${options.folder}` : ''}/${filename}`,
      };

      this.logger.log(
        `File uploaded successfully: ${filename}`,
        'UploadsService',
      );
      return result;
    } catch (error) {
      this.logger.error(
        `File upload failed: ${error.message}`,
        error.stack,
        'UploadsService',
      );
      return {
        success: false,
        error: 'File upload failed',
      };
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    options?: {
      folder?: string;
      maxSize?: number;
      allowedMimeTypes?: string[];
    },
  ): Promise<FileUploadResult[]> {
    const results: FileUploadResult[] = [];

    for (const file of files) {
      const result = await this.uploadFile(file, options);
      results.push(result);
    }

    return results;
  }

  async deleteFile(filename: string, folder?: string): Promise<boolean> {
    try {
      const filePath = folder
        ? path.join(this.uploadPath, folder, filename)
        : path.join(this.uploadPath, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(
          `File deleted successfully: ${filename}`,
          'UploadsService',
        );
        return true;
      } else {
        this.logger.warn(
          `File not found for deletion: ${filename}`,
          'UploadsService',
        );
        return false;
      }
    } catch (error) {
      this.logger.error(
        `File deletion failed: ${error.message}`,
        error.stack,
        'UploadsService',
      );
      return false;
    }
  }

  getFileInfo(
    filename: string,
    folder?: string,
  ): {
    exists: boolean;
    size?: number;
    path?: string;
  } {
    try {
      const filePath = folder
        ? path.join(this.uploadPath, folder, filename)
        : path.join(this.uploadPath, filename);

      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return {
          exists: true,
          size: stats.size,
          path: filePath,
        };
      } else {
        return { exists: false };
      }
    } catch (error) {
      this.logger.error(
        `Error getting file info: ${error.message}`,
        error.stack,
        'UploadsService',
      );
      return { exists: false };
    }
  }

  // Predefined upload configurations
  static getImageUploadConfig() {
    return {
      folder: 'images',
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    };
  }

  static getDocumentUploadConfig() {
    return {
      folder: 'documents',
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ],
    };
  }

  static getMedicalRecordUploadConfig() {
    return {
      folder: 'medical-records',
      maxSize: 20 * 1024 * 1024, // 20MB
      allowedMimeTypes: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/dicom',
      ],
    };
  }
}
