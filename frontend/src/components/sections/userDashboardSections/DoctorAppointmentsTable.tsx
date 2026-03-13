/* eslint-disable react-hooks/incompatible-library */

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import type { IDoctorAppointment } from "@/types";
import {
  formatDate,
  formatTime,
  getDhakaNow,
  isAppointmentPast,
} from "@/lib/utils";
import Loader from "@/components/shared/Loader";
import { useGetAppointmentsAsDoctor } from "@/hooks/useDashboard";

const DoctorAppointmentsTable = () => {
  const { data, isPending, isError } = useGetAppointmentsAsDoctor();

  const { todayStr, nowMinute } = useMemo(() => getDhakaNow(), []);

  const columns = useMemo<ColumnDef<IDoctorAppointment>[]>(
    () => [
      {
        id: "sl",
        header: "SL",
        cell: ({ row }) => row.index + 1,
      },
      {
        id: "patientName",
        header: "Patient",
        accessorFn: (row) => row.patientId.name,
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue() as string}</span>
        ),
      },
      {
        id: "date",
        header: "Date",
        accessorKey: "date",
        cell: ({ getValue }) => formatDate(getValue() as string),
      },
      {
        id: "startTime",
        header: "Start Time",
        accessorKey: "startMinute",
        cell: ({ getValue }) => formatTime(getValue() as number),
      },
      {
        id: "status",
        header: "Status",

        cell: () => (
          <span className="bg-green-600 text-white px-3 py-1 rounded text-sm capitalize">
            confirmed
          </span>
        ),
      },
      {
        id: "paymentStatus",
        header: "Payment Status",

        cell: () => (
          <span className="bg-green-600 text-white px-3 py-1 rounded text-sm capitalize">
            paid
          </span>
        ),
      },
      {
        id: "paymentAmount",
        header: "Amount",
        accessorKey: "paymentAmount",
        cell: ({ getValue }) => {
          const val = getValue() as number | undefined;
          return val != null ? (
            <span>৳ {val}</span>
          ) : (
            <span className="text-gray-400">—</span>
          );
        },
      },
      {
        id: "transactionId",
        header: "Transaction ID",
        accessorKey: "paymentTransactionId",
        cell: ({ getValue }) => {
          const val = getValue() as string | undefined;
          return val ? (
            <span className="font-mono text-xs">{val}</span>
          ) : (
            <span className="text-gray-400 text-xs">—</span>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) return <Loader />;

  if (isError) {
    return (
      <p className="text-red-500 mt-4">
        Failed to load patient list. Please try again.
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 mt-6 text-center">
        No confirmed appointments with patients yet.
      </p>
    );
  }

  return (
    <div className="doctorDashboardTableContainer">
      <table className="w-full">
        <thead className="bg-indigo-600">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="tableHeaderCells">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const { date, startMinute } = row.original;
            const isPast = isAppointmentPast(
              date,
              startMinute,
              todayStr,
              nowMinute,
            );

            return (
              <tr
                key={row.id}
                className={`tableRow ${
                  isPast ? "bg-amber-200" : "bg-green-200"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="tableBodyCells">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="legend">
        <span className="legendPart">
          <span className=" bg-green-200 " />
          Upcoming
        </span>
        <span className="legendPart">
          <span className=" bg-amber-200" />
          Past
        </span>
      </div>
    </div>
  );
};

export default DoctorAppointmentsTable;
