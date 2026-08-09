import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import { JwtAdapter } from '../../config/jwt.adapter';
import { LoginUserDto } from '../../domain/dtos/auth';
import { formatErrors } from '../utils/formatErrors';
import { bcryptAdapter } from '../../config/bcrypt.adapter';

export class AuthController {
  public loginUser = async (req: Request, res: Response) => {
    const [errors, loginDto] = LoginUserDto.create(req.body);

    if (errors)
      return res.status(400).json({
        status: 'fail',
        message: 'Los datos proporcionados no son válidos.',
        errors: formatErrors(errors),
      });

    try {
      // Verificar si el correo existe
      const user = await prisma.usuario.findUnique({
        where: { email: loginDto!.email },
        include: {
          dispositivos: {
            where: {
              activo: true,
            },
          },
        },
      });

      if (!user || !user.activo) {
        return res.status(400).json({
          status: 'fail',
          message: 'Credenciales incorrectas',
          errors: formatErrors(null),
        });
      }

      // Verificar contraseña
      const isPasswordMatch = await bcryptAdapter.compare(
        loginDto!.password,
        user.password
      );

      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ status: 'fail', message: 'Credenciales incorrectas' });
      }

      const deviceId = loginDto!.deviceId;
      let isDeviceRegistered = false;

      // Solo evaluamos el hardware si la petición envió un deviceId (App Móvil)
      if (deviceId) {
        const dispositivoExistente =
          await prisma.dispositivo_Autorizado.findUnique({
            where: { dispositivo_id: deviceId },
          });

        isDeviceRegistered =
          dispositivoExistente !== null &&
          dispositivoExistente.id_usuario === user.id_usuario;

        // Si el dispositivo existe, ESTÁ ACTIVO, pero es de OTRO usuario -> 403 Forbidden
        if (
          dispositivoExistente &&
          dispositivoExistente.activo &&
          dispositivoExistente.id_usuario !== user.id_usuario
        ) {
          return res.status(403).json({
            status: 'fail',
            message: 'Este dispositivo ya está vinculado a otro operario.',
          });
        }
      }

      // Generar el JWT usando el ID del usuario
      const token = await JwtAdapter.generateToken({ id: user.id_usuario });
      if (!token)
        return res.status(500).json({
          status: 'fail',
          message: 'Error al generar el token',
          errors: formatErrors(null),
        });

      // Devolvemos el usuario y el token
      const { password, ...userEntity } = user;

      return res.json({
        status: 'success',
        user: userEntity,
        token: token,
        security: {
          isDeviceRegistered: isDeviceRegistered,
          canRegisterDevice: user.puede_registrar_dispositivo,
          allowPasswordFallback: user.permite_fallback_password,
        },
        errors: formatErrors(null),
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Error interno del servidor',
        errors: formatErrors(error),
      });
    }
  };

  public checkAuthStatusUser = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { _password } = user;

    const updatedUser = await prisma.usuario.findUnique({
      where: { email: user!.email },
      include: {
        dispositivos: {
          where: {
            activo: true,
          },
        },
      },
    });

    const deviceId = req.headers['x-device-id'];

    let isDeviceRegistered = false;

    // Evaluar si el celular existe en la base de datos
    if (deviceId) {
      const dispositivoExistente =
        await prisma.dispositivo_Autorizado.findUnique({
          where: { dispositivo_id: String(deviceId) },
        });

      isDeviceRegistered =
        dispositivoExistente !== null &&
        dispositivoExistente.id_usuario === user.id_usuario;
    }

    const token = await JwtAdapter.generateToken({ id: user.id_usuario });

    return res.json({
      status: 'success',
      user: updatedUser,
      token: token,
      security: {
        isDeviceRegistered: isDeviceRegistered,
        canRegisterDevice: user.puede_registrar_dispositivo,
        allowPasswordFallback: user.permite_fallback_password,
      },
      errors: formatErrors(null),
    });
  };
}
