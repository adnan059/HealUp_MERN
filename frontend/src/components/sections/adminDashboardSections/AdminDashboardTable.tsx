/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState,
  useMemo,
  type ChangeEvent,
  useCallback,
  useEffect,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
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
  AdminDashboardFilters,
  IDoctorDetailsWithSchedule,
} from "@/types";
import Loader from "@/components/shared/Loader";

import DoctorDetailsDialogContent from "./DoctorDetailsDialogContent";

const SORTABLE_COLUMNS = new Set([
  "name",
  "email",
  "specialty",
  "experience",
  "isApproved",
  "createdAt",
]);

const AdminDashboardTable = () => {
  const { get, set } = useTableUrlState();

  const page = Number(get("page", 1));
  const limit = Number(get("limit", 10));
  const sortBy = get("sortBy", "createdAt");
  const sortOrder = get("sortOrder", "asc") as "asc" | "desc";
  const selectedSpecialties = (get("specialty", "")?.split(",") || []).filter(
    Boolean,
  );
  const isApproved = get("isApproved", "all");
  const search = get("search", "");

  const [viewDoctor, setViewDoctor] =
    useState<IDoctorDetailsWithSchedule | null>(null);
  const [deleteDoctorId, setDeleteDoctorId] = useState<string | null>(null);

  const handleColumnSort = useCallback(
    (columnId: string) => {
      if (!SORTABLE_COLUMNS.has(columnId)) return;
      if (columnId === sortBy) {
        set({
          sortOrder: sortOrder === "asc" ? "desc" : "asc",
          page: "1",
        });
      } else {
        set({
          sortBy: columnId,
          sortOrder: "asc",
          page: "1",
        });
      }
    },
    [sortBy, sortOrder, set],
  );

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

  useEffect(() => {
    return () => updateUrlStateDebounced.cancel();
  }, [updateUrlStateDebounced]);

  const handleFilterChange = useCallback(
    (
      key: keyof AdminDashboardFilters,
      value: AdminDashboardFilters[keyof AdminDashboardFilters],
    ) => {
      if (key === "specialty" && Array.isArray(value)) {
        updateUrlStateDebounced({ specialty: value.join(","), page: "1" });
      } else {
        updateUrlStateDebounced({ [key]: String(value), page: "1" });
      }
    },
    [updateUrlStateDebounced],
  );

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

  const approvalMutation = useUpdateDoctorApproval();
  const deleteMutation = useDeleteDoctor();

  const handleSearch = useMemo(
    () =>
      debounce((val: string) => {
        handleFilterChange("search", val);
      }, 500),
    [handleFilterChange],
  );

  useEffect(() => {
    return () => handleSearch.cancel();
  }, [handleSearch]);

  const toggleSpecialty = (sp: string) => {
    let newSpecialties = [...selectedSpecialties];
    if (newSpecialties.includes(sp)) {
      newSpecialties = newSpecialties.filter((s) => s !== sp);
    } else {
      newSpecialties.push(sp);
    }
    handleFilterChange("specialty", newSpecialties);
  };

  const columns = useMemo<ColumnDef<IDoctorDetailsWithSchedule>[]>(
    () => [
      {
        id: "sl",
        header: "SL",
        cell: ({ row }) => (page - 1) * limit + row.index + 1,
      },
      {
        id: "name",
        header: "Name",
        accessorFn: (row) => row.userId.name,
      },
      {
        id: "email",
        header: "Email",
        accessorFn: (row) => row.userId.email,
      },
      { id: "specialty", accessorKey: "specialty", header: "Specialty" },
      { id: "experience", accessorKey: "experience", header: "Experience" },
      {
        id: "isApproved",
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

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="adminDashboardTableContainer">
      {/* Filters */}
      <div className="adminDashboardTableUpperPart">
        <Input
          placeholder="Search by email"
          className="searchBox"
          defaultValue={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleSearch(e.target.value)
          }
        />

        <div className="selectSpecialty">
          {specialtiesList.map((sp) => (
            <label key={sp}>
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
          <SelectTrigger className="selectStatusTrigger">
            <SelectValue placeholder="Filter by approval" />
          </SelectTrigger>
          <SelectContent className="selectStatusList">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Confirmed</SelectItem>
            <SelectItem value="false">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(limit)}
          onValueChange={(val) => handleFilterChange("limit", val)}
        >
          <SelectTrigger className="selectLimitTrigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="selectLimitList">
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
        <table className="adminDashboardTable">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const columnId = header.column.id;
                  const isSortable = SORTABLE_COLUMNS.has(columnId);
                  const isActive = sortBy === columnId;

                  return (
                    <th
                      key={header.id}
                      onClick={() => handleColumnSort(columnId)}
                      className={`${
                        isSortable ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {/* FIX: sort arrow is derived from URL state, not TanStack state */}
                      {isActive ? (sortOrder === "asc" ? " 🔼" : " 🔽") : null}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="paginationButtonContainer">
        <Button
          disabled={page <= 1}
          className="paginationButton"
          onClick={() => set({ page: String(page - 1) })}
        >
          Previous
        </Button>
        <Button
          disabled={page >= (data?.meta.totalPages ?? 1)}
          className="paginationButton"
          onClick={() => set({ page: String(page + 1) })}
        >
          Next
        </Button>
      </div>

      {/* View Doctor Modal */}
      <Dialog open={!!viewDoctor} onOpenChange={() => setViewDoctor(null)}>
        <DialogContent>
          <DialogTitle className="text-indigo-600">Doctor Details</DialogTitle>

          <DoctorDetailsDialogContent viewDoctor={viewDoctor} />
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
