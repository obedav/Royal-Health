// backend/src/common/pipes/file-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

export interface FileValidationOptions {
  maxSize?: number;
  allowedMimeTypes?: string[];
  required?: boolean;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions = {}) {}

  transform(
    file: Express.Multer.File | Express.Multer.File[],
  ): Express.Multer.File | Express.Multer.File[] {
    if (!file && this.options.required) {
      throw new BadRequestException('File is required');
    }

    if (!file) {
      return file;
    }

    if (Array.isArray(file)) {
      file.forEach((f) => this.validateSingleFile(f));
    } else {
      this.validateSingleFile(file);
    }

    return file;
  }

  private validateSingleFile(file: Express.Multer.File): void {
    // Validate file size
    if (this.options.maxSize && file.size > this.options.maxSize) {
      throw new BadRequestException(
        `File size ${file.size} exceeds maximum allowed size of ${this.options.maxSize} bytes`,
      );
    }

    // Validate MIME type
    if (
      this.options.allowedMimeTypes &&
      !this.options.allowedMimeTypes.includes(file.mimetype)
    ) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.options.allowedMimeTypes.join(', ')}`,
      );
    }

    // Validate file name (basic security check)
    const filename = file.originalname;
    const dangerousPatterns = [
      /\.\./, // Directory traversal
      /[<>:"|?*]/, // Windows invalid characters
      /^\./, // Hidden files
      /\.(exe|bat|cmd|scr|com|pif)$/i, // Executable files
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(filename)) {
        throw new BadRequestException('Invalid file name or type detected');
      }
    }
  }
}

// Predefined validation pipes
export const ImageValidationPipe = new FileValidationPipe({
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
});

export const DocumentValidationPipe = new FileValidationPipe({
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
});

export const MedicalRecordValidationPipe = new FileValidationPipe({
  maxSize: 20 * 1024 * 1024, // 20MB
  allowedMimeTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/dicom',
  ],
});
