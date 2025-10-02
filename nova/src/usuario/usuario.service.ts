import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { Usuario, UsuarioDocument } from './usuario.model'
import { CrearUsuarioDto, ActualizarUsuarioDto, CambiarPasswordDto } from './usuario.dto'
import { RolUsuario } from '../common/enums/rol-usuario.enum'

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>
  ) {}

  async crear(crearUsuarioDto: CrearUsuarioDto): Promise<Usuario> {
    try {
      // Validar campos obligatorios
      if (!crearUsuarioDto.nombre || crearUsuarioDto.nombre.trim().length < 2) {
        throw new BadRequestException('El nombre debe tener al menos 2 caracteres')
      }

      if (!crearUsuarioDto.apellidos || crearUsuarioDto.apellidos.trim().length < 2) {
        throw new BadRequestException('Los apellidos deben tener al menos 2 caracteres')
      }

      // Validar formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!crearUsuarioDto.correo || !emailRegex.test(crearUsuarioDto.correo)) {
        throw new BadRequestException('El formato del correo electrónico es inválido')
      }

      // Validar contraseña
      if (!crearUsuarioDto.contraseña || crearUsuarioDto.contraseña.length < 6) {
        throw new BadRequestException('La contraseña debe tener al menos 6 caracteres')
      }

      // Validar que la contraseña contenga al menos una letra y un número
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/
      if (!passwordRegex.test(crearUsuarioDto.contraseña)) {
        throw new BadRequestException('La contraseña debe contener al menos una letra y un número')
      }

      // Validar rol
      const rolesValidos = Object.values(RolUsuario)
      if (!crearUsuarioDto.rol || !rolesValidos.includes(crearUsuarioDto.rol)) {
        throw new BadRequestException('El rol especificado no es válido')
      }

      // Verificar si el correo ya existe
      const usuarioExistente = await this.usuarioModel.findOne({ 
        correo: crearUsuarioDto.correo.toLowerCase().trim() 
      })
      if (usuarioExistente) {
        throw new ConflictException('El correo ya está registrado')
      }

      // Verificar si ya existe un usuario con el mismo nombre completo
      const nombreCompleto = `${crearUsuarioDto.nombre.trim()} ${crearUsuarioDto.apellidos.trim()}`
      const usuarioMismoNombre = await this.usuarioModel.findOne({
        $and: [
          { nombre: crearUsuarioDto.nombre.trim() },
          { apellidos: crearUsuarioDto.apellidos.trim() }
        ]
      })
      if (usuarioMismoNombre) {
        throw new ConflictException('Ya existe un usuario con el mismo nombre y apellidos')
      }

      // Hashear la contraseña
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(crearUsuarioDto.contraseña, saltRounds)

      const nuevoUsuario = new this.usuarioModel({
        ...crearUsuarioDto,
        nombre: crearUsuarioDto.nombre.trim(),
        apellidos: crearUsuarioDto.apellidos.trim(),
        correo: crearUsuarioDto.correo.toLowerCase().trim(),
        contraseña: hashedPassword
      })

      return await nuevoUsuario.save()
    } catch (error) {
      if (error.code === 11000) {
        // Error de duplicado de MongoDB
        if (error.keyPattern?.correo) {
          throw new ConflictException('El correo ya está registrado')
        }
        throw new ConflictException('Ya existe un usuario con esos datos')
      }
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error
      }
      throw new BadRequestException('Error al crear el usuario')
    }
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return await this.usuarioModel.find({ activo: true }).exec()
  }

  async obtenerPorId(id: string): Promise<Usuario> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de usuario inválido')
    }

    const usuario = await this.usuarioModel.findById(id).exec()
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado')
    }

    return usuario
  }

  async obtenerPorCorreo(correo: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findOne({ correo, activo: true }).exec()
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado')
    }

    return usuario
  }

  async obtenerPorNombre(nombre: string): Promise<Usuario | null> {
    return await this.usuarioModel.findOne({ nombre, activo: true }).exec()
  }

  async actualizar(id: string, actualizarUsuarioDto: ActualizarUsuarioDto): Promise<Usuario> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID de usuario inválido')
      }

      // Verificar que el usuario existe
      const usuarioExistente = await this.usuarioModel.findById(id)
      if (!usuarioExistente) {
        throw new NotFoundException('Usuario no encontrado')
      }

      // Validar campos si se proporcionan
      if (actualizarUsuarioDto.nombre !== undefined) {
        if (!actualizarUsuarioDto.nombre || actualizarUsuarioDto.nombre.trim().length < 2) {
          throw new BadRequestException('El nombre debe tener al menos 2 caracteres')
        }
      }

      if (actualizarUsuarioDto.apellidos !== undefined) {
        if (!actualizarUsuarioDto.apellidos || actualizarUsuarioDto.apellidos.trim().length < 2) {
          throw new BadRequestException('Los apellidos deben tener al menos 2 caracteres')
        }
      }

      // Validar formato de correo si se proporciona
      if (actualizarUsuarioDto.correo !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!actualizarUsuarioDto.correo || !emailRegex.test(actualizarUsuarioDto.correo)) {
          throw new BadRequestException('El formato del correo electrónico es inválido')
        }

        // Verificar que el correo no esté en uso por otro usuario
        const correoEnUso = await this.usuarioModel.findOne({ 
          correo: actualizarUsuarioDto.correo.toLowerCase().trim(), 
          _id: { $ne: id } 
        })
        if (correoEnUso) {
          throw new ConflictException('El correo ya está registrado por otro usuario')
        }
      }

      // Validar rol si se proporciona
      if (actualizarUsuarioDto.rol !== undefined) {
        const rolesValidos = Object.values(RolUsuario)
        if (!rolesValidos.includes(actualizarUsuarioDto.rol)) {
          throw new BadRequestException('El rol especificado no es válido')
        }
      }

      // Verificar duplicado de nombre completo si se actualizan nombre o apellidos
      if (actualizarUsuarioDto.nombre !== undefined || actualizarUsuarioDto.apellidos !== undefined) {
        const nombreFinal = actualizarUsuarioDto.nombre?.trim() || usuarioExistente.nombre
        const apellidosFinal = actualizarUsuarioDto.apellidos?.trim() || usuarioExistente.apellidos
        
        const usuarioMismoNombre = await this.usuarioModel.findOne({
          $and: [
            { nombre: nombreFinal },
            { apellidos: apellidosFinal },
            { _id: { $ne: id } }
          ]
        })
        if (usuarioMismoNombre) {
          throw new ConflictException('Ya existe otro usuario con el mismo nombre y apellidos')
        }
      }

      // Preparar datos para actualización
      const datosActualizacion = { ...actualizarUsuarioDto }
      if (actualizarUsuarioDto.nombre) {
        datosActualizacion.nombre = actualizarUsuarioDto.nombre.trim()
      }
      if (actualizarUsuarioDto.apellidos) {
        datosActualizacion.apellidos = actualizarUsuarioDto.apellidos.trim()
      }
      if (actualizarUsuarioDto.correo) {
        datosActualizacion.correo = actualizarUsuarioDto.correo.toLowerCase().trim()
      }

      const usuarioActualizado = await this.usuarioModel
        .findByIdAndUpdate(id, datosActualizacion, { new: true, runValidators: true })
        .exec()

      if (!usuarioActualizado) {
        throw new NotFoundException('Error al actualizar el usuario')
      }

      return usuarioActualizado
    } catch (error) {
      if (error.code === 11000) {
        // Error de duplicado de MongoDB
        if (error.keyPattern?.correo) {
          throw new ConflictException('El correo ya está registrado')
        }
        throw new ConflictException('Ya existe un usuario con esos datos')
      }
      if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException('Error al actualizar el usuario')
    }
  }

  async cambiarPassword(id: string, cambiarPasswordDto: CambiarPasswordDto): Promise<void> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID de usuario inválido')
      }

      const usuario = await this.usuarioModel.findById(id).exec()
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado')
      }

      if (!usuario.activo) {
        throw new BadRequestException('No se puede cambiar la contraseña de un usuario inactivo')
      }

      // Validar contraseña actual
      if (!cambiarPasswordDto.contraseñaActual) {
        throw new BadRequestException('La contraseña actual es requerida')
      }

      const passwordValida = await bcrypt.compare(cambiarPasswordDto.contraseñaActual, usuario.contraseña)
      if (!passwordValida) {
        throw new BadRequestException('Contraseña actual incorrecta')
      }

      // Validar nueva contraseña
      if (!cambiarPasswordDto.contraseñaNueva || cambiarPasswordDto.contraseñaNueva.length < 6) {
        throw new BadRequestException('La nueva contraseña debe tener al menos 6 caracteres')
      }

      // Validar que la nueva contraseña contenga al menos una letra y un número
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/
      if (!passwordRegex.test(cambiarPasswordDto.contraseñaNueva)) {
        throw new BadRequestException('La nueva contraseña debe contener al menos una letra y un número')
      }

      // Verificar que la nueva contraseña sea diferente a la actual
      const mismPassword = await bcrypt.compare(cambiarPasswordDto.contraseñaNueva, usuario.contraseña)
      if (mismPassword) {
        throw new BadRequestException('La nueva contraseña debe ser diferente a la actual')
      }

      // Hashear nueva contraseña
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(cambiarPasswordDto.contraseñaNueva, saltRounds)

      await this.usuarioModel.findByIdAndUpdate(id, { contraseña: hashedPassword }).exec()
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException('Error al cambiar la contraseña')
    }
  }

  async eliminar(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de usuario inválido')
    }

    // Soft delete - marcar como inactivo
    const resultado = await this.usuarioModel.findByIdAndUpdate(id, { activo: false }).exec()
    if (!resultado) {
      throw new NotFoundException('Usuario no encontrado')
    }
  }

  async obtenerPorRol(rol: RolUsuario): Promise<Usuario[]> {
    return await this.usuarioModel.find({ rol, activo: true }).exec()
  }

  async validarCredenciales(correo: string, contraseña: string): Promise<Usuario | null> {
    const usuario = await this.usuarioModel.findOne({ correo, activo: true }).exec()
    if (!usuario) {
      return null
    }

    const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña)
    if (!passwordValida) {
      return null
    }

    return usuario
  }
}
