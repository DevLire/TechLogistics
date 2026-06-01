import { Router } from 'express';
import { DispositivoController } from './controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RoleMiddleware } from '../../middlewares/role.middleware';

export class DispositivosRoutes {
  static get routes(): Router {
    const router = Router();
    const dispositivoController = new DispositivoController();

    router.use(AuthMiddleware.validateJWT);

    router.get(
      '/',
      RoleMiddleware.requireAdmin,
      dispositivoController.getDispositivos
    );
    router.get(
      '/:id',
      RoleMiddleware.requireAdmin,
      dispositivoController.getDispositivoById
    );
    router.get(
      '/user/:id',
      RoleMiddleware.requireAdmin,
      dispositivoController.getDispositivosByUserId
    );
    router.put(
      '/:id',
      RoleMiddleware.requireAdmin,
      dispositivoController.updateDispositivo
    );
    router.delete(
      '/:id',
      RoleMiddleware.requireAdmin,
      dispositivoController.deleteDispositivo
    );

    router.post('/', dispositivoController.registerDispositivo);

    return router;
  }
}
