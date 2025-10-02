import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, ForbiddenException } from '@nestjs/common'
import { UsuarioService } from './usuario.service'
import { CrearUsuarioDto, ActualizarUsuarioDto, CambiarPasswordDto } from './usuario.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { RolUsuario } from '../common/enums/rol-usuario.enum'

@Controller("usuarios")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @Roles(RolUsuario.ADMINISTRADOR)
  async crear(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return await this.usuarioService.crear(crearUsuarioDto)
  }

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.EVALUADOR)
  async obtenerTodos() {
    return await this.usuarioService.obtenerTodos()
  }

  @Get('perfil')
  async obtenerPerfil(@Request() req: any) {
    const userId = req.user.id
    return await this.usuarioService.obtenerPorId(userId)
  }

  @Get('evaluadores')
  @Roles(RolUsuario.ADMINISTRADOR)
  async obtenerEvaluadores() {
    return await this.usuarioService.obtenerPorRol(RolUsuario.EVALUADOR)
  }

  @Get('estudiantes')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.EVALUADOR)
  async obtenerEstudiantes() {
    return await this.usuarioService.obtenerPorRol(RolUsuario.ESTUDIANTE)
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.EVALUADOR)
  async obtenerPorId(@Param('id') id: string) {
    return await this.usuarioService.obtenerPorId(id)
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() actualizarUsuarioDto: ActualizarUsuarioDto, @Request() req: any) {
    // Solo administradores pueden actualizar otros usuarios, usuarios pueden actualizar su propio perfil
    const userId = req.user.id
    const userRole = req.user.rol
    
    if (userRole !== RolUsuario.ADMINISTRADOR && userId !== id) {
      throw new ForbiddenException('No tienes permisos para actualizar este usuario')
    }
    
    return await this.usuarioService.actualizar(id, actualizarUsuarioDto)
  }

  @Put('cambiar-password')
  async cambiarPassword(@Request() req: any, @Body() cambiarPasswordDto: CambiarPasswordDto) {
    const userId = req.user.id
    await this.usuarioService.cambiarPassword(userId, cambiarPasswordDto)
    return { mensaje: 'Password actualizado correctamente' }
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  async eliminar(@Param('id') id: string) {
    await this.usuarioService.eliminar(id)
    return { mensaje: 'Usuario eliminado correctamente' }
  }
}
