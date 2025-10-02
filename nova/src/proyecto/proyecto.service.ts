import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Proyecto, ProyectoDocument } from './proyecto.model';
import { CrearProyectoDto, ActualizarProyectoDto, FiltroProyectoDto } from './proyecto.dto';
import { EstadoProyecto } from '../common/enums/estado-proyecto.enum';
import { RolUsuario } from '../common/enums/rol-usuario.enum';
import { Usuario, UsuarioDocument } from '../usuario/usuario.model';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectModel(Proyecto.name) private proyectoModel: Model<ProyectoDocument>,
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
  ) {}

  async crear(crearProyectoDto: CrearProyectoDto, creadorId: string): Promise<ProyectoDocument> {
    // Validar que el creadorId sea un ObjectId válido
    if (!Types.ObjectId.isValid(creadorId)) {
      throw new BadRequestException('ID de creador inválido');
    }

    // Validar fechas de entrega
    if (crearProyectoDto.fechaEntrega) {
      const fechaEntrega = new Date(crearProyectoDto.fechaEntrega);
      const ahora = new Date();
      
      if (fechaEntrega <= ahora) {
        throw new BadRequestException('La fecha de entrega debe ser posterior a la fecha actual');
      }

      // Validar que la fecha de entrega no sea más de 2 años en el futuro
      const dosAñosEnFuturo = new Date();
      dosAñosEnFuturo.setFullYear(dosAñosEnFuturo.getFullYear() + 2);
      if (fechaEntrega > dosAñosEnFuturo) {
        throw new BadRequestException('La fecha de entrega no puede ser más de 2 años en el futuro');
      }
    }

    // Validar evaluador asignado si se proporciona
    if (crearProyectoDto.evaluadorAsignadoId) {
      if (!Types.ObjectId.isValid(crearProyectoDto.evaluadorAsignadoId)) {
        throw new BadRequestException('ID de evaluador inválido');
      }

      const evaluador = await this.usuarioModel.findById(crearProyectoDto.evaluadorAsignadoId);
      if (!evaluador) {
        throw new NotFoundException('Evaluador no encontrado');
      }

      if (evaluador.rol !== RolUsuario.EVALUADOR && evaluador.rol !== RolUsuario.ADMINISTRADOR) {
        throw new BadRequestException('El usuario asignado debe tener rol de evaluador o administrador');
      }

      if (!evaluador.activo) {
        throw new BadRequestException('El evaluador asignado debe estar activo');
      }
    }

    // Nota: fichaId no está disponible en ActualizarProyectoDto

    // Validar datos básicos
    if (!crearProyectoDto.nombre || crearProyectoDto.nombre.trim().length < 3) {
      throw new BadRequestException('El nombre debe tener al menos 3 caracteres');
    }

    if (!crearProyectoDto.descripcion || crearProyectoDto.descripcion.trim().length < 10) {
      throw new BadRequestException('La descripción debe tener al menos 10 caracteres');
    }

    const proyectoData = {
      ...crearProyectoDto,
      creadorId: new Types.ObjectId(creadorId),
      evaluadorAsignadoId: crearProyectoDto.evaluadorAsignadoId 
        ? new Types.ObjectId(crearProyectoDto.evaluadorAsignadoId) 
        : undefined,
      // fichaId no está disponible en CrearProyectoDto
       fichaId: null,
    };

    try {
      const proyecto = new this.proyectoModel(proyectoData);
      return await proyecto.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Ya existe un proyecto con ese título');
      }
      throw new BadRequestException('Error al crear el proyecto');
    }
  }

  async obtenerTodos(filtros?: FiltroProyectoDto): Promise<ProyectoDocument[]> {
    const query: any = {};

    if (filtros?.creadorId) {
      if (!Types.ObjectId.isValid(filtros.creadorId)) {
        throw new BadRequestException('ID de creador inválido');
      }
      query.creadorId = new Types.ObjectId(filtros.creadorId);
    }

    if (filtros?.evaluadorAsignadoId) {
      if (!Types.ObjectId.isValid(filtros.evaluadorAsignadoId)) {
        throw new BadRequestException('ID de evaluador inválido');
      }
      query.evaluadorAsignadoId = new Types.ObjectId(filtros.evaluadorAsignadoId);
    }

    if (filtros?.estado) {
      query.estado = filtros.estado;
    }

    if (filtros?.busqueda) {
      query.$or = [
        { titulo: { $regex: filtros.busqueda, $options: 'i' } },
        { descripcion: { $regex: filtros.busqueda, $options: 'i' } },
        { requisitos: { $regex: filtros.busqueda, $options: 'i' } },
      ];
    }

    if (filtros?.fechaInicio) {
      query.fechaCreacion = { $gte: new Date(filtros.fechaInicio) };
    }

    if (filtros?.fechaFin) {
      query.fechaCreacion = {
        ...query.fechaCreacion,
        $lte: new Date(filtros.fechaFin),
      };
    }

    if (filtros?.fichaId) {
      if (!Types.ObjectId.isValid(filtros.fichaId)) {
        throw new BadRequestException('ID de ficha inválido');
      }
      query.fichaId = new Types.ObjectId(filtros.fichaId);
    }

    if (filtros?.instructor) {
      query.instructoresNombres = { $regex: filtros.instructor, $options: 'i' };
    }

    if (!filtros?.incluirArchivados) {
      query.estado = { $ne: 'ARCHIVADO' };
    }

    const queryBuilder = this.proyectoModel.find(query);

    if (filtros?.limite) {
      queryBuilder.limit(filtros.limite);
    }

    if (filtros?.offset) {
      queryBuilder.skip(filtros.offset);
    }

    // Configurar ordenamiento
    const sortField = filtros?.ordenarPor || 'fechaCreacion';
    const sortDirection = filtros?.direccionOrden === 'asc' ? 1 : -1;
    const sortObject: any = { [sortField]: sortDirection };

    return await queryBuilder
      .sort(sortObject)
      .exec();
  }

  async obtenerPorId(id: string): Promise<ProyectoDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de proyecto inválido');
    }

    const proyecto = await this.proyectoModel
      .findById(id)
      .exec();

    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return proyecto;
  }

  async obtenerPorCreador(creadorId: string, filtros?: FiltroProyectoDto): Promise<ProyectoDocument[]> {
    if (!Types.ObjectId.isValid(creadorId)) {
      throw new BadRequestException('ID de creador inválido');
    }

    const query: any = { creadorId: new Types.ObjectId(creadorId) };

    if (filtros?.estado) {
      query.estado = filtros.estado;
    }

    if (filtros?.busqueda) {
      query.$or = [
        { titulo: { $regex: filtros.busqueda, $options: 'i' } },
        { descripcion: { $regex: filtros.busqueda, $options: 'i' } },
        { requisitos: { $regex: filtros.busqueda, $options: 'i' } },
      ];
    }

    if (filtros?.fechaInicio) {
      query.fechaCreacion = { $gte: new Date(filtros.fechaInicio) };
    }

    if (filtros?.fechaFin) {
      query.fechaCreacion = {
        ...query.fechaCreacion,
        $lte: new Date(filtros.fechaFin),
      };
    }

    if (filtros?.fichaId) {
      if (!Types.ObjectId.isValid(filtros.fichaId)) {
        throw new BadRequestException('ID de ficha inválido');
      }
      query.fichaId = new Types.ObjectId(filtros.fichaId);
    }

    if (filtros?.instructor) {
      query.instructoresNombres = { $regex: filtros.instructor, $options: 'i' };
    }

    if (!filtros?.incluirArchivados) {
      query.estado = { $ne: 'ARCHIVADO' };
    }

    const queryBuilder = this.proyectoModel.find(query);

    if (filtros?.limite) {
      queryBuilder.limit(filtros.limite);
    }

    if (filtros?.offset) {
      queryBuilder.skip(filtros.offset);
    }

    // Configurar ordenamiento
     const sortField = filtros?.ordenarPor || 'fechaCreacion';
     const sortDirection = filtros?.direccionOrden === 'asc' ? 1 : -1;
     const sortObject: any = { [sortField]: sortDirection };

    return await queryBuilder
      .sort(sortObject)
      .exec();
  }

  async obtenerPorEvaluador(evaluadorId: string, filtros?: FiltroProyectoDto): Promise<ProyectoDocument[]> {
    if (!Types.ObjectId.isValid(evaluadorId)) {
      throw new BadRequestException('ID de evaluador inválido');
    }

    const query: any = { evaluadorAsignadoId: new Types.ObjectId(evaluadorId) };

    if (filtros?.estado) {
      query.estado = filtros.estado;
    }

    if (filtros?.busqueda) {
      query.$or = [
        { titulo: { $regex: filtros.busqueda, $options: 'i' } },
        { descripcion: { $regex: filtros.busqueda, $options: 'i' } },
        { requisitos: { $regex: filtros.busqueda, $options: 'i' } },
      ];
    }

    if (filtros?.fechaInicio) {
      query.fechaCreacion = { $gte: new Date(filtros.fechaInicio) };
    }

    if (filtros?.fechaFin) {
      query.fechaCreacion = {
        ...query.fechaCreacion,
        $lte: new Date(filtros.fechaFin),
      };
    }

    if (filtros?.fichaId) {
      if (!Types.ObjectId.isValid(filtros.fichaId)) {
        throw new BadRequestException('ID de ficha inválido');
      }
      query.fichaId = new Types.ObjectId(filtros.fichaId);
    }

    if (filtros?.instructor) {
      query.instructoresNombres = { $regex: filtros.instructor, $options: 'i' };
    }

    if (!filtros?.incluirArchivados) {
      query.estado = { $ne: 'ARCHIVADO' };
    }

    const queryBuilder = this.proyectoModel.find(query);

    if (filtros?.limite) {
      queryBuilder.limit(filtros.limite);
    }

    if (filtros?.offset) {
      queryBuilder.skip(filtros.offset);
    }

    // Configurar ordenamiento
    const sortField = filtros?.ordenarPor || 'fechaCreacion';
    const sortDirection = filtros?.direccionOrden === 'asc' ? 1 : -1;
    const sortObject: any = { [sortField]: sortDirection };

    return await queryBuilder
      .sort(sortObject)
      .exec();
  }

  async obtenerDisponibles(): Promise<ProyectoDocument[]> {
    return await this.proyectoModel
      .find({ estado: EstadoProyecto.ACTIVO })
      .sort({ fechaCreacion: -1 })
      .exec();
  }

  async obtenerPorEstado(estado: EstadoProyecto): Promise<ProyectoDocument[]> {
    return await this.proyectoModel
      .find({ estado })
      .sort({ fechaCreacion: -1 })
      .exec();
  }

  async cambiarEstado(id: string, nuevoEstado: EstadoProyecto, usuarioId: string): Promise<ProyectoDocument> {
    const proyecto = await this.obtenerPorId(id);

    // Validar transiciones de estado
    const transicionesValidas = this.obtenerTransicionesValidas(proyecto.estado);
    if (!transicionesValidas.includes(nuevoEstado)) {
      throw new BadRequestException(`No se puede cambiar de ${proyecto.estado} a ${nuevoEstado}`);
    }

    // Verificar permisos
    if (proyecto.creadorId.toString() !== usuarioId) {
      throw new ForbiddenException('No tienes permisos para cambiar el estado de este proyecto');
    }

    proyecto.estado = nuevoEstado;
    return await proyecto.save();
  }

  async asignarEvaluador(id: string, evaluadorId: string, usuarioId: string): Promise<ProyectoDocument> {
    const proyecto = await this.obtenerPorId(id);

    if (proyecto.creadorId.toString() !== usuarioId) {
      throw new ForbiddenException('No tienes permisos para asignar evaluador a este proyecto');
    }

    if (!Types.ObjectId.isValid(evaluadorId)) {
      throw new BadRequestException('ID de evaluador inválido');
    }

    proyecto.evaluadorAsignadoId = new Types.ObjectId(evaluadorId);
    return await proyecto.save();
  }

  async obtenerEstadisticas(creadorId?: string): Promise<any> {
    const matchStage: any = {};
    if (creadorId) {
      if (!Types.ObjectId.isValid(creadorId)) {
        throw new BadRequestException('ID de creador inválido');
      }
      matchStage.creadorId = new Types.ObjectId(creadorId);
    }

    const estadisticas = await this.proyectoModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$estado',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await this.proyectoModel.countDocuments(matchStage);

    return {
      total,
      porEstado: estadisticas.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    };
  }

  async obtenerResumenDashboard(): Promise<any> {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const inicioSemana = new Date(ahora.setDate(ahora.getDate() - ahora.getDay()));

    const [total, totalMes, totalSemana, porEstado, proyectosRecientes, topCreadores] = await Promise.all([
      this.proyectoModel.countDocuments(),
      this.proyectoModel.countDocuments({ createdAt: { $gte: inicioMes } }),
      this.proyectoModel.countDocuments({ createdAt: { $gte: inicioSemana } }),
      this.proyectoModel.aggregate([
        { $group: { _id: '$estado', count: { $sum: 1 } } }
      ]),
      this.proyectoModel.find()
        .populate('creadorId', 'nombre email')
        .sort({ createdAt: -1 })
        .limit(5)
        .exec(),
      this.proyectoModel.aggregate([
        {
          $group: {
            _id: '$creadorId',
            totalProyectos: { $sum: 1 },
            proyectosAprobados: {
              $sum: { $cond: [{ $eq: ['$estado', EstadoProyecto.COMPLETADO] }, 1, 0] }
            }
          }
        },
        { $sort: { totalProyectos: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'usuarios',
            localField: '_id',
            foreignField: '_id',
            as: 'creador'
          }
        },
        { $unwind: '$creador' }
      ])
    ]);

    return {
      resumen: {
        total,
        nuevosMes: totalMes,
        nuevosSemana: totalSemana,
        porEstado: porEstado.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      proyectosRecientes,
      topCreadores
    };
  }

  async obtenerTendencias(periodo: string, creadorId?: string): Promise<any> {
    const ahora = new Date();
    let fechaInicio: Date;
    let formatoFecha: string;
    let agrupacion: any;

    switch (periodo) {
      case 'semana':
        fechaInicio = new Date(ahora.setDate(ahora.getDate() - 7));
        formatoFecha = '%Y-%m-%d';
        agrupacion = { $dateToString: { format: formatoFecha, date: '$createdAt' } };
        break;
      case 'trimestre':
        fechaInicio = new Date(ahora.setMonth(ahora.getMonth() - 3));
        formatoFecha = '%Y-%m';
        agrupacion = { $dateToString: { format: formatoFecha, date: '$createdAt' } };
        break;
      case 'año':
        fechaInicio = new Date(ahora.setFullYear(ahora.getFullYear() - 1));
        formatoFecha = '%Y-%m';
        agrupacion = { $dateToString: { format: formatoFecha, date: '$createdAt' } };
        break;
      default: // mes
        fechaInicio = new Date(ahora.setMonth(ahora.getMonth() - 1));
        formatoFecha = '%Y-%m-%d';
        agrupacion = { $dateToString: { format: formatoFecha, date: '$createdAt' } };
    }

    const matchStage: any = { createdAt: { $gte: fechaInicio } };
    if (creadorId) {
      matchStage.creadorId = new Types.ObjectId(creadorId);
    }

    const tendencias = await this.proyectoModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: agrupacion,
          total: { $sum: 1 },
          aprobados: {
              $sum: { $cond: [{ $eq: ['$estado', EstadoProyecto.COMPLETADO] }, 1, 0] }
            },
          enRevision: {
            $sum: { $cond: [{ $eq: ['$estado', EstadoProyecto.ACTIVO] }, 1, 0] }
          },
          rechazados: {
            $sum: { $cond: [{ $eq: ['$estado', EstadoProyecto.INACTIVO] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return {
      periodo,
      fechaInicio,
      datos: tendencias
    };
  }

  async obtenerMetricasEvaluador(evaluadorId: string): Promise<any> {
    if (!Types.ObjectId.isValid(evaluadorId)) {
      throw new BadRequestException('ID de evaluador inválido');
    }

    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const [proyectosAsignados, proyectosEvaluados, promedioTiempoEvaluacion, proyectosPendientes] = await Promise.all([
      this.proyectoModel.countDocuments({ evaluadorAsignadoId: new Types.ObjectId(evaluadorId) }),
      this.proyectoModel.countDocuments({
        evaluadorAsignadoId: new Types.ObjectId(evaluadorId),
        estado: { $in: [EstadoProyecto.COMPLETADO, EstadoProyecto.INACTIVO] }
      }),
      this.proyectoModel.aggregate([
        {
          $match: {
            evaluadorAsignadoId: new Types.ObjectId(evaluadorId),
            estado: { $in: [EstadoProyecto.COMPLETADO, EstadoProyecto.INACTIVO] },
            fechaEvaluacion: { $exists: true }
          }
        },
        {
          $project: {
            tiempoEvaluacion: {
              $divide: [
                { $subtract: ['$fechaEvaluacion', '$createdAt'] },
                1000 * 60 * 60 * 24 // Convertir a días
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            promedioTiempo: { $avg: '$tiempoEvaluacion' }
          }
        }
      ]),
      this.proyectoModel.countDocuments({
        evaluadorAsignadoId: new Types.ObjectId(evaluadorId),
        estado: EstadoProyecto.ACTIVO
      })
    ]);

    const eficiencia = proyectosAsignados > 0 ? (proyectosEvaluados / proyectosAsignados) * 100 : 0;

    return {
      proyectosAsignados,
      proyectosEvaluados,
      proyectosPendientes,
      eficiencia: Math.round(eficiencia * 100) / 100,
      promedioTiempoEvaluacion: promedioTiempoEvaluacion[0]?.promedioTiempo || 0
    };
  }

  async actualizar(
    id: string,
    actualizarProyectoDto: ActualizarProyectoDto,
    usuarioId: string,
    rolUsuario?: RolUsuario,
  ): Promise<ProyectoDocument> {
    const proyecto = await this.obtenerPorId(id);

    // Solo el creador o un administrador pueden actualizar
    if (proyecto.creadorId.toString() !== usuarioId && rolUsuario !== RolUsuario.ADMINISTRADOR) {
      throw new ForbiddenException('No tienes permisos para actualizar este proyecto');
    }

    // Validar que el proyecto puede ser editado
    if (!proyecto.puedeSerEditado()) {
      throw new BadRequestException('El proyecto no puede ser editado en su estado actual');
    }

    // Nota: fechaEntrega no está disponible en ActualizarProyectoDto

    if (actualizarProyectoDto.evaluadorAsignadoId) {
      if (!Types.ObjectId.isValid(actualizarProyectoDto.evaluadorAsignadoId)) {
        throw new BadRequestException('ID de evaluador inválido');
      }

      const evaluador = await this.usuarioModel.findById(actualizarProyectoDto.evaluadorAsignadoId);
      if (!evaluador) {
        throw new NotFoundException('Evaluador no encontrado');
      }

      if (evaluador.rol !== RolUsuario.EVALUADOR && evaluador.rol !== RolUsuario.ADMINISTRADOR) {
        throw new BadRequestException('El usuario asignado debe tener rol de evaluador o administrador');
      }

      if (!evaluador.activo) {
        throw new BadRequestException('El evaluador asignado debe estar activo');
      }
    }

    if (actualizarProyectoDto.titulo && actualizarProyectoDto.titulo.trim().length < 3) {
      throw new BadRequestException('El título debe tener al menos 3 caracteres');
    }

    if (actualizarProyectoDto.descripcion && actualizarProyectoDto.descripcion.trim().length < 10) {
      throw new BadRequestException('La descripción debe tener al menos 10 caracteres');
    }

    // Nota: fichaId no está disponible en ActualizarProyectoDto

    // Actualizar campos
    Object.keys(actualizarProyectoDto).forEach(key => {
      if (actualizarProyectoDto[key] !== undefined) {
        if (key === 'evaluadorAsignadoId' && actualizarProyectoDto[key]) {
          proyecto[key] = new Types.ObjectId(actualizarProyectoDto[key]);
        } else if (key === 'fichaId' && actualizarProyectoDto[key]) {
          proyecto[key] = new Types.ObjectId(actualizarProyectoDto[key]);
        } else {
          proyecto[key] = actualizarProyectoDto[key];
        }
      }
    });

    try {
      return await proyecto.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Ya existe un proyecto con ese título');
      }
      throw new BadRequestException('Error al actualizar el proyecto');
    }
  }

  async asignarInstructor(id: string, instructorId: string, usuarioId: string, rolUsuario?: RolUsuario): Promise<ProyectoDocument> {
    const proyecto = await this.obtenerPorId(id);

    // Solo el creador o un administrador pueden asignar instructores
    if (proyecto.creadorId.toString() !== usuarioId && rolUsuario !== RolUsuario.ADMINISTRADOR) {
      throw new ForbiddenException('No tienes permisos para asignar instructores a este proyecto');
    }

    if (!Types.ObjectId.isValid(instructorId)) {
      throw new BadRequestException('ID de instructor inválido');
    }

    const instructorObjectId = new Types.ObjectId(instructorId);

    // Verificar que el instructor no esté ya asignado
    if (proyecto.instructoresIds.some(id => id.toString() === instructorId)) {
      throw new BadRequestException('El instructor ya está asignado a este proyecto');
    }

    // Verificar que el usuario existe y es instructor
    const instructor = await this.usuarioModel.findById(instructorId);
    if (!instructor) {
      throw new NotFoundException('Instructor no encontrado');
    }

    if (instructor.rol !== RolUsuario.EVALUADOR && instructor.rol !== RolUsuario.ADMINISTRADOR) {
      throw new BadRequestException('El usuario debe tener rol de evaluador o administrador');
    }

    proyecto.instructoresIds.push(instructorObjectId);
    proyecto.instructoresNombres.push(`${instructor.nombre} ${instructor.apellidos}`);

    return await proyecto.save();
  }

  async desasignarInstructor(id: string, instructorId: string, usuarioId: string, rolUsuario?: RolUsuario): Promise<ProyectoDocument> {
    const proyecto = await this.obtenerPorId(id);

    // Solo el creador o un administrador pueden desasignar instructores
    if (proyecto.creadorId.toString() !== usuarioId && rolUsuario !== RolUsuario.ADMINISTRADOR) {
      throw new ForbiddenException('No tienes permisos para desasignar instructores de este proyecto');
    }

    if (!Types.ObjectId.isValid(instructorId)) {
      throw new BadRequestException('ID de instructor inválido');
    }

    const instructorIndex = proyecto.instructoresIds.findIndex(id => id.toString() === instructorId);
    if (instructorIndex === -1) {
      throw new BadRequestException('El instructor no está asignado a este proyecto');
    }

    proyecto.instructoresIds.splice(instructorIndex, 1);
    proyecto.instructoresNombres.splice(instructorIndex, 1);

    return await proyecto.save();
  }

  async obtenerInstructores(id: string): Promise<any[]> {
    const proyecto = await this.proyectoModel
      .findById(id)
      .populate('instructores', 'nombre apellido email rol')
      .exec();

    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return (proyecto as any).instructores || [];
  }

  async eliminar(id: string, usuarioId: string, rolUsuario?: RolUsuario): Promise<void> {
    const proyecto = await this.obtenerPorId(id);

    // Solo el creador o un administrador pueden eliminar
    if (proyecto.creadorId.toString() !== usuarioId && rolUsuario !== RolUsuario.ADMINISTRADOR) {
      throw new ForbiddenException('No tienes permisos para eliminar este proyecto');
    }

    // Validar que el proyecto puede ser eliminado
    if (proyecto.estado === EstadoProyecto.ACTIVO || proyecto.estado === EstadoProyecto.COMPLETADO) {
      throw new BadRequestException('No se puede eliminar un proyecto activo o completado');
    }

    await this.proyectoModel.findByIdAndDelete(id);
  }

  private obtenerTransicionesValidas(estadoActual: EstadoProyecto): EstadoProyecto[] {
    const transiciones = {
      [EstadoProyecto.BORRADOR]: [EstadoProyecto.ACTIVO, EstadoProyecto.INACTIVO],
      [EstadoProyecto.ACTIVO]: [EstadoProyecto.COMPLETADO, EstadoProyecto.INACTIVO],
      [EstadoProyecto.COMPLETADO]: [EstadoProyecto.INACTIVO],
      [EstadoProyecto.INACTIVO]: [EstadoProyecto.ACTIVO],
    };

    return transiciones[estadoActual] || [];
  }
}
