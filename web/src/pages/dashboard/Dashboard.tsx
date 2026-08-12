import { useQuery } from '@tanstack/react-query';
import { MetricaCard } from '../../components/MetricaCard.tsx';
import AlertaRow from './components/AlertaRow';

import { getAlertasStock, getProductos } from '@/actions/productos.action.ts';
import { getMovimientosIngresosAction } from '@/actions/movimientos-ingresos.action.ts';
import {
  getAccesosBiometricosAction,
  getAnomaliasAction,
} from '@/actions/accesos-biometricos.action.ts';

import {
  GraficoBarras,
  type ConfigBarra,
} from '@/components/GráficoBarras.tsx';
import {
  GraficoLineas,
  type ConfigLinea,
} from '@/components/GraficoLineas.tsx';
import {
  transformarDatosAccesos,
  type DataGraficoAcceso,
} from '@/infrastructure/adapters/accesos-biometricos.adapter.ts';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  // 1. Carga de Alertas (Para Tabla Izquierda y Gráfico de Líneas)
  const { data: alertas = [], isLoading: loadingAlertas } = useQuery({
    queryKey: ['alertas'],
    queryFn: getAlertasStock,
  });

  // 2. Carga de Ingresos
  const { data: dataIngresos } = useQuery({
    queryKey: ['ingresos'],
    queryFn: () => getMovimientosIngresosAction({ limit: 1000, page: 1 }),
  });

  // 3. Carga del Total de Productos
  const { data: productosResponse } = useQuery({
    queryKey: ['productos-total'],
    queryFn: () => getProductos({ limit: 1 }),
  });

  // 4. Carga de Accesos Biométricos (Para Gráfico de Barras)
  const {
    data: accesosBiometricos = [],
    isLoading: loadingAccesosBiometricos,
  } = useQuery({
    queryKey: ['accesosBiometricos', { limit: 1000, page: 1 }],
    queryFn: () => getAccesosBiometricosAction({ limit: 1000, page: 1 }),
    select: (response) => transformarDatosAccesos(response.data),
  });

  // 5. Carga de Anomalías (Para Tabla Derecha)
  const { data: anomalias = [], isLoading: loadingAnomalias } = useQuery({
    queryKey: ['anomalias', { limit: 1000, page: 1 }],
    queryFn: () => getAnomaliasAction({ limit: 1000, page: 1 }),
    select: (response) => response.data || [],
  });

  // CONFIGURACIÓN DE GRÁFICOS
  const configBarras: ConfigBarra<DataGraficoAcceso>[] = [
    { dataKey: 'Permitidos', fill: '#10b981', name: 'Accesos Permitidos' },
    { dataKey: 'Denegados', fill: '#ef4444', name: 'Accesos Denegados' },
  ];

  const configLineas: ConfigLinea<any>[] = [
    { dataKey: 'stock_actual', stroke: '#3b82f6', name: 'Stock Actual' },
    {
      dataKey: 'stock_minimo',
      stroke: '#f59e0b',
      name: 'Stock Mínimo',
      strokeDasharray: '5 5',
    },
  ];

  // VARIABLES DERIVADAS
  const ingresos = dataIngresos?.data || [];
  const totalProductos = productosResponse?.pagination?.total || 0;

  const totalAccesosHistoricos = accesosBiometricos.reduce(
    (acc, curr) => acc + curr.Permitidos + curr.Denegados,
    0
  );

  const metricas = [
    { label: 'Productos en alerta (ML)', valor: alertas.length.toString() },
    { label: 'Ingresos registrados', valor: ingresos.length.toString() },
    { label: 'Total en catálogo', valor: totalProductos.toString() },
    { label: 'Eventos Biométricos', valor: totalAccesosHistoricos.toString() },
  ];

  return (
    <div className="space-y-6 text-gray-100">
      {/* ENCABEZADO */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Dashboard Informativo
        </h1>
        <p className="text-gray-400">
          Panel de control logístico y telemetría de seguridad IoT
        </p>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.map((m) => (
          <MetricaCard key={m.label} label={m.label} valor={m.valor} />
        ))}
      </div>

      {/* ZONA DE GRÁFICOS (2 Columnas) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {loadingAccesosBiometricos ? (
          <GraficoBarras.Skeleton titulo="Auditoría de Accesos Biométricos (IoT)" />
        ) : (
          <GraficoBarras<DataGraficoAcceso>
            barras={configBarras}
            data={accesosBiometricos}
            titulo="Auditoría de Accesos Biométricos (IoT)"
            xAxisKey="dispositivo"
          />
        )}

        {loadingAlertas ? (
          <GraficoLineas.Skeleton titulo="Proyección de Agotamiento de Inventario" />
        ) : (
          <GraficoLineas
            data={alertas}
            lineas={configLineas}
            titulo="Proyección de Agotamiento de Inventario"
            xAxisKey="nombre"
          />
        )}
      </div>

      {/* ZONA DE TABLAS INFERIORES */}
      <div className="mt-4 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* TABLA 1: Alertas de Stock */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">
              Alertas de Stock Crítico
            </h2>
            <Badge
              className="animate-pulse border-red-800/40 bg-red-900/30 px-2.5 py-0.5 text-xs font-bold text-red-400"
              variant="outline"
            >
              {alertas.length} CRÍTICAS
            </Badge>
          </div>

          {alertas.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-[#121212] p-8 text-center">
              <p className="text-gray-500">
                Stock estabilizado. No hay alertas predictivas.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-xl">
              <Table>
                <TableHeader className="border-b border-white/10 bg-white/5">
                  <TableRow className="border-none text-gray-400 hover:bg-transparent">
                    <TableHead className="px-4 py-3 text-left text-[11px] font-medium tracking-wider whitespace-nowrap uppercase">
                      Producto
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-[11px] font-medium tracking-wider whitespace-nowrap uppercase">
                      Stock
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-[11px] font-medium tracking-wider whitespace-nowrap uppercase">
                      Mínimo
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-[11px] font-medium tracking-wider whitespace-nowrap uppercase">
                      Proveedor
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-[11px] font-medium tracking-wider whitespace-nowrap uppercase">
                      Acción
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-0">
                  {alertas.map((a, i: number) => (
                    <AlertaRow
                      key={a.id_producto}
                      alerta={a}
                      isLast={i === alertas.length - 1}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* TABLA 2: Últimas Anomalías de Seguridad */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">
              Log de Seguridad (Anomalías)
            </h2>
          </div>

          {loadingAnomalias ? (
            <div className="h-48 animate-pulse rounded-xl border border-white/10 bg-[#121212] p-8" />
          ) : anomalias.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-[#121212] p-8 text-center">
              <p className="text-gray-500">
                No se registran intentos de acceso denegados.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-xl">
              <Table>
                <TableHeader className="border-b border-white/10 bg-white/5">
                  <TableRow className="border-none text-gray-400 hover:bg-transparent">
                    <TableHead className="px-4 py-3 text-left text-[11px] font-medium tracking-wider whitespace-nowrap uppercase">
                      Fecha / Hora
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-[11px] font-medium tracking-wider whitespace-nowrap uppercase">
                      Operario
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-[11px] font-medium tracking-wider whitespace-nowrap uppercase">
                      Dispositivo
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-[11px] font-medium tracking-wider whitespace-nowrap uppercase">
                      Estado
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-0">
                  {anomalias.slice(0, 8).map((anomalia) => (
                    <TableRow
                      key={anomalia.id_acceso_biometrico}
                      className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                    >
                      <TableCell className="px-4 py-3 whitespace-nowrap text-gray-300">
                        {new Date(anomalia.fecha_hora).toLocaleString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap text-gray-300">
                        {anomalia.usuario?.nombre || 'Desconocido'}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs whitespace-nowrap text-gray-400">
                        {anomalia.dispositivo_autorizado?.nombre_dispositivo ||
                          'Dispositivo no registrado'}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <Badge
                          className="border-red-800/50 bg-red-900/30 px-2 py-1 text-[10px] font-bold tracking-wider text-red-400 uppercase"
                          variant="outline"
                        >
                          {anomalia.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
