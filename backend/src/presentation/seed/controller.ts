import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import { formatErrors } from '../utils/formatErrors';

const getPastDate = (daysBack: number, hourOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  date.setHours((date.getHours() + hourOffset) % 24, 0, 0, 0);
  return date;
};

const buildDeviceId = (index: number) =>
  `TL-DEV-${String(index + 1).padStart(3, '0')}`;

export class SeedController {
  constructor() {}

  public runSeed = async (req: Request, res: Response) => {
    try {
      console.log('Limpiando base de datos y reiniciando IDs...');

      await prisma.detalle_Movimiento_Producto.deleteMany();
      await prisma.movimiento_Inventario.deleteMany();
      await prisma.acceso_Biometrico.deleteMany();
      await prisma.dispositivo_Autorizado.deleteMany();
      await prisma.producto.deleteMany();
      await prisma.categoria.deleteMany();
      await prisma.proveedor.deleteMany();
      await prisma.usuario.deleteMany();

      const tables = [
        'Usuario',
        'Categoria',
        'Proveedor',
        'Producto',
        'Dispositivo_Autorizado',
        'Acceso_Biometrico',
        'Movimiento_Inventario',
        'Detalle_Movimiento_Producto',
      ];

      for (const table of tables) {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`
        );
      }

      console.log('Iniciando sembrado de datos...');

      const usuariosData = [
        {
          nombre: 'Administrador TechLogistics',
          email: 'administrador@techlogistics.com',
          password: '123456',
          rol: 'ADMINISTRADOR' as const,
          activo: true,
          puede_registrar_dispositivo: true,
          permite_fallback_password: true,
        },
        {
          nombre: 'Supervisor TechLogistics',
          email: 'supervisor@techlogistics.com',
          password: '123456',
          rol: 'SUPERVISOR' as const,
          activo: true,
          puede_registrar_dispositivo: false,
          permite_fallback_password: false,
        },
        {
          nombre: 'Operario TechLogistics',
          email: 'operario@techlogistics.com',
          password: '123456',
          rol: 'OPERARIO' as const,
          activo: true,
          puede_registrar_dispositivo: false,
          permite_fallback_password: false,
        },
        {
          nombre: 'Carla Mendoza',
          email: 'carla.mendoza@techlogistics.com',
          password: '123456',
          rol: 'OPERARIO' as const,
          activo: true,
          puede_registrar_dispositivo: false,
          permite_fallback_password: true,
        },
        {
          nombre: 'Luis Torres',
          email: 'luis.torres@techlogistics.com',
          password: '123456',
          rol: 'OPERARIO' as const,
          activo: true,
          puede_registrar_dispositivo: true,
          permite_fallback_password: false,
        },
        {
          nombre: 'María Salazar',
          email: 'maria.salazar@techlogistics.com',
          password: '123456',
          rol: 'OPERARIO' as const,
          activo: true,
          puede_registrar_dispositivo: false,
          permite_fallback_password: false,
        },
        {
          nombre: 'Jorge Ramírez',
          email: 'jorge.ramirez@techlogistics.com',
          password: '123456',
          rol: 'OPERARIO' as const,
          activo: true,
          puede_registrar_dispositivo: false,
          permite_fallback_password: true,
        },
        {
          nombre: 'Sofía León',
          email: 'sofia.leon@techlogistics.com',
          password: '123456',
          rol: 'SUPERVISOR' as const,
          activo: true,
          puede_registrar_dispositivo: false,
          permite_fallback_password: false,
        },
        {
          nombre: 'Pedro Castillo',
          email: 'pedro.castillo@techlogistics.com',
          password: '123456',
          rol: 'OPERARIO' as const,
          activo: true,
          puede_registrar_dispositivo: true,
          permite_fallback_password: true,
        },
        {
          nombre: 'Elena Rojas',
          email: 'elena.rojas@techlogistics.com',
          password: '123456',
          rol: 'OPERARIO' as const,
          activo: true,
          puede_registrar_dispositivo: false,
          permite_fallback_password: false,
        },
      ];

      await prisma.usuario.createMany({
        data: usuariosData,
      });

      const categoriasAlmacen = [
        'Componentes Electrónicos',
        'Herramientas',
        'Material de Red',
        'Equipos de Cómputo',
        'Seguridad Industrial',
        'Consumibles de Oficina',
      ];

      await prisma.categoria.createMany({
        data: categoriasAlmacen.map((cat) => ({
          nombre: cat,
          descripcion: `Artículos de ${cat.toLowerCase()}`,
          activo: true,
        })),
      });

      const proveedoresEmpresas = [
        'ElectroGlobal',
        'TechSupplies S.A.',
        'NetSys Perú',
        'Importaciones Tecnológicas',
        'Seguridad 360',
        'OfficeParts LATAM',
      ];

      await prisma.proveedor.createMany({
        data: proveedoresEmpresas.map((prov) => ({
          nombre_empresa: prov,
          contacto: 'Ventas',
          telefono: '999888777',
          activo: true,
        })),
      });

      const productosCatalogo = [
        {
          nombre: 'Placa Arduino Uno R3',
          precio: 85.5,
          stock_actual: 8,
          stock_minimo: 12,
        },
        {
          nombre: 'Cable UTP Cat 6',
          precio: 120,
          stock_actual: 160,
          stock_minimo: 40,
        },
        {
          nombre: 'Router Cisco',
          precio: 450,
          stock_actual: 6,
          stock_minimo: 8,
        },
        {
          nombre: 'Multímetro Digital',
          precio: 65,
          stock_actual: 38,
          stock_minimo: 10,
        },
        {
          nombre: 'Casco de Seguridad',
          precio: 25,
          stock_actual: 90,
          stock_minimo: 20,
        },
        {
          nombre: 'Guantes de Nitrilo',
          precio: 18,
          stock_actual: 240,
          stock_minimo: 60,
        },
        {
          nombre: 'Laptop Industrial',
          precio: 3250,
          stock_actual: 4,
          stock_minimo: 5,
        },
        {
          nombre: 'Switch 24 Puertos',
          precio: 980,
          stock_actual: 24,
          stock_minimo: 8,
        },
        {
          nombre: 'Tóner Negro Universal',
          precio: 155,
          stock_actual: 12,
          stock_minimo: 6,
        },
        {
          nombre: 'Etiquetas Adhesivas RFID',
          precio: 42,
          stock_actual: 520,
          stock_minimo: 120,
        },
        {
          nombre: 'Sensor de Movimiento PIR',
          precio: 34,
          stock_actual: 14,
          stock_minimo: 15,
        },
        {
          nombre: 'Batería UPS 12V',
          precio: 210,
          stock_actual: 70,
          stock_minimo: 18,
        },
      ];

      await prisma.producto.createMany({
        data: productosCatalogo.map((prod, index) => ({
          id_categoria: (index % categoriasAlmacen.length) + 1,
          id_proveedor: (index % proveedoresEmpresas.length) + 1,
          codigo_barras: `8410000${String(index + 1).padStart(3, '0')}`,
          nombre: prod.nombre,
          precio_venta: prod.precio,
          stock_actual: prod.stock_actual,
          stock_minimo: prod.stock_minimo,
          activo: true,
        })),
      });

      const usuariosConDispositivo = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ];

      const dispositivosData = usuariosConDispositivo.map(
        (id_usuario, index) => ({
          id_usuario,
          dispositivo_id: buildDeviceId(index),
          nombre_dispositivo:
            id_usuario === 1
              ? 'iPhone Administrador'
              : id_usuario === 2
                ? 'Tablet Supervisor'
                : `Móvil Corporativo ${index + 1}`,
          fecha_registro: getPastDate(60, index),
          activo: true,
        })
      );

      await prisma.dispositivo_Autorizado.createMany({
        data: dispositivosData,
      });

      const accesosData = Array.from({ length: 48 }).map((_, index) => {
        const dispositivo = dispositivosData[index % dispositivosData.length];
        const isFallbackUser =
          dispositivo.id_usuario === 4 || dispositivo.id_usuario === 7;
        const isSupervisor = dispositivo.id_usuario === 2 || dispositivo.id_usuario === 8;
        const denied = index % 11 === 0 || index % 17 === 0;

        return {
          id_usuario: dispositivo.id_usuario,
          id_dispositivo_autorizado: (index % dispositivosData.length) + 1,
          estado: denied ? ('DENEGADO' as const) : ('PERMITIDO' as const),
          metodo_acceso: isFallbackUser
            ? ('PASSWORD' as const)
            : isSupervisor && index % 3 === 0
              ? ('PASSWORD' as const)
              : ('HUELLA' as const),
          fecha_hora: getPastDate(Math.floor(index / 3) + 1, index % 24),
        };
      });

      await prisma.acceso_Biometrico.createMany({ data: accesosData });

      const movimientosPlan = [
        {
          id_usuario: 3,
          tipo: 'SALIDA' as const,
          items: [
            { id_producto: 1, cantidad: 3 },
            { id_producto: 3, cantidad: 1 },
          ],
        },
        {
          id_usuario: 4,
          tipo: 'SALIDA' as const,
          items: [
            { id_producto: 2, cantidad: 15 },
            { id_producto: 9, cantidad: 4 },
          ],
        },
        {
          id_usuario: 5,
          tipo: 'INGRESO' as const,
          items: [
            { id_producto: 6, cantidad: 80 },
            { id_producto: 10, cantidad: 120 },
          ],
        },
        {
          id_usuario: 6,
          tipo: 'SALIDA' as const,
          items: [
            { id_producto: 7, cantidad: 2 },
            { id_producto: 11, cantidad: 4 },
          ],
        },
        {
          id_usuario: 7,
          tipo: 'INGRESO' as const,
          items: [
            { id_producto: 8, cantidad: 10 },
            { id_producto: 12, cantidad: 6 },
          ],
        },
        {
          id_usuario: 9,
          tipo: 'SALIDA' as const,
          items: [
            { id_producto: 4, cantidad: 6 },
            { id_producto: 5, cantidad: 12 },
          ],
        },
        {
          id_usuario: 10,
          tipo: 'SALIDA' as const,
          items: [
            { id_producto: 1, cantidad: 2 },
            { id_producto: 8, cantidad: 3 },
            { id_producto: 11, cantidad: 1 },
          ],
        },
        {
          id_usuario: 3,
          tipo: 'INGRESO' as const,
          items: [
            { id_producto: 2, cantidad: 50 },
            { id_producto: 6, cantidad: 90 },
          ],
        },
        {
          id_usuario: 4,
          tipo: 'SALIDA' as const,
          items: [
            { id_producto: 3, cantidad: 2 },
            { id_producto: 7, cantidad: 1 },
          ],
        },
        {
          id_usuario: 5,
          tipo: 'INGRESO' as const,
          items: [
            { id_producto: 5, cantidad: 60 },
            { id_producto: 12, cantidad: 18 },
          ],
        },
        {
          id_usuario: 6,
          tipo: 'SALIDA' as const,
          items: [
            { id_producto: 9, cantidad: 5 },
            { id_producto: 10, cantidad: 20 },
          ],
        },
        {
          id_usuario: 7,
          tipo: 'INGRESO' as const,
          items: [
            { id_producto: 4, cantidad: 22 },
            { id_producto: 11, cantidad: 8 },
          ],
        },
      ];

      for (const [index, movimiento] of movimientosPlan.entries()) {
        const detalles = movimiento.items.map((item) => {
          const producto = productosCatalogo[item.id_producto - 1];
          const subtotal = item.cantidad * producto.precio;

          return {
            id_producto: item.id_producto,
            cantidad: item.cantidad,
            precio_unitario: producto.precio,
            subtotal,
            observaciones:
              producto.stock_actual <= producto.stock_minimo
                ? 'Producto con stock bajo por rotación reciente'
                : producto.stock_actual >= 200
                  ? 'Producto con bastante stock disponible'
                  : index % 2 === 0
                    ? 'Movimiento de prueba de alta rotación'
                    : 'Movimiento de prueba estándar',
          };
        });

        const totalMovimiento = detalles.reduce(
          (acc, detalle) => acc + Number(detalle.subtotal),
          0
        );

        await prisma.movimiento_Inventario.create({
          data: {
            id_usuario: movimiento.id_usuario,
            tipo: movimiento.tipo,
            fecha_movimiento: getPastDate(20 + index, index),
            total: totalMovimiento,
            detalles: { create: detalles },
          },
        });
      }

      const seededUsers = await prisma.usuario.findMany({
        orderBy: { id_usuario: 'asc' },
        select: {
          id_usuario: true,
          nombre: true,
          email: true,
          rol: true,
          activo: true,
          puede_registrar_dispositivo: true,
          permite_fallback_password: true,
        },
      });

      const seededProducts = await prisma.producto.findMany({
        orderBy: { id_producto: 'asc' },
        select: {
          id_producto: true,
          nombre: true,
          stock_actual: true,
          stock_minimo: true,
        },
      });

      console.log('Sembrado completado con éxito.');

      return res.status(201).json({
        status: 'success',
        message:
          'Base de datos limpiada y ejecutado el seed con escenarios de prueba.',
        data: {
          testUsers: seededUsers.filter((user) =>
            [
              'administrador@techlogistics.com',
              'operario@techlogistics.com',
              'supervisor@techlogistics.com',
            ].includes(user.email ?? '')
          ),
          seededUsers,
          summary: {
            usuarios: seededUsers.length,
            categorias: categoriasAlmacen.length,
            proveedores: proveedoresEmpresas.length,
            productos: seededProducts.length,
            accesosBiometricos: accesosData.length,
            movimientos: movimientosPlan.length,
          },
          stockHighlights: seededProducts.map((product) => ({
            nombre: product.nombre,
            stock_actual: product.stock_actual,
            stock_minimo: product.stock_minimo,
            caso:
              product.stock_actual <= product.stock_minimo
                ? 'stock bajo'
                : product.stock_actual >= 200
                  ? 'stock alto'
                  : 'stock medio',
          })),
        },
        errors: formatErrors(null),
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Error en el seed',
        errors: formatErrors(error),
      });
    }
  };
}
