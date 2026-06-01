import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Column } from '@/components/DataTable.tsx';
import { DataTable } from '@/components/DataTable.tsx';
import type { SegmentedControlOption } from '@/components/SegmentedControl';
import { getAccesosBiometricosAction } from '@/actions/accesos-biometricos.action.ts';
import type { GetAccesosBiometricosDatum, Estado } from '@/infrastructure/interfaces/responses/get-accesos-biometricos.ts';

export const Accesos = () => {
  const [pagina, setPagina] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const limite = 10;

  type FiltroEstado = 'TODOS' | 'PERMITIDO' | 'DENEGADO';
  const [estadoAcceso, setEstadoAcceso] = useState<FiltroEstado>('TODOS');

  const OPCIONES_FILTRO: SegmentedControlOption<FiltroEstado>[] = [
    { label: 'Todos', value: 'TODOS', color: 'grey' },
    { label: 'Permitido', value: 'PERMITIDO', color: 'green' },
    { label: 'Denegado', value: 'DENEGADO', color: 'red' },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPagina((prev) => (prev === 1 ? prev : 1));
  }, [estadoAcceso]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setBusqueda(inputValue);
      setPagina(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const { data, isFetching } = useQuery({
    queryKey: ['accesos', pagina, busqueda, estadoAcceso],
    queryFn: () => {
      // Si la API acepta el filtro de estado, se puede enviar aquí.
      // Adaptar el Action si es necesario, de momento se asume que no filtra por estado (al no estar definido en Action Options) 
      // o se pasa en el query. Lo omitimos o enviamos si lo acepta.
      return getAccesosBiometricosAction({
        limit: limite,
        page: pagina,
        search: busqueda,
      });
    },
    placeholderData: (previousData) => previousData,
  });

  // Filtramos localmente si la API no soporta el filtro por estado, pero idealmente se filtraría en el backend.
  // Aquí usamos el field `estado` de la respueta.
  let accesos = data?.data || [];
  if (estadoAcceso !== 'TODOS') {
    accesos = accesos.filter((acceso) => acceso.estado === estadoAcceso);
  }
  const pagination = data?.pagination;

  const columns: Column<GetAccesosBiometricosDatum>[] = [
    {
      header: 'Usuario',
      render: (row) => (
        <span className="font-medium text-white">{row.usuario?.nombre || '-'}</span>
      ),
    },
    {
      header: 'Dispositivo',
      render: (row) => (
        <span className="text-gray-300">{row.dispositivo_autorizado?.nombre_dispositivo || '-'}</span>
      ),
    },
    {
      header: 'Método de Acceso',
      render: (row) => (
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            row.metodo_acceso === 'HUELLA'
              ? 'border border-[#2ecc71]/20 bg-[#2ecc71]/10 text-[#2ecc71]'
              : row.metodo_acceso === 'PASSWORD'
                ? 'border border-red-500/20 bg-red-500/10 text-red-500'
                : 'border border-gray-500/20 bg-gray-500/10 text-gray-400'
          }`}
        >
          {row.metodo_acceso || '-'}
        </span>
      ),
    },
    {
      header: 'Fecha y Hora',
      render: (row) => {
        const fecha = new Date(row.fecha_hora);
        return (
          <span className="text-gray-300">
            {fecha.toLocaleDateString()} {fecha.toLocaleTimeString()}
          </span>
        );
      },
    },
    {
      header: 'Estado',
      render: (row) => (
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            row.estado === 'PERMITIDO'
              ? 'border border-[#2ecc71]/20 bg-[#2ecc71]/10 text-[#2ecc71]'
              : 'border border-red-500/20 bg-red-500/10 text-red-500'
          }`}
        >
          {row.estado}
        </span>
      ),
    },
  ];

  return (
    <div className="text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-[22px] font-semibold text-white">
            Accesos Biométricos
          </h1>
          <p className="text-[13px] text-gray-400">
            Registro de accesos al almacén mediante biometría
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={accesos}
        emptyMessage="No se encontraron registros de accesos."
        isFetching={isFetching}
        keyExtractor={(row) => row.id_acceso_biometrico}
        loadingMessage="Cargando accesos..."
        pagination={{
          page: pagina,
          total: pagination?.total || 0,
          limit: limite,
          hasPrev: pagina > 1,
          hasNext: pagina < (Math.ceil((pagination?.total || 0) / limite) || 1),
          onPrev: () => setPagina((p) => Math.max(1, p - 1)),
          onNext: () => setPagina((p) => p + 1),
        }}
        search={{
          value: inputValue,
          onChange: setInputValue,
          placeholder: 'Buscar por usuario o dispositivo...',
          isFetching: isFetching,
        }}
        segmentedControl={{
          options: OPCIONES_FILTRO,
          selectedValue: estadoAcceso,
          onChange: setEstadoAcceso,
        }}
      />
    </div>
  );
};
export default Accesos;