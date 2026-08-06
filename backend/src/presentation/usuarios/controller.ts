import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import {
  CreateUserDto,
  UpdateUserDto,
  GetUsersDto,
  GetUserByIdDto,
} from '../../domain/dtos/usuarios';
import { formatErrors } from '../utils/formatErrors';
import { RealtimeServer } from '../../infrastructure/realtime/core/realtime.server';
import { SocketEvents } from '../../infrastructure/realtime/events/socket-event';

export class UsuarioController {
  constructor() {}

  public getUsers = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search = '', estado = 'TODOS' } = req.query;
    const [errors, getUsersDto] = GetUsersDto.create(
      +page,
      +limit,
      estado as string
    );
    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors: formatErrors(errors),
      });
    try {
      const whereClause: any = {};
      if (getUsersDto!.estado === 'ACTIVOS') {
        whereClause.activo = true;
      } else if (getUsersDto!.estado === 'INACTIVOS') {
        whereClause.activo = false;
      }

      if (search) {
        whereClause.OR = [
          { nombre: { contains: String(search), mode: 'insensitive' } },
          { email: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.usuario.findMany({
          where: whereClause,
          skip: (getUsersDto!.page - 1) * getUsersDto!.limit,
          take: getUsersDto!.limit,
          select: {
            activo: true,
            id_usuario: true,
            nombre: true,
            email: true,
            rol: true,
            puede_registrar_dispositivo: true,
            permite_fallback_password: true,
          },
        }),
        prisma.usuario.count({ where: whereClause }),
      ]);

      const hasNext = getUsersDto!.page * getUsersDto!.limit < total;

      const searchParam = search
        ? `&search=${encodeURIComponent(String(search))}`
        : '';
      const estadoParam =
        getUsersDto!.estado !== 'ACTIVOS'
          ? `&estado=${getUsersDto!.estado}`
          : '';

      return res.json({
        status: 'success',
        message: 'Usuarios obtenidos correctamente',
        data: users,
        errors: formatErrors(null),
        pagination: {
          page: getUsersDto!.page,
          limit: getUsersDto!.limit,
          total,
          next: hasNext
            ? `/api/users?page=${getUsersDto!.page + 1}&limit=${getUsersDto!.limit}${searchParam}${estadoParam}`
            : null,
          prev:
            getUsersDto!.page > 1
              ? `/api/users?page=${getUsersDto!.page - 1}&limit=${getUsersDto!.limit}${searchParam}${estadoParam}`
              : null,
        },
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error al obtener usuarios',
        errors: formatErrors(error),
      });
    }
  };

  public getUserByID = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, getUserByIdDto] = GetUserByIdDto.create(id);
    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors: formatErrors(errors),
      });
    try {
      const user = await prisma.usuario.findUnique({
        where: {
          id_usuario: getUserByIdDto!.id,
        },
        select: {
          id_usuario: true,
          nombre: true,
          rol: true,
          email: true,
          puede_registrar_dispositivo: true,
          permite_fallback_password: true,
        },
      });

      user
        ? res.json({
            status: 'success',
            message: 'Usuario obtenido correctamente',
            data: user,
            errors: formatErrors(null),
          })
        : res.status(404).json({
            status: 'fail',
            message: `User with id ${id} not found`,
            errors: formatErrors(null),
          });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error al obtener usuario',
        errors: formatErrors(error),
      });
    }
  };

  public createUser = async (req: Request, res: Response) => {
    const [errors, createUserDto] = CreateUserDto.create(req.body);
    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors: formatErrors(errors),
      });

    try {
      const existingUser = await prisma.usuario.findUnique({
        where: { email: createUserDto!.email },
      });

      if (existingUser) {
        return res.status(400).json({
          status: 'fail',
          message: 'El email ya está registrado.',
          errors: formatErrors({ email: 'El email ya está registrado.' }),
        });
      }

      const user = await prisma.usuario.create({
        data: {
          nombre: createUserDto!.nombre,
          email: createUserDto!.email,
          password: createUserDto!.password,
          rol: createUserDto!.rol as any,
        },
        select: {
          id_usuario: true,
          nombre: true,
          rol: true,
          email: true,
          puede_registrar_dispositivo: true,
          permite_fallback_password: true,
        },
      });
      res.status(201).json({
        status: 'success',
        message: 'Usuario creado correctamente',
        data: user,
        errors: formatErrors(null),
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Error al crear usuario en el servidor.',
        errors: formatErrors(error),
      });
    }
  };

  public updateUser = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, updateUserDto] = UpdateUserDto.create({ ...req.body, id });

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors: formatErrors(errors),
      });

    try {
      const user = await prisma.usuario.findUnique({
        where: { id_usuario: id },
      });

      if (!user)
        return res.status(404).json({
          status: 'fail',
          message: `User with ID ${id} not found`,
          errors: formatErrors(null),
        });

      if (updateUserDto?.email) {
        const existingUser = await prisma.usuario.findFirst({
          where: {
            email: updateUserDto.email,
            NOT: { id_usuario: id },
          },
        });

        if (existingUser) {
          return res.status(400).json({
            status: 'fail',
            message: 'El email ya está registrado por otro usuario',
            errors: formatErrors({
              email: 'El email ya está registrado por otro usuario',
            }),
          });
        }
      }

      const updatedUser = await prisma.usuario.update({
        where: {
          id_usuario: id,
        },
        data: updateUserDto!.values,
        select: {
          id_usuario: true,
          nombre: true,
          rol: true,
          email: true,
          puede_registrar_dispositivo: true,
          permite_fallback_password: true,
        },
      });

      // Socket

      // Registrar dispositivo permiso

      const registrationPermissionChanged =
        user.puede_registrar_dispositivo !==
        updatedUser.puede_registrar_dispositivo;

      if (registrationPermissionChanged) {
        RealtimeServer.getInstance().emitToUser(
          updatedUser.id_usuario,
          SocketEvents.RegistrationPermissionUpdated,
          {
            canRegisterDevice: updatedUser.puede_registrar_dispositivo,
          }
        );
      }

      // Fallback password permiso

      const passwordFallbackPermissionChanged =
        user.permite_fallback_password !==
        updatedUser.permite_fallback_password;

      if (passwordFallbackPermissionChanged) {
        RealtimeServer.getInstance().emitToUser(
          updatedUser.id_usuario,
          SocketEvents.PasswordFallbackPermissionUpdated,
          {
            allowPasswordFallback: updatedUser.permite_fallback_password,
          }
        );
      }

      res.json({
        status: 'success',
        message: 'Usuario actualizado correctamente',
        data: updatedUser,
        errors: formatErrors(null),
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Error al actualizar usuario',
        errors: formatErrors(error),
      });
    }
  };

  public deleteUser = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [errors, getUserByIdDto] = GetUserByIdDto.create(id);
    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors,
      });

    try {
      const userExists = await prisma.usuario.findUnique({
        where: { id_usuario: getUserByIdDto!.id },
      });

      if (!userExists) {
        return res.status(404).json({
          status: 'fail',
          message: `User with ID ${getUserByIdDto!.id} not found`,
          errors: formatErrors(null),
        });
      }

      const deletedUser = await prisma.usuario.update({
        where: {
          id_usuario: getUserByIdDto!.id,
        },
        data: {
          activo: false,
        },
        select: {
          id_usuario: true,
          nombre: true,
          rol: true,
          email: true,
          puede_registrar_dispositivo: true,
          permite_fallback_password: true,
        },
      });

      // Socket

      RealtimeServer.getInstance().emitToUser(
        deletedUser.id_usuario,
        SocketEvents.UserDisabled,
        {
          reason: 'USER_DISABLED',
        }
      );

      return res.json({
        status: 'success',
        message: 'Usuario eliminado correctamente',
        data: deletedUser,
        errors: formatErrors(null),
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error al eliminar usuario',
        errors: formatErrors(error),
      });
    }
  };

  public getUserStats = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      const ultimoAcceso = await prisma.acceso_Biometrico.findFirst({
        where: {
          id_usuario: user.id_usuario,
          estado: 'PERMITIDO',
        },
        orderBy: { fecha_hora: 'desc' },
      });

      const resultMovimientos = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) 
        FROM "Movimiento_Inventario"
        WHERE id_usuario = ${user.id_usuario}
        AND DATE(fecha_movimiento) = CURRENT_DATE
      `;

      const movimientosHoy =
        resultMovimientos.length > 0 ? Number(resultMovimientos[0].count) : 0;

      return res.json({
        status: 'success',
        data: {
          ultimo_ingreso: ultimoAcceso ? ultimoAcceso.fecha_hora : null,
          movimientos_hoy: movimientosHoy,
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error al obtener estadísticas' });
    }
  };
}
