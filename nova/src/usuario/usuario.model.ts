import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { RolUsuario } from '../common/enums/rol-usuario.enum'

export type UsuarioDocument = Usuario & Document

@Schema({ 
  collection: 'usuarios',
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Usuario {
  @Prop({ unique: true, required: true, index: true })
  correo: string

  @Prop({ required: true })
  contraseña: string

  @Prop({ required: true })
  nombre: string

  @Prop({ required: false })
  apellidos: string

  @Prop({ 
    type: String,
    enum: Object.values(RolUsuario),
    default: RolUsuario.ESTUDIANTE 
  })
  rol: RolUsuario

  @Prop({ default: true })
  activo: boolean

  fechaCreacion: Date
  fechaActualizacion: Date
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario)

// Índices
UsuarioSchema.index({ correo: 1 }, { unique: true })
UsuarioSchema.index({ rol: 1 })
UsuarioSchema.index({ activo: 1 })

// Virtuals para relaciones
UsuarioSchema.virtual('proyectosCreados', {
  ref: 'Proyecto',
  localField: '_id',
  foreignField: 'creadorId'
})

UsuarioSchema.virtual('proyectosAsignados', {
  ref: 'Proyecto', 
  localField: '_id',
  foreignField: 'evaluadorAsignadoId'
})

UsuarioSchema.virtual('evaluacionesComoEstudiante', {
  ref: 'Evaluacion',
  localField: '_id', 
  foreignField: 'estudianteId'
})

UsuarioSchema.virtual('evaluacionesComoEvaluador', {
  ref: 'Evaluacion',
  localField: '_id',
  foreignField: 'evaluadorId' 
})

UsuarioSchema.virtual('certificados', {
  ref: 'Certificado',
  localField: '_id',
  foreignField: 'estudianteId'
})

UsuarioSchema.virtual('historial', {
  ref: 'Historial',
  localField: '_id', 
  foreignField: 'usuarioId'
})
