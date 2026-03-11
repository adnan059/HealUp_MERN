/* eslint-disable react-hooks/incompatible-library */
// frontend/src/pages/dashboard/user/PatientAppointmentsTable.tsx

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

import type { IPatientAppointment } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";
import Loader from "@/components/shared/Loader";
import { useGetAppointmentsAsPatient } from "@/hooks/useDashboard";

// ── status badge ────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: IPatientAppointment["status"] }) => {
  const styles = {
    confirmed: "bg-green-600 text-white",
    pending: "bg-amber-500 text-white",
    cancelled: "bg-red-600 text-white",
  };
  return (
    <span className={`px-3 py-1 rounded text-sm capitalize ${styles[status]}`}>
      {status}
    </span>
  );
};

// ── payment status badge ────────────────────────────────────────────────────

const PaymentBadge = ({
  status,
}: {
  status: IPatientAppointment["paymentStatus"];
}) => {
  const styles = {
    paid: "bg-green-600 text-white",
    unpaid: "bg-amber-500 text-white",
    refunded: "bg-blue-600 text-white",
    expired: "bg-red-600 text-white",
  };
  return (
    <span className={`px-3 py-1 rounded text-sm capitalize ${styles[status]}`}>
      {status}
    </span>
  );
};

// ── component ───────────────────────────────────────────────────────────────

const PatientAppointmentsTable = () => {
  const { data, isPending, isError } = useGetAppointmentsAsPatient();

  const columns = useMemo<ColumnDef<IPatientAppointment>[]>(
    () => [
      {
        id: "sl",
        header: "SL",
        cell: ({ row }) => row.index + 1,
      },
      {
        id: "doctorName",
        header: "Doctor",
        accessorFn: (row) => row.doctorId.userId.name,
        cell: ({ getValue }) => (
          <span className="font-medium">Dr. {getValue() as string}</span>
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
        accessorKey: "status",
        cell: ({ getValue }) => (
          <StatusBadge status={getValue() as IPatientAppointment["status"]} />
        ),
      },
      {
        id: "paymentStatus",
        header: "Payment Status",
        accessorKey: "paymentStatus",
        cell: ({ getValue }) => (
          <PaymentBadge
            status={getValue() as IPatientAppointment["paymentStatus"]}
          />
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
        Failed to load appointments. Please try again.
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 mt-6 text-center">
        You have no appointments yet.
      </p>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full">
        <thead className="bg-indigo-600">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-2 border border-indigo-600 text-white select-none"
                >
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-indigo-600">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-2 border text-center border-indigo-600"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientAppointmentsTable;
