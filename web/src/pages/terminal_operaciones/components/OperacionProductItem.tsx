import { Minus, Plus } from 'lucide-react';

export interface Producto {
  id_producto: number;
  nombre: string;
  precio_venta: number | string;
  codigo_barras: string;
  stock_actual?: number;
}

export interface PosProductItemProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
  tipo_movimiento: 'INGRESO' | 'SALIDA';
  cantidadEnCarrito?: number;
  onCambiarCantidad?: (id: number, delta: number) => void;
  onEliminar?: (id: number) => void;
}

export default function OperacionProductItem({
  producto,
  onAgregar,
  tipo_movimiento,
  cantidadEnCarrito = 0,
  onCambiarCantidad,
  onEliminar,
}: PosProductItemProps) {
  const precio = Number(producto.precio_venta).toFixed(2);
  const enCarrito = cantidadEnCarrito > 0;

  const colorAcento =
    tipo_movimiento === 'INGRESO' ? 'text-[#2ecc71]' : 'text-[#3b82f6]';
  const bgHover =
    tipo_movimiento === 'INGRESO'
      ? 'hover:border-[#2ecc71]/30 hover:bg-[#2ecc71]/10'
      : 'hover:border-[#3b82f6]/30 hover:bg-[#3b82f6]/10';
  const bgActive =
    tipo_movimiento === 'INGRESO'
      ? 'border-[#2ecc71]/50 bg-[#2ecc71]/5'
      : 'border-[#3b82f6]/50 bg-[#3b82f6]/5';

  const handleRestar = () => {
    if (cantidadEnCarrito === 1 && onEliminar) {
      onEliminar(producto.id_producto);
    } else if (onCambiarCantidad) {
      onCambiarCantidad(producto.id_producto, -1);
    }
  };

  const handleSumar = () => {
    if (onCambiarCantidad) {
      onCambiarCantidad(producto.id_producto, 1);
    }
  };

  return (
    <div
      className={`group flex items-center justify-between rounded-xl border p-4 transition-all ${
        enCarrito
          ? bgActive
          : `cursor-pointer border-white/5 bg-[#1a1a1a] ${bgHover}`
      }`}
      onClick={() => {
        if (!enCarrito) onAgregar(producto);
      }}
    >
      <div>
        <p
          className={`mb-0.5 font-medium transition-colors ${
            enCarrito ? 'text-white' : 'text-gray-200 group-hover:text-white'
          }`}
        >
          {producto.nombre}
        </p>
        <p className="text-[12px] text-gray-500">
          Código: <span className="font-mono">{producto.codigo_barras}</span>
        </p>
      </div>

      <div className="flex flex-col items-end gap-2 text-right">
        <span className={`text-lg font-bold ${colorAcento}`}>S/ {precio}</span>

        {enCarrito ? (
          <div
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded bg-white/5 text-white transition-colors hover:bg-red-500/20 hover:text-red-400 active:scale-95"
              onClick={handleRestar}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[20px] text-center text-sm font-bold text-white">
              {cantidadEnCarrito}
            </span>
            <button
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded bg-white/5 text-white transition-colors hover:bg-white/20 active:scale-95"
              onClick={handleSumar}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <p className="text-[10px] tracking-tighter text-gray-600 uppercase">
            Disponible
          </p>
        )}
      </div>
    </div>
  );
}
