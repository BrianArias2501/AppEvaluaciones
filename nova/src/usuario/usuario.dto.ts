import { IsString, IsEmail, IsOptional, IsEnum, MinLength, Matches } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { RolUsuario } from '../common/enums/rol-usuario.enum'

export class CrearUsuarioDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  correo: string

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña: string

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre: string

  @IsOptional()
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  apellidos?: string

  @IsOptional()
  @IsEnum(RolUsuario, { message: 'El rol debe ser Admin, Evaluador o Estudiante' })
  rol?: RolUsuario

  @IsOptional()
  activo?: boolean
}

export class ActualizarUsuarioDto extends PartialType(CrearUsuarioDto) {
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  correo?: string

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre?: string

  @IsOptional()
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  apellidos?: string

  @IsOptional()
  @IsEnum(RolUsuario, { message: 'El rol debe ser Admin, Evaluador o Estudiante' })
  rol?: RolUsuario

  @IsOptional()
  activo?: boolean
}

export class CambiarPasswordDto {
  @IsString({ message: 'La contraseña actual debe ser una cadena de texto' })
  contraseñaActual: string

  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  contraseñaNueva: string
}

export class FiltroUsuarioDto {
  @IsOptional()
  @IsEnum(RolUsuario, { message: 'El rol debe ser ESTUDIANTE, EVALUADOR o ADMINISTRADOR' })
  rol?: RolUsuario

  @IsOptional()
  activo?: boolean

  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  busqueda?: string
}
