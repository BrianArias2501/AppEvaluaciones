import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Certificado, CertificadoDocument } from './certificado.model'
import { CrearCertificadoDto } from './certificado.dto'

@Injectable()
export class CertificadoService {
  constructor(
    @InjectModel(Certificado.name) private certificadoModel: Model<CertificadoDocument>
  ) {}

  async crear(crearCertificadoDto: CrearCertificadoDto): Promise<CertificadoDocument> {
    // Validar ObjectIds
    if (!Types.ObjectId.isValid(crearCertificadoDto.estudianteId)) {
      throw new BadRequestException('ID de estudiante inválido')
    }
    if (!Types.ObjectId.isValid(crearCertificadoDto.evaluacionId)) {
      throw new BadRequestException('ID de evaluación inválido')
    }

    // Verificar si ya existe un certificado para esta evaluación y estudiante
    const certificadoExistente = await this.certificadoModel
      .findOne({
        estudianteId: new Types.ObjectId(crearCertificadoDto.estudianteId),
        evaluacionId: new Types.ObjectId(crearCertificadoDto.evaluacionId)
      })
      .exec()

    if (certificadoExistente) {
      throw new BadRequestException('Ya existe un certificado para esta evaluación y estudiante')
    }

    const certificado = new this.certificadoModel({
      ...crearCertificadoDto,
      estudianteId: new Types.ObjectId(crearCertificadoDto.estudianteId),
      evaluacionId: new Types.ObjectId(crearCertificadoDto.evaluacionId),
      fechaEmision: new Date()
    })

    return await certificado.save()
  }

  async obtenerPorEstudiante(estudianteId: string): Promise<CertificadoDocument[]> {
    if (!Types.ObjectId.isValid(estudianteId)) {
      throw new BadRequestException('ID de estudiante inválido')
    }

    return await this.certificadoModel
      .find({ estudianteId: new Types.ObjectId(estudianteId) })
      .sort({ fechaEmision: -1 })
      .exec()
  }

  async obtenerPorId(id: string): Promise<CertificadoDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de certificado inválido')
    }

    const certificado = await this.certificadoModel
      .findById(id)
      .exec()

    if (!certificado) {
      throw new NotFoundException('Certificado no encontrado')
    }

    return certificado
  }

  async obtenerTodos(): Promise<CertificadoDocument[]> {
    return await this.certificadoModel
      .find()
      .sort({ fechaEmision: -1 })
      .exec()
  }

  async obtenerPorEvaluacion(evaluacionId: string): Promise<CertificadoDocument[]> {
    if (!Types.ObjectId.isValid(evaluacionId)) {
      throw new BadRequestException('ID de evaluación inválido')
    }

    return await this.certificadoModel
      .find({ evaluacionId: new Types.ObjectId(evaluacionId) })
      .sort({ fechaEmision: -1 })
      .exec()
  }

  async actualizar(id: string, datosActualizacion: Partial<CrearCertificadoDto>): Promise<CertificadoDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de certificado inválido')
    }

    const certificado = await this.certificadoModel
      .findByIdAndUpdate(
        id,
        { $set: datosActualizacion },
        { new: true, runValidators: true }
      )
      .exec()

    if (!certificado) {
      throw new NotFoundException('Certificado no encontrado')
    }

    return certificado
  }

  async cambiarEstado(id: string, nuevoEstado: string): Promise<CertificadoDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de certificado inválido')
    }

    const estadosValidos = ['ACTIVO', 'INACTIVO', 'VENCIDO']
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new BadRequestException('Estado inválido')
    }

    const certificado = await this.certificadoModel
      .findByIdAndUpdate(
        id,
        { $set: { estado: nuevoEstado } },
        { new: true }
      )
      .exec()

    if (!certificado) {
      throw new NotFoundException('Certificado no encontrado')
    }

    return certificado
  }

  async eliminar(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de certificado inválido')
    }

    const resultado = await this.certificadoModel
      .findByIdAndDelete(id)
      .exec()

    if (!resultado) {
      throw new NotFoundException('Certificado no encontrado')
    }
  }

  async verificarCertificado(numeroCertificado: string): Promise<CertificadoDocument> {
    const certificado = await this.certificadoModel
      .findOne({ numeroCertificado })
      .exec()

    if (!certificado) {
      throw new NotFoundException('Certificado no encontrado')
    }

    return certificado
  }

  async obtenerEstadisticas(): Promise<any> {
    const estadisticas = await this.certificadoModel.aggregate([
      {
        $group: {
          _id: '$estado',
          cantidad: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$cantidad' },
          porEstado: {
            $push: {
              estado: '$_id',
              cantidad: '$cantidad'
            }
          }
        }
      }
    ])

    return estadisticas[0] || { total: 0, porEstado: [] }
  }

  private generarNumeroCertificado(): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `CERT-${timestamp}-${random}`
  }
}
