import { useQuery } from '@tanstack/react-query';
import { getMovimientoById } from '@/actions/movimientos.action.ts';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  idMovimiento: number | null;
}

export default function DetalleMovimientoModal({
  isOpen,
  onClose,
  idMovimiento,
}: Props) {
  const { data: respuesta, isLoading } = useQuery({
    queryKey: ['movimiento-salida-detalle', idMovimiento],
    queryFn: () => getMovimientoById(idMovimiento!.toString()),
    enabled: isOpen && idMovimiento !== null,
  });

  const movimiento = respuesta?.data;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-2xl flex-col gap-0 overflow-hidden !border-none bg-[#1a1a1a] p-0 text-white outline-none focus:outline-none focus-visible:ring-0 sm:w-full sm:rounded-2xl">
        {/* Cabecera del Modal */}
        <DialogHeader className="border-b border-white/10 p-6 pb-5 text-left">
          <DialogTitle className="text-xl font-bold text-white">
            Detalle de Despacho
          </DialogTitle>
          <DialogDescription className="mt-1 text-xs text-gray-400">
            {idMovimiento
              ? `Código de Auditoría: #${idMovimiento}`
              : 'Cargando información...'}
          </DialogDescription>
        </DialogHeader>
        {/* Cuerpo del Modal con Scroll Interno */}
        <div className="custom-scrollbar overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4 py-8">
              <div className="h-4 w-1/3 rounded bg-white/10" />
              <div className="h-16 w-full rounded bg-white/5" />
              <div className="h-32 w-full rounded bg-white/5" />
            </div>
          ) : !movimiento ? (
            <p className="py-6 text-center text-gray-500">
              No se pudieron recuperar los datos del despacho.
            </p>
          ) : (
            <div className="space-y-6">
              {/* Bloque 1: Metadatos de la Operación */}
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-white/5 bg-[#121212] p-4 text-sm sm:grid-cols-2">
                <div>
                  <span className="mb-0.5 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Operario a Cargo
                  </span>
                  <p className="font-medium text-gray-200">
                    {movimiento.usuario?.nombre || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="mb-0.5 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Fecha y Hora
                  </span>
                  <p className="text-gray-200">
                    {new Date(movimiento.fecha_movimiento).toLocaleString(
                      'es-PE'
                    )}
                  </p>
                </div>

                <div className="col-span-1 mt-1 grid grid-cols-1 gap-4 border-t border-white/5 pt-3 sm:col-span-2 sm:grid-cols-2">
                  <div>
                    <span className="mb-1.5 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Área de Movimiento
                    </span>
                    <Badge
                      className="border-blue-800/50 bg-blue-950/40 px-2 py-0.5 text-[11px] font-bold tracking-wider text-blue-400 uppercase"
                      variant="outline"
                    >
                      {movimiento.tipo}
                    </Badge>
                  </div>
                  <div>
                    <span className="mb-0.5 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Costo Total Despachado
                    </span>
                    <p className="text-base font-bold text-[#2ecc71]">
                      S/ {Number(movimiento.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bloque 2: Tabla de Artículos Incluidos */}
              <div>
                <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Ítems Retirados de Almacén ({movimiento.detalles?.length || 0}
                  )
                </h3>

                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121212]">
                  <Table>
                    <TableHeader className="border-b border-white/10 bg-white/5">
                      <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">
                          Producto
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                          Cantidad
                        </TableHead>
                        <TableHead className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                          P. Unitario
                        </TableHead>
                        <TableHead className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                          Subtotal
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="border-0">
                      {movimiento.detalles?.map((item: any) => (
                        <TableRow
                          key={item.id_detalle_movimiento}
                          className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                        >
                          <TableCell className="px-4 py-3">
                            <p className="font-medium whitespace-nowrap text-white">
                              {item.producto?.nombre}
                            </p>
                            <p className="mt-0.5 font-mono text-[10px] text-gray-500">
                              {item.producto?.codigo_barras || 'S/N'}
                            </p>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center font-mono font-semibold text-slate-400">
                            {item.cantidad}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-right font-mono text-gray-300">
                            S/ {Number(item.precio_unitario).toFixed(2)}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-right font-mono font-bold text-white">
                            S/ {Number(item.subtotal).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Botón Inferior de Cierre */}
        <div className="border-t border-white/10 bg-[#1a1a1a] p-4 sm:p-6 sm:pt-4">
          <Button
            className="w-full border-white/10 bg-[#121212] font-semibold text-gray-300 hover:bg-white/5 hover:text-white"
            variant="outline"
            onClick={onClose}
          >
            Cerrar Auditoría
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
