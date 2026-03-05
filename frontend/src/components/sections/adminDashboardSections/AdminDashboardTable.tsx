/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, type ChangeEvent, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type SortingState,
  type Updater,
  type ColumnDef,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useTableUrlState } from "@/hooks/useTableUrlState";
import {
  useGetAllDoctorsForAdmin,
  useUpdateDoctorApproval,
  useDeleteDoctor,
} from "@/hooks/useAdmin";

import { specialties as specialtiesList } from "@/lib";
import debounce from "lodash/debounce";
import type {
  AdminDashboardFilterKey,
  AdminDashboardFilterValue,
  IDoctorDetailsWithSchedule,
} from "@/types";
import Loader from "@/components/shared/Loader";

const AdminDashboardTable = () => {
  const { get, set } = useTableUrlState();

  // URL-based state
  const page = Number(get("page", 1));
  const limit = Number(get("limit", 10));
  const sortBy = get("sortBy", "createdAt");
  const sortOrder = get("sortOrder", "asc") as "asc" | "desc";
  const selectedSpecialties = (get("specialty", "")?.split(",") || []).filter(
    Boolean,
  );
  const isApproved = get("isApproved", "all");
  const search = get("search", "");

  // Local state
  const [viewDoctor, setViewDoctor] =
    useState<IDoctorDetailsWithSchedule | null>(null);
  const [deleteDoctorId, setDeleteDoctorId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([
    { id: sortBy, desc: sortOrder === "desc" },
  ]);

  // Debounced filter updater to prevent rapid fetches
  const updateUrlStateDebounced = useMemo(
    () =>
      debounce(
        (filters: {
          search?: string;
          specialty?: string;
          isApproved?: string;
          sortBy?: string;
          sortOrder?: "asc" | "desc";
          page?: string;
        }) => set(filters),
        250,
      ),
    [set],
  );

  const handleFilterChange = useCallback(
    (key: AdminDashboardFilterKey, value: AdminDashboardFilterValue) => {
      if (key === "specialty" && Array.isArray(value)) {
        updateUrlStateDebounced({ specialty: value.join(","), page: "1" });
      } else {
        updateUrlStateDebounced({ [key]: String(value), page: "1" });
      }
    },
    [updateUrlStateDebounced],
  );

  // Fetch data
  const { data, isPending } = useGetAllDoctorsForAdmin({
    page,
    limit,
    sortBy,
    sortOrder,
    specialty: selectedSpecialties.length
      ? selectedSpecialties.join(",")
      : undefined,
    isApproved:
      isApproved === "all" ? undefined : isApproved === "true" ? true : false,
    search: search || undefined,
  });

  // Mutations
  const approvalMutation = useUpdateDoctorApproval();
  const deleteMutation = useDeleteDoctor();

  // Debounced search
  const handleSearch = useMemo(
    () =>
      debounce((val: string) => {
        handleFilterChange("search", val);
      }, 500),
    [],
  );

  // Specialty filter toggle
  const toggleSpecialty = (sp: string) => {
    let newSpecialties = [...selectedSpecialties];
    if (newSpecialties.includes(sp)) {
      newSpecialties = newSpecialties.filter((s) => s !== sp);
    } else {
      newSpecialties.push(sp);
    }
    handleFilterChange("specialty", newSpecialties);
  };

  // Columns
  const columns = useMemo<ColumnDef<IDoctorDetailsWithSchedule>[]>(
    () => [
      { header: "SL", cell: ({ row }) => (page - 1) * limit + row.index + 1 },
      { accessorKey: "userId.name", header: "Name" },
      { accessorKey: "userId.email", header: "Email" },
      { accessorKey: "specialty", header: "Specialty" },
      { accessorKey: "experience", header: "Experience" },
      {
        accessorKey: "isApproved",
        header: "Approval",
        cell: ({ row }) => {
          const doctor = row.original;
          return (
            <Select
              value={doctor.isApproved ? "true" : "false"}
              onValueChange={(val) =>
                approvalMutation.mutate({
                  id: doctor._id,
                  isApproved: val === "true",
                })
              }
            >
              <SelectTrigger className="w-36 mx-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">
                  <span className="bg-green-600 text-white px-3 py-1 rounded">
                    Confirmed
                  </span>
                </SelectItem>
                <SelectItem value="false">
                  <span className="bg-amber-600 text-white px-3 py-1 rounded">
                    Pending
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const doctor = row.original;
          return (
            <div className="flex gap-2 justify-center items-center">
              <Button
                size="sm"
                onClick={() => setViewDoctor(doctor)}
                className="bg-blue-600"
              >
                View
              </Button>
              <Button
                size="sm"
                className="bg-red-600"
                onClick={() => setDeleteDoctorId(doctor._id)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [page, limit],
  );

  // Table
  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: (updater: Updater<SortingState>) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      if (!newSorting.length) return;
      const { id, desc } = newSorting[0];
      handleFilterChange("sortBy", id);
      handleFilterChange("sortOrder", desc ? "desc" : "asc");
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-16">
      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap ">
        <Input
          placeholder="Search by email"
          className="border border-indigo-600"
          defaultValue={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleSearch(e.target.value)
          }
        />

        <div className="flex gap-2 flex-wrap items-center bg-indigo-600 px-4 rounded-md">
          {specialtiesList.map((sp) => (
            <label key={sp} className="flex items-center gap-1 text-white">
              <input
                type="checkbox"
                checked={selectedSpecialties.includes(sp)}
                onChange={() => toggleSpecialty(sp)}
                className="checked:accent-green-300"
              />
              <span className="capitalize">{sp}</span>
            </label>
          ))}
        </div>

        <Select
          value={isApproved || "all"}
          onValueChange={(val) => handleFilterChange("isApproved", val)}
        >
          <SelectTrigger className="w-37.5 border border-indigo-600">
            <SelectValue placeholder="Filter by approval" />
          </SelectTrigger>
          <SelectContent className="border border-indigo-600">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Confirmed</SelectItem>
            <SelectItem value="false">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(limit)}
          onValueChange={(val) => handleFilterChange("limit", val)}
        >
          <SelectTrigger className="w-20 border border-indigo-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border border-indigo-600">
            {[5, 10, 20, 50].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isPending ? (
        <Loader />
      ) : (
        <table className="w-full">
          <thead className="bg-indigo-600 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 border cursor-pointer select-none text-white border-indigo-600"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
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
      )}

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <Button
          disabled={page <= 1}
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => {
            // Update page immediately without debounce
            set({ page: String(page - 1) });
          }}
        >
          Previous
        </Button>
        <Button
          disabled={page >= (data?.meta.totalPages ?? 1)}
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => {
            // Update page immediately without debounce
            set({ page: String(page + 1) });
          }}
        >
          Next
        </Button>
      </div>

      {/* View Doctor Modal */}
      <Dialog open={!!viewDoctor} onOpenChange={() => setViewDoctor(null)}>
        <DialogContent>
          <DialogTitle>Doctor Details</DialogTitle>
          <pre>{JSON.stringify(viewDoctor, null, 2)}</pre>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteDoctorId}
        onOpenChange={() => setDeleteDoctorId(null)}
      >
        <DialogContent>
          <DialogTitle>Confirm Delete?</DialogTitle>
          <div className="flex gap-2 mt-4">
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteDoctorId) deleteMutation.mutate(deleteDoctorId);
                setDeleteDoctorId(null);
              }}
            >
              Delete
            </Button>
            <Button onClick={() => setDeleteDoctorId(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboardTable;
