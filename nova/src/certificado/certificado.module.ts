import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CertificadoController } from "./certificado.controller"
import { CertificadoService } from "./certificado.service"
import { Certificado, CertificadoSchema } from "./certificado.model"

@Module({
  imports: [MongooseModule.forFeature([{ name: Certificado.name, schema: CertificadoSchema }])],
  controllers: [CertificadoController],
  providers: [CertificadoService],
  exports: [CertificadoService],
})
export class CertificadoModule {}
