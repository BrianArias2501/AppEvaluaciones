import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UsuarioService } from "../usuario/usuario.service"
import type { UsuarioDocument } from "../usuario/usuario.model"
import type { LoginDto, RegisterDto } from "./auth.dto"
import type { JwtPayload, LoginResponse } from "./auth.model"
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    // Buscar usuario por correo o nombre de usuario
    let usuario = await this.usuarioService.obtenerPorCorreo(loginDto.usuario) as UsuarioDocument
    
    // Si no se encuentra por correo, intentar buscar por nombre de usuario
    if (!usuario) {
      usuario = await this.usuarioService.obtenerPorNombre(loginDto.usuario) as UsuarioDocument
    }

    if (!usuario) {
      throw new UnauthorizedException("Credenciales inválidas")
    }

    const passwordValido = await bcrypt.compare(loginDto.contrasena, usuario.contraseña)

    if (!usuario || !passwordValido || usuario.rol !== loginDto.rol) {
      throw new UnauthorizedException("Credenciales inválidas")
    }

    if (!usuario.activo) {
      throw new UnauthorizedException("Usuario inactivo")
    }

    const payload: JwtPayload = {
      sub: (usuario._id as any).toString(),
      correo: usuario.correo,
      rol: usuario.rol,
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (usuario._id as any).toString(),
        correo: usuario.correo,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        rol: usuario.rol,
      },
    }
  }

  async register(registerDto: RegisterDto): Promise<LoginResponse> {
    const usuario = await this.usuarioService.crear(registerDto) as UsuarioDocument

    const payload: JwtPayload = {
      sub: (usuario._id as any).toString(),
      correo: usuario.correo,
      rol: usuario.rol,
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (usuario._id as any).toString(),
        correo: usuario.correo,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        rol: usuario.rol,
      },
    }
  }

  async validateUser(payload: JwtPayload) {
    return await this.usuarioService.obtenerPorId(payload.sub)
  }
}
