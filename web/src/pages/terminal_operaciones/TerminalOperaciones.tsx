import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth/useAuthStore.ts';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';

import { getProductos } from '@/actions/productos.action.ts';
import {
  createMovimientoAction,
  type CreateMovimientoPayload,
} from '@/actions/movimientos.action.ts';

import type { Producto } from './components/OperacionProductItem.tsx';
import OperacionProductItem from './components/OperacionProductItem.tsx';
import OperacionCartItem from './components/OperacionCartItem.tsx';
import type { ItemCarrito } from './components/OperacionCartItem.tsx';
import ConfirmModal from '@/components/ConfirmModal.tsx';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type TipoMovimiento = 'INGRESO' | 'SALIDA';

export default function TerminalOperaciones() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [busqueda, setBusqueda] = useState('');
  const [listaOperacion, setListaOperacion] = useState<ItemCarrito[]>([]);
  const [tipoMovimiento, setTipoMovimiento] =
    useState<TipoMovimiento>('SALIDA');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const { data: productosResponse, isLoading } = useQuery({
    queryKey: ['productos', 'terminal', tipoMovimiento],
    queryFn: () =>
      getProductos({ limit: 1000, conStock: tipoMovimiento === 'SALIDA' }),
  });

  const productos = productosResponse?.data || [];

  const total = listaOperacion.reduce(
    (sum, i) => sum + Number(i.precio_venta) * i.cantidad,
    0
  );

  const { mutate: doEfectuarMovimiento, isPending } = useMutation({
    mutationFn: createMovimientoAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
      setListaOperacion([]);
      setIsConfirmModalOpen(false);
      setIsMobileCartOpen(false); // Por si acaso, nos aseguramos que esté cerrado en el success
      toast.success('Operación registrada', {
        description: `La operación de ${tipoMovimiento.toLowerCase()} por S/ ${total.toFixed(2)} se ha guardado correctamente.`,
      });
    },
    onError: (error: unknown) => {
      const message =
        (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        'Error desconocido';
      toast.error('Error al registrar operación', {
        description: message,
      });
    },
  });

  const productosFiltrados = productos.filter(
    (p: Producto) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo_barras.includes(busqueda)
  );

  const agregarALista = (producto: Producto) => {
    const existe = listaOperacion.find(
      (i) => i.id_producto === producto.id_producto
    );

    if (existe) {
      const stockActual = (producto as any).stock_actual ?? 0;
      if (tipoMovimiento === 'SALIDA' && existe.cantidad >= stockActual) {
        toast.error('Inventario insuficiente', {
          description: `El stock actual es de ${stockActual} unidades.`,
        });
        return;
      }

      setListaOperacion((prev) =>
        prev.map((i) =>
          i.id_producto === producto.id_producto
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      );
      return;
    }

    const stockActualProducto = (producto as any).stock_actual ?? 0;
    if (tipoMovimiento === 'SALIDA' && stockActualProducto < 1) {
      toast.error('Producto sin stock', {
        description: 'No hay unidades disponibles para despachar.',
      });
      return;
    }

    setListaOperacion((prev) => [...prev, { ...producto, cantidad: 1 }]);
  };

  const cambiarCantidad = (id: number, delta: number) => {
    const item = listaOperacion.find((i) => i.id_producto === id);
    if (!item) return;

    const nuevaCantidad = Math.max(1, item.cantidad + delta);
    const stockActualItem = (item as any).stock_actual ?? 0;
    if (tipoMovimiento === 'SALIDA' && nuevaCantidad > stockActualItem) {
      toast.warning('Stock máximo alcanzado', {
        description: `No puedes exceder el stock actual (${stockActualItem} unidades).`,
      });
      return;
    }

    setListaOperacion((prev) =>
      prev.map((i) =>
        i.id_producto === id ? { ...i, cantidad: nuevaCantidad } : i
      )
    );
  };

  const establecerCantidad = (id: number, cantidad: number) => {
    const item = listaOperacion.find((i) => i.id_producto === id);
    if (!item) return;

    let nuevaCantidad = cantidad < 0 ? 0 : cantidad;
    const stockActualItem = (item as any).stock_actual ?? 0;

    if (tipoMovimiento === 'SALIDA' && nuevaCantidad > stockActualItem) {
      toast.warning('Stock máximo alcanzado', {
        description: `La cantidad se ajustó al stock actual disponible (${stockActualItem} unidades).`,
      });
      nuevaCantidad = stockActualItem;
    }

    setListaOperacion((prev) =>
      prev.map((i) =>
        i.id_producto === id ? { ...i, cantidad: nuevaCantidad } : i
      )
    );
  };

  const eliminarItem = (id: number) =>
    setListaOperacion((prev) => prev.filter((i) => i.id_producto !== id));

  const procesarOperacion = () => {
    if (listaOperacion.length === 0) {
      toast.info('Lista vacía', {
        description: 'La lista de operación está vacía. Agrega productos.',
      });
      return;
    }

    setIsMobileCartOpen(false);
    setIsConfirmModalOpen(true);
  };

  const confirmarOperacion = () => {
    const payload: CreateMovimientoPayload = {
      id_usuario: user!.id_usuario,
      total: Number(total.toFixed(2)),
      tipo: tipoMovimiento,
      detalles: listaOperacion.map((i) => ({
        id_producto: i.id_producto,
        cantidad: i.cantidad,
        precio_unitario: Number(i.precio_venta),
        subtotal: Number((Number(i.precio_venta) * i.cantidad).toFixed(2)),
        observaciones: `Registro desde terminal web (${tipoMovimiento})`,
      })),
    };

    doEfectuarMovimiento(payload);
  };

  if (isLoading)
    return (
      <div className="animate-pulse p-6 text-gray-100">
        Cargando catálogo...
      </div>
    );

  const colorBoton =
    tipoMovimiento === 'INGRESO'
      ? 'bg-[#2ecc71] hover:bg-[#27ae60] text-[#0f4c35]'
      : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white';

  const colorBordeResaltado =
    tipoMovimiento === 'INGRESO'
      ? 'focus-visible:border-[#2ecc71] focus-visible:ring-[#2ecc71]/20'
      : 'focus-visible:border-[#3b82f6] focus-visible:ring-[#3b82f6]/20';

  const renderCartContent = () => (
    <>
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-5 pb-4">
        <h2 className="text-xs font-semibold tracking-wider text-white uppercase">
          Detalle de Operación
        </h2>
        <span
          className={`mr-8 rounded border px-2 py-0.5 text-[10px] font-bold tracking-wider lg:mr-0 ${
            tipoMovimiento === 'INGRESO'
              ? 'border-emerald-800/50 bg-emerald-950/40 text-emerald-400'
              : 'border-blue-800/50 bg-blue-950/40 text-blue-400'
          }`}
        >
          {tipoMovimiento}
        </span>
      </div>

      <div className="custom-scrollbar flex flex-1 flex-col gap-2.5 overflow-y-auto p-5 py-3">
        {listaOperacion.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center opacity-30">
            <p className="mt-2 text-center text-sm">
              Agrega productos para registrar el {tipoMovimiento.toLowerCase()}
            </p>
          </div>
        ) : (
          listaOperacion.map((item) => (
            <OperacionCartItem
              key={item.id_producto}
              item={item}
              tipo_movimiento={tipoMovimiento}
              onCambiarCantidad={cambiarCantidad}
              onEliminar={eliminarItem}
              onSetCantidad={establecerCantidad}
            />
          ))
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 bg-white/5 p-5">
        <div className="mb-3 flex items-center justify-between text-xl font-bold">
          <span className="text-sm tracking-wider text-gray-400 uppercase">
            Valorización
          </span>
          <span
            className={
              tipoMovimiento === 'INGRESO' ? 'text-[#2ecc71]' : 'text-[#60a5fa]'
            }
          >
            S/ {total.toFixed(2)}
          </span>
        </div>

        <Button
          className={`h-12 w-full rounded-xl border border-white/5 text-base font-bold shadow-lg transition-all active:scale-[0.98] ${colorBoton}`}
          disabled={isPending || listaOperacion.length === 0}
          onClick={procesarOperacion}
        >
          {isPending ? 'Procesando...' : `Confirmar ${tipoMovimiento}`}
        </Button>
      </div>
    </>
  );

  return (
    <div className="relative flex h-[calc(100vh-96px)] flex-col gap-6 text-gray-100 lg:flex-row">
      <div className="flex flex-1 flex-col gap-4 overflow-hidden pb-20 lg:pb-0">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="mb-1 text-[22px] font-semibold text-white">
              Terminal de Almacén
            </h1>
            <p className="text-[13px] text-gray-400">
              Escanea o busca productos para operar
            </p>
          </div>

          <div className="flex w-full rounded-lg border border-white/10 bg-[#1a1a1a] p-1 shadow-sm sm:w-auto">
            {(['INGRESO', 'SALIDA'] as TipoMovimiento[]).map((tipo) => (
              <button
                key={tipo}
                className={`flex-1 cursor-pointer rounded-md px-5 py-2 text-xs font-bold tracking-wider transition-all duration-200 sm:flex-none ${
                  tipoMovimiento === tipo
                    ? tipo === 'INGRESO'
                      ? 'bg-[#10b981]/20 text-[#2ecc71] shadow'
                      : 'bg-[#3b82f6]/20 text-[#60a5fa] shadow'
                    : 'text-gray-500 hover:bg-white/[0.02] hover:text-gray-300'
                }`}
                onClick={() => {
                  setTipoMovimiento(tipo);
                  setListaOperacion([]);
                }}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Input
            autoFocus
            className={`w-full rounded-xl border-white/10 bg-[#1a1a1a] px-4 py-6 text-sm text-gray-200 transition-all ${colorBordeResaltado}`}
            placeholder="Buscar producto..."
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="custom-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto pr-2">
          {productosFiltrados.map((p: Producto) => {
            const itemEnCarrito = listaOperacion.find(
              (i) => i.id_producto === p.id_producto
            );

            return (
              <OperacionProductItem
                key={p.id_producto}
                cantidadEnCarrito={itemEnCarrito?.cantidad || 0}
                producto={p}
                tipo_movimiento={tipoMovimiento}
                onAgregar={agregarALista}
                onCambiarCantidad={cambiarCantidad}
                onEliminar={eliminarItem}
              />
            );
          })}
        </div>
      </div>

      <div className="hidden w-[360px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-2xl lg:flex">
        {renderCartContent()}
      </div>

      <div className="absolute right-0 bottom-4 left-0 px-4 lg:hidden">
        <Sheet open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
          <SheetTrigger asChild>
            <Button
              className={`flex h-14 w-full items-center justify-between rounded-xl px-6 shadow-2xl ${colorBoton}`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-semibold">Ver Bandeja</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-xs font-bold">
                  {listaOperacion.length}
                </span>
              </div>
              <span className="text-base font-bold">S/ {total.toFixed(2)}</span>
            </Button>
          </SheetTrigger>

          <SheetContent
            className="flex h-[85vh] flex-col border-white/10 bg-[#121212] p-0 text-white"
            side="bottom"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Bandeja de Operación</SheetTitle>
            </SheetHeader>
            {renderCartContent()}
          </SheetContent>
        </Sheet>
      </div>

      <ConfirmModal
        confirmText={`Registrar ${tipoMovimiento}`}
        isLoading={isPending}
        isOpen={isConfirmModalOpen}
        message={
          <>
            ¿Estás seguro de registrar este{' '}
            <strong>{tipoMovimiento.toLowerCase()}</strong> por un valor total
            de <strong>S/ {total.toFixed(2)}</strong>? Esta acción no se puede
            deshacer.
          </>
        }
        title={`Confirmar ${tipoMovimiento}`}
        type={tipoMovimiento === 'INGRESO' ? 'success' : 'info'}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmarOperacion}
      />
    </div>
  );
}
