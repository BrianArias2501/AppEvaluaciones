import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AsignacionController } from "./asignacion.controller"
import { AsignacionService } from "./asignacion.service"
import { Asignacion, AsignacionSchema } from "./asignacion.model"

@Module({
  imports: [MongooseModule.forFeature([{ name: Asignacion.name, schema: AsignacionSchema }])],
  controllers: [AsignacionController],
  providers: [AsignacionService],
  exports: [AsignacionService],
})
export class AsignacionModule {}
