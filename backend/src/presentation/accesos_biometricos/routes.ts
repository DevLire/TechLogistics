import { Router } from 'express';
import { AccesosBiometricosController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class AccesosBiometricosRoutes {
  static get routes(): Router {
    const router = Router();
    const accesosBiometricosController = new AccesosBiometricosController();

    router.use(AuthMiddleware.validateJWT);

    router.get(
      '/',
      RoleMiddleware.requireRoles(['SUPERVISOR']),
      accesosBiometricosController.getAccesosBiometricos
    );
    router.get(
      '/anomalias',
      RoleMiddleware.requireRoles(['SUPERVISOR']),
      accesosBiometricosController.getAnomalias
    );

    router.post(
      '/verificar',
      accesosBiometricosController.verificarAccesoBiometrico
    );

    return router;
  }
}
