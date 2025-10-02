import { IsString, IsNumber, IsOptional, IsUUID, Min, Max, Length, IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'

export class CrearCalificacionDto {
  @IsUUID(4, { message: 'El ID de evaluación debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de evaluación es obligatorio' })
  evaluacionId: string

  @IsString({ message: 'El criterio debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El criterio es obligatorio' })
  @Length(3, 100, { message: 'El criterio debe tener entre 3 y 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  criterio: string

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El puntaje debe ser un número con máximo 2 decimales' })
  @Min(0, { message: 'El puntaje no puede ser negativo' })
  @Max(1000, { message: 'El puntaje no puede ser mayor a 1000' })
  puntaje: number

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El puntaje máximo debe ser un número con máximo 2 decimales' })
  @Min(0.01, { message: 'El puntaje máximo debe ser mayor a 0' })
  @Max(1000, { message: 'El puntaje máximo no puede ser mayor a 1000' })
  puntajeMaximo: number

  @IsOptional()
  @IsString({ message: 'Los comentarios deben ser una cadena de texto' })
  @Length(0, 1000, { message: 'Los comentarios no pueden exceder 1000 caracteres' })
  @Transform(({ value }) => value?.trim())
  comentarios?: string
}

export class ActualizarCalificacionDto {
  @IsOptional()
  @IsString({ message: 'El criterio debe ser una cadena de texto' })
  @Length(3, 100, { message: 'El criterio debe tener entre 3 y 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  criterio?: string

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El puntaje debe ser un número con máximo 2 decimales' })
  @Min(0, { message: 'El puntaje no puede ser negativo' })
  @Max(1000, { message: 'El puntaje no puede ser mayor a 1000' })
  puntaje?: number

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El puntaje máximo debe ser un número con máximo 2 decimales' })
  @Min(0.01, { message: 'El puntaje máximo debe ser mayor a 0' })
  @Max(1000, { message: 'El puntaje máximo no puede ser mayor a 1000' })
  puntajeMaximo?: number

  @IsOptional()
  @IsString({ message: 'Los comentarios deben ser una cadena de texto' })
  @Length(0, 1000, { message: 'Los comentarios no pueden exceder 1000 caracteres' })
  @Transform(({ value }) => value?.trim())
  comentarios?: string
}

export class FiltroCalificacionDto {
  @IsOptional()
  @IsUUID(4, { message: 'El ID de evaluación debe ser un UUID válido' })
  evaluacionId?: string

  @IsOptional()
  @IsUUID(4, { message: 'El ID de calificador debe ser un UUID válido' })
  calificadoPorId?: string

  @IsOptional()
  @IsString({ message: 'El criterio debe ser una cadena de texto' })
  @Transform(({ value }) => value?.trim())
  criterio?: string

  @IsOptional()
  @IsNumber({}, { message: 'El puntaje mínimo debe ser un número' })
  @Min(0, { message: 'El puntaje mínimo no puede ser negativo' })
  puntajeMinimo?: number

  @IsOptional()
  @IsNumber({}, { message: 'El puntaje máximo debe ser un número' })
  @Min(0, { message: 'El puntaje máximo no puede ser negativo' })
  puntajeMaximo?: number
}

export class CalificacionMasivaDto {
  @IsUUID(4, { message: 'El ID de evaluación debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de evaluación es obligatorio' })
  evaluacionId: string

  @IsNotEmpty({ message: 'Las calificaciones son obligatorias' })
  calificaciones: {
    criterio: string
    puntaje: number
    puntajeMaximo: number
    comentarios?: string
  }[]
}

export class EstadisticasCalificacionDto {
  @IsUUID(4, { message: 'El ID de evaluación debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de evaluación es obligatorio' })
  evaluacionId: string
}
