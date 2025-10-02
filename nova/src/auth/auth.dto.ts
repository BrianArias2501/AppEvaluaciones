import { IsEmail, IsString, IsEnum, MinLength, MaxLength, Matches, IsNotEmpty, IsOptional } from "class-validator"
import { RolUsuario } from "../common/enums/rol-usuario.enum"

export class LoginDto {
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El usuario es requerido' })
  usuario: string

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string

  @IsEnum(RolUsuario, { message: 'El rol debe ser válido (Admin, Evaluador, Estudiante)' })
  @IsNotEmpty({ message: 'El rol es requerido' })
  rol: RolUsuario
}

export class RegisterDto {
  @IsEmail({}, { message: 'Debe proporcionar un correo válido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  correo: string

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder 50 caracteres' })
  contraseña: string

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
  nombre: string

  @IsOptional()
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  @MinLength(2, { message: 'Los apellidos deben tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'Los apellidos no pueden exceder 50 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'Los apellidos solo pueden contener letras y espacios' })
  apellidos?: string

  @IsEnum(RolUsuario, { message: 'El rol debe ser válido (Admin, Evaluador, Estudiante)' })
  rol: RolUsuario
}

export class ChangePasswordDto {
  @IsString({ message: 'La contraseña actual debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  contraseñaActual: string

  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La nueva contraseña no puede exceder 50 caracteres' })
  contraseñaNueva: string
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Debe proporcionar un correo válido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  correo: string
}

export class ResetPasswordDto {
  @IsString({ message: 'El token es requerido' })
  @IsNotEmpty({ message: 'El token no puede estar vacío' })
  token: string

  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La nueva contraseña no puede exceder 50 caracteres' })
  contraseñaNueva: string
}

export class RefreshTokenDto {
  @IsString({ message: 'El refresh token debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El refresh token es requerido' })
  refreshToken: string
}
