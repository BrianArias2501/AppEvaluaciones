import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileUpload } from './schemas/file-upload.schema';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(FileUpload.name)
    private fileUploadModel: Model<FileUpload>,
  ) {}

  async saveFileInfo(file: Express.Multer.File) {
    const fileUpload = new this.fileUploadModel({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      uploadDate: new Date(),
    });

    const savedFile = await fileUpload.save();

    return {
      id: savedFile._id,
      originalName: savedFile.originalName,
      filename: savedFile.filename,
      mimetype: savedFile.mimetype,
      size: savedFile.size,
      uploadDate: savedFile.uploadDate,
      downloadUrl: `/upload/file/${savedFile.filename}`,
    };
  }

  async downloadFile(filename: string, res: Response) {
    const file = await this.fileUploadModel.findOne({ filename });
    
    if (!file) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const filePath = join(process.cwd(), file.path);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException('Archivo físico no encontrado');
    }

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    
    return res.sendFile(filePath);
  }

  async deleteFile(id: string) {
    const file = await this.fileUploadModel.findById(id);
    
    if (!file) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const filePath = join(process.cwd(), file.path);
    
    // Eliminar archivo físico si existe
    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
      } catch (error) {
        console.error('Error al eliminar archivo físico:', error);
      }
    }

    // Eliminar registro de la base de datos
    await this.fileUploadModel.findByIdAndDelete(id);

    return {
      message: 'Archivo eliminado exitosamente',
      filename: file.originalName,
    };
  }

  async getAllFiles() {
    const files = await this.fileUploadModel.find().sort({ uploadDate: -1 });
    
    return files.map(file => ({
      id: file._id,
      originalName: file.originalName,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      uploadDate: file.uploadDate,
      downloadUrl: `/upload/file/${file.filename}`,
    }));
  }

  async getFileById(id: string) {
    const file = await this.fileUploadModel.findById(id);
    
    if (!file) {
      throw new NotFoundException('Archivo no encontrado');
    }

    return {
      id: file._id,
      originalName: file.originalName,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      uploadDate: file.uploadDate,
      downloadUrl: `/upload/file/${file.filename}`,
    };
  }

  async validateFileType(mimetype: string, allowedTypes: string[]): Promise<boolean> {
    return allowedTypes.includes(mimetype);
  }

  async validateFileSize(size: number, maxSize: number): Promise<boolean> {
    return size <= maxSize;
  }
}