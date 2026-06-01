import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';
import { formatErrors } from '../utils/formatErrors';

const getRandomPastDate = (daysBack: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60),
    0
  );
  return date;
};

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

      // --- 1. USUARIOS (Preparados para probar el flujo del Frontend) ---
      const usuariosData = [
        // ID 1: Admin
        {
          nombre: 'Igor Pérez',
          email: 'admin@empresa.com',
          password: '123456',
          rol: 'ADMINISTRADOR' as const,
          activo: true,
          puede_registrar_dispositivo: true,
          permite_fallback_password: true,
        },
        // ID 2: Supervisor
        {
          nombre: 'Juan Perez',
          email: 'supervisor@empresa.com',
          password: '123456',
          rol: 'SUPERVISOR' as const,
          activo: true,
          puede_registrar_dispositivo: false,
          permite_fallback_password: false,
        },

        // --- CASOS DE PRUEBA FRONTEND ---

        // ID 3: Operario Normal (Caso 1: Dispositivo registrado, solo huella)
        {
          nombre: 'Maria Garcia',
          email: 'operario@empresa.com',
          password: '123456',
          rol: 'OPERARIO' as const,
          activo: true,
          puede_registrar_dispositivo: false,
          permite_fallback_password: false,
        },

        // ID 4: Operario con Fallback (Caso 2: Dispositivo registrado, usa contraseña)
        {
          nombre: 'Carlos Lopez',
          email: 'carlos.lopez@empresa.com',
          password: '123456',
          rol: 'OPERARIO' as const,
          activo: true,
          puede_registrar_dispositivo: false,
          permite_fallback_password: true,
        },

        // ID 5: Operario Nuevo (Caso 3: Sin dispositivo, pero PUEDE registrar)
        {
          nombre: 'Ana Martinez',
          email: 'ana.martinez@empresa.com',
          password: '123456',
          rol: 'OPERARIO' as const,
          activo: true,
          puede_registrar_dispositivo: true,
          permite_fallback_password: false,
        },

        // ID 6: Operario Bloqueado (Caso 4: Sin dispositivo, NO puede registrar)
        {
          nombre: 'Luis Rodriguez',
          email: 'luis.rodriguez@empresa.com',
          password: '123456',
          rol: 'OPERARIO' as const,
          activo: true,
          puede_registrar_dispositivo: false,
          permite_fallback_password: false,
        },
      ];

      await prisma.usuario.createMany({ data: usuariosData });

      // --- 2. CATEGORÍAS Y PROVEEDORES ---
      const categoriasAlmacen = [
        'Componentes Electrónicos',
        'Herramientas',
        'Material de Red',
        'Equipos de Cómputo',
        'Seguridad Industrial',
      ];
      await prisma.categoria.createMany({
        data: categoriasAlmacen.map((cat) => ({
          nombre: cat,
          descripcion: `Equipos de ${cat}`,
          activo: true,
        })),
      });

      const proveedoresEmpresas = [
        'ElectroGlobal',
        'TechSupplies S.A.',
        'NetSys Perú',
        'Importaciones Tecnológicas',
        'Seguridad 360',
      ];
      await prisma.proveedor.createMany({
        data: proveedoresEmpresas.map((prov) => ({
          nombre_empresa: prov,
          contacto: 'Ventas',
          telefono: '999888777',
          activo: true,
        })),
      });

      // --- 3. PRODUCTOS ---
      const productosCatalogo = [
        { nombre: 'Placa Arduino Uno R3', precio: 85.5 },
        { nombre: 'Cable UTP Cat 6', precio: 120.0 },
        { nombre: 'Router Cisco', precio: 450.0 },
        { nombre: 'Multímetro Digital', precio: 65.0 },
        { nombre: 'Casco de Seguridad', precio: 25.0 },
      ];

      await prisma.producto.createMany({
        data: productosCatalogo.map((prod, i) => ({
          id_categoria: (i % 5) + 1,
          id_proveedor: (i % 5) + 1,
          codigo_barras: `84100000${i}`,
          nombre: prod.nombre,
          precio_venta: prod.precio,
          stock_actual: Math.floor(Math.random() * 50) + 10,
          stock_minimo: 10,
          activo: true,
        })),
      });

      // --- 4. DISPOSITIVOS AUTORIZADOS ---
      // Solo asignamos dispositivos a los IDs: 1 (Admin), 2 (Supervisor), 3 (Caso 1), y 4 (Caso 2).
      // Los IDs 5 y 6 se quedan sin dispositivo para probar las pantallas de registro/bloqueo.
      const usuariosConDispositivo = [1, 2, 3, 4];

      const dispositivosData = usuariosConDispositivo.map(
        (id_usuario, index) => ({
          id_usuario,
          dispositivo_id: `DEVICE-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
          nombre_dispositivo:
            id_usuario === 1 ? 'iPhone Admin' : `Celular Corporativo ${index}`,
          fecha_registro: getRandomPastDate(60),
          activo: true,
        })
      );
      await prisma.dispositivo_Autorizado.createMany({
        data: dispositivosData,
      });

      // --- 5. ACCESOS BIOMÉTRICOS ---
      const accesosData = Array.from({ length: 20 }).map((_, i) => {
        const dispositivoIndex = i % dispositivosData.length;
        const dispositivo = dispositivosData[dispositivoIndex];

        // Si el usuario es el ID 4 (el del fallback), sus accesos son por PASSWORD, el resto por HUELLA
        const esUsuarioFallback = dispositivo.id_usuario === 4;

        return {
          id_usuario: dispositivo.id_usuario,
          id_dispositivo_autorizado: dispositivoIndex + 1,
          estado:
            Math.random() > 0.9
              ? 'DENEGADO'
              : ('PERMITIDO' as 'DENEGADO' | 'PERMITIDO'),
          metodo_acceso: esUsuarioFallback
            ? 'PASSWORD'
            : ('HUELLA' as 'HUELLA' | 'PASSWORD'),
          fecha_hora: getRandomPastDate(15),
        };
      });
      await prisma.acceso_Biometrico.createMany({ data: accesosData });

      // --- 6. MOVIMIENTOS ---
      for (let i = 0; i < 10; i++) {
        const numDetalles = Math.floor(Math.random() * 2) + 1;
        const detalles = [];
        let totalMovimiento = 0;

        for (let j = 0; j < numDetalles; j++) {
          const producto =
            productosCatalogo[(i + j) % productosCatalogo.length];
          const cantidad = Math.floor(Math.random() * 3) + 1;
          const subtotal = cantidad * producto.precio;
          totalMovimiento += subtotal;

          detalles.push({
            id_producto: ((i + j) % productosCatalogo.length) + 1,
            cantidad: cantidad,
            precio_unitario: producto.precio,
            subtotal: subtotal,
          });
        }

        await prisma.movimiento_Inventario.create({
          data: {
            id_usuario: i % 2 === 0 ? 3 : 4, // Los movimientos los hacen los operarios 3 y 4
            tipo: i % 2 === 0 ? 'INGRESO' : 'SALIDA',
            fecha_movimiento: getRandomPastDate(20),
            total: totalMovimiento,
            detalles: { create: detalles },
          },
        });
      }

      console.log('Sembrado completado con éxito.');

      return res.status(201).json({
        status: 'success',
        message:
          'Base de datos limpiada y ejecutado el seed con escenarios de prueba.',
        data: {
          testAccounts: {
            caso1_huella: 'operario@empresa.com',
            caso2_fallback: 'carlos.lopez@empresa.com',
            caso3_registrar: 'ana.martinez@empresa.com',
            caso4_bloqueado: 'luis.rodriguez@empresa.com',
          },
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
