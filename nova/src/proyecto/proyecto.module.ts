import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ProyectoController } from "./proyecto.controller"
import { ProyectoService } from "./proyecto.service"
import { Proyecto, ProyectoSchema } from "./proyecto.model"
import { Usuario, UsuarioSchema } from "../usuario/usuario.model"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Proyecto.name, schema: ProyectoSchema },
      { name: Usuario.name, schema: UsuarioSchema }
    ])
  ],
  controllers: [ProyectoController],
  providers: [ProyectoService],
  exports: [ProyectoService],
})
export class ProyectoModule {}
