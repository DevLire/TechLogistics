import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import {
  SegmentedControl,
  type SegmentedControlOption,
} from './SegmentedControl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
}

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPrev: () => void;
  onNext: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isFetching?: boolean;
}

interface SegmentedControlConfig<T extends string | number> {
  options: SegmentedControlOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
}

interface DataTableProps<T, S extends string | number> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string | number;
  isLoading?: boolean;
  isFetching?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  search?: SearchProps;
  pagination?: PaginationProps;
  segmentedControl?: SegmentedControlConfig<S>;
}

export function DataTable<T, S extends string | number>({
  data,
  columns,
  keyExtractor,
  isLoading,
  isFetching,
  emptyMessage = 'No se encontraron resultados.',
  loadingMessage = 'Cargando...',
  search,
  pagination,
  segmentedControl,
}: DataTableProps<T, S>) {
  return (
    <div className="flex flex-col gap-6">
      {/* Search and SegmentedControl Header */}
      {(search || segmentedControl) && (
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          {search ? (
            <div className="relative flex w-full flex-col gap-2 md:w-auto">
              <Input
                className="w-full border-white/10 bg-[#1a1a1a] px-4 py-5 text-sm text-gray-200 transition-all focus-visible:border-[#2ecc71] focus-visible:ring-2 focus-visible:ring-[#2ecc71]/20 md:w-[300px] md:py-2.5"
                placeholder={search.placeholder || 'Buscar...'}
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
              />
              {search.isFetching && (
                <div className="absolute top-[14px] right-3 flex items-center gap-1.5 md:top-2.5 md:-right-24">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400 md:h-3 md:w-3" />
                  <span className="hidden text-xs text-gray-400 md:inline-block">
                    Buscando...
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div />
          )}

          {segmentedControl && (
            <div className="w-full overflow-x-auto md:w-auto">
              <SegmentedControl
                options={segmentedControl.options}
                selectedValue={segmentedControl.selectedValue}
                onChange={segmentedControl.onChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div
        className={`flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-xl transition-opacity duration-200 ${
          isFetching ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {isLoading && data.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            {loadingMessage}
          </div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            {emptyMessage}
          </div>
        ) : (
          <Table>
            <TableHeader className="border-b border-white/10 bg-white/5">
              <TableRow className="border-none hover:bg-transparent">
                {columns.map((col, idx) => (
                  <TableHead
                    key={idx}
                    className="h-12 px-4 text-center text-[11px] font-medium tracking-wider whitespace-nowrap text-gray-400 uppercase"
                  >
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="border-0">
              {data.map((row, idx) => {
                const isLast = idx === data.length - 1;
                return (
                  <TableRow
                    key={keyExtractor(row)}
                    className={`${
                      isLast ? 'border-none' : 'border-b border-white/5'
                    } transition-colors hover:bg-white/[0.02]`}
                  >
                    {columns.map((col, colIdx) => (
                      <TableCell
                        key={colIdx}
                        className="p-4 text-center font-medium whitespace-nowrap text-gray-200"
                      >
                        {col.render
                          ? col.render(row)
                          : col.accessor
                            ? String(row[col.accessor])
                            : null}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Pagination Footer */}
        {pagination && data.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 bg-white/5 px-6 py-4 sm:flex-row">
            <span className="text-xs text-gray-400">
              Mostrando página{' '}
              <span className="font-medium text-white">{pagination.page}</span>{' '}
              de{' '}
              <span className="font-medium text-white">
                {Math.ceil(pagination.total / pagination.limit) || 1}
              </span>
            </span>

            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                className="flex-1 cursor-pointer border-white/10 bg-[#1a1a1a] font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:flex-none"
                disabled={!pagination.hasPrev}
                variant="outline"
                onClick={pagination.onPrev}
              >
                Anterior
              </Button>
              <Button
                className="flex-1 cursor-pointer border-white/10 bg-[#1a1a1a] font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:flex-none"
                disabled={!pagination.hasNext}
                variant="outline"
                onClick={pagination.onNext}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
