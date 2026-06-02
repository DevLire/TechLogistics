import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Column } from '@/components/DataTable.tsx';
import { DataTable } from '@/components/DataTable.tsx';
import type { SegmentedControlOption } from '@/components/SegmentedControl';
import {
  getDispositivosAction,
  deleteDispositivoAction,
  type EstadoDispositivo,
} from '@/actions/dispositivos.action.ts';
import type { Datum as DispositivoDatum } from '@/infrastructure/interfaces/responses/get-dispositivos.response.ts';

export const Dispositivos = () => {
  const queryClient = useQueryClient();
  const [pagina, setPagina] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const limite = 10;

  const [estadoDispositivo, setEstadoDispositivo] =
    useState<EstadoDispositivo>('ACTIVOS');

  const OPCIONES_FILTRO: SegmentedControlOption<EstadoDispositivo>[] = [
    { label: 'Todos', value: 'TODOS', color: 'grey' },
    { label: 'Activos', value: 'ACTIVOS', color: 'green' },
    { label: 'Inactivos', value: 'INACTIVOS', color: 'red' },
  ];

  useEffect(() => {
    setPagina((prev) => (prev === 1 ? prev : 1));
  }, [estadoDispositivo]);

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
    queryKey: ['dispositivos', pagina, busqueda, estadoDispositivo],
    queryFn: () => {
      return getDispositivosAction({
        limit: limite,
        page: pagina,
        search: busqueda,
        estado: estadoDispositivo,
      });
    },
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDispositivoAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispositivos'] });
    },
    onError: (error) => {
      console.error('Error al desvincular:', error);
      alert('Hubo un error al intentar desvincular el dispositivo.');
    },
  });

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        '¿Estás seguro de desvincular este dispositivo? Quedará libre para otro operario.'
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const dispositivos = data?.data || [];
  const pagination = data?.pagination;

  const columns: Column<DispositivoDatum>[] = [
    {
      header: 'Usuario',
      render: (row) => (
        <span className="font-medium text-white">
          {row.usuario?.nombre || '-'}
        </span>
      ),
    },
    {
      header: 'Modelo del Dispositivo',
      render: (row) => (
        <span className="text-gray-300">{row.nombre_dispositivo || '-'}</span>
      ),
    },
    {
      header: 'ID Hardware',
      render: (row) => (
        <span className="rounded-md border border-gray-500/20 bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-400">
          {/* Si el ID tiene el sufijo de eliminado, mostramos solo la parte original o un indicador */}
          {row.dispositivo_id.includes('_INACTIVO_') ? (
            <span className="line-through opacity-50">
              {row.dispositivo_id.split('_INACTIVO_')[0]}
            </span>
          ) : (
            row.dispositivo_id || '-'
          )}
        </span>
      ),
    },
    {
      header: 'Fecha de Registro',
      render: (row) => {
        const fecha = new Date(row.fecha_registro);
        return (
          <span className="text-gray-300">{fecha.toLocaleDateString()}</span>
        );
      },
    },
    {
      header: 'Acciones',
      render: (row) => {
        // Solo mostramos el botón si estamos en "Todos" o "Activos" y el dispositivo no está ya inactivo
        const isInactive = row.dispositivo_id.includes('_INACTIVO_');

        if (estadoDispositivo === 'INACTIVOS' || isInactive) {
          return (
            <span className="text-xs text-gray-500 italic">Desvinculado</span>
          );
        }

        return (
          <button
            className="cursor-pointer rounded-md border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white"
            disabled={deleteMutation.isPending}
            onClick={() => handleDelete(row.id_dispositivo_autorizado)}
          >
            {deleteMutation.isPending ? 'Procesando...' : 'Desvincular'}
          </button>
        );
      },
    },
  ];

  return (
    <div className="text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-[22px] font-semibold text-white">
            Dispositivos Autorizados
          </h1>
          <p className="text-[13px] text-gray-400">
            Gestión y consulta de terminales móviles vinculados a operarios
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={dispositivos}
        emptyMessage="No se encontraron registros de dispositivos."
        isFetching={isFetching}
        keyExtractor={(row) => row.id_dispositivo_autorizado}
        loadingMessage="Cargando dispositivos..."
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
          placeholder: 'Buscar por usuario, ID o modelo...',
          isFetching: isFetching,
        }}
        segmentedControl={{
          options: OPCIONES_FILTRO,
          selectedValue: estadoDispositivo,
          onChange: setEstadoDispositivo,
        }}
      />
    </div>
  );
};

export default Dispositivos;
