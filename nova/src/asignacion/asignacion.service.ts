import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Asignacion, AsignacionDocument } from './asignacion.model'
import { CrearAsignacionDto, ActualizarAsignacionDto } from './asignacion.dto'

@Injectable()
export class AsignacionService {
  constructor(
    @InjectModel(Asignacion.name) private asignacionModel: Model<AsignacionDocument>
  ) {}

  async crear(crearAsignacionDto: CrearAsignacionDto): Promise<Asignacion> {
    const asignacion = new this.asignacionModel({
      ...crearAsignacionDto,
      proyectoId: new Types.ObjectId(crearAsignacionDto.proyectoId),
      evaluadorId: new Types.ObjectId(crearAsignacionDto.evaluadorId),
      estudianteId: new Types.ObjectId(crearAsignacionDto.estudianteId)
    })
    return await asignacion.save()
  }

  async obtenerTodas(): Promise<Asignacion[]> {
    return await this.asignacionModel
      .find()
      .populate('proyecto')
      .populate('evaluador')
      .populate('estudiante')
      .populate('evaluacion')
      .exec()
  }

  async obtenerPorId(id: string): Promise<Asignacion> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de asignación inválido')
    }

    const asignacion = await this.asignacionModel
      .findById(id)
      .populate('proyecto')
      .populate('evaluador')
      .populate('estudiante')
      .populate('evaluacion')
      .exec()

    if (!asignacion) {
      throw new NotFoundException('Asignación no encontrada')
    }

    return asignacion
  }

  async asignarProyecto(
    proyectoId: string,
    evaluadorId: string,
    estudianteId: string
  ): Promise<Asignacion> {
    const asignacion = new this.asignacionModel({
      proyectoId: new Types.ObjectId(proyectoId),
      evaluadorId: new Types.ObjectId(evaluadorId),
      estudianteId: new Types.ObjectId(estudianteId),
      estado: 'PENDIENTE'
    })
    return await asignacion.save()
  }

  async actualizar(
    id: string,
    actualizarAsignacionDto: ActualizarAsignacionDto
  ): Promise<Asignacion> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de asignación inválido')
    }

    const updateData: any = { ...actualizarAsignacionDto }
    
    // Convertir IDs a ObjectId si están presentes
    if (updateData.proyectoId) {
      updateData.proyectoId = new Types.ObjectId(updateData.proyectoId)
    }
    if (updateData.evaluadorId) {
      updateData.evaluadorId = new Types.ObjectId(updateData.evaluadorId)
    }
    if (updateData.estudianteId) {
      updateData.estudianteId = new Types.ObjectId(updateData.estudianteId)
    }
    if (updateData.evaluacionId) {
      updateData.evaluacionId = new Types.ObjectId(updateData.evaluacionId)
    }

    const asignacion = await this.asignacionModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('proyecto')
      .populate('evaluador')
      .populate('estudiante')
      .populate('evaluacion')
      .exec()

    if (!asignacion) {
      throw new NotFoundException('Asignación no encontrada')
    }

    return asignacion
  }

  async obtenerPorEvaluador(evaluadorId: string): Promise<Asignacion[]> {
    if (!Types.ObjectId.isValid(evaluadorId)) {
      return []
    }

    return await this.asignacionModel
      .find({ evaluadorId: new Types.ObjectId(evaluadorId) })
      .populate('proyecto')
      .populate('estudiante')
      .exec()
  }

  async obtenerPorEstudiante(estudianteId: string): Promise<Asignacion[]> {
    if (!Types.ObjectId.isValid(estudianteId)) {
      return []
    }

    return await this.asignacionModel
      .find({ estudianteId: new Types.ObjectId(estudianteId) })
      .populate('proyecto')
      .populate('evaluador')
      .exec()
  }

  async obtenerPorProyecto(proyectoId: string): Promise<Asignacion[]> {
    if (!Types.ObjectId.isValid(proyectoId)) {
      return []
    }

    return await this.asignacionModel
      .find({ proyectoId: new Types.ObjectId(proyectoId) })
      .populate('evaluador')
      .populate('estudiante')
      .populate('evaluacion')
      .exec()
  }

  async eliminar(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de asignación inválido')
    }

    const resultado = await this.asignacionModel.findByIdAndDelete(id).exec()
    
    if (!resultado) {
      throw new NotFoundException('Asignación no encontrada')
    }
  }

  async completarAsignacion(id: string, evaluacionId?: string): Promise<Asignacion> {
    const updateData: any = {
      estado: 'COMPLETADA',
      fechaCompletado: new Date()
    }

    if (evaluacionId) {
      updateData.evaluacionId = new Types.ObjectId(evaluacionId)
    }

    return await this.actualizar(id, updateData)
  }
}
