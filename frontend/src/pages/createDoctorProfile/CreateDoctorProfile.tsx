import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCreateDoctorMutation } from "@/hooks/useDoctors";
import { specialties, workingDaysList } from "@/lib";
import { handleAxiosError } from "@/lib/utils";
import type { ICreateDoctorData } from "@/types";

import { Info } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateDoctorProfile = () => {
  const { mutate, isPending } = useCreateDoctorMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<ICreateDoctorData>({
    mode: "onTouched",
    defaultValues: {
      workingDays: [],
      slotDuration: 20,
    },
  });

  const selectedDays =
    useWatch({
      control,
      name: "workingDays",
    }) || [];

  const toggleDay = (day: number) => {
    const current = getValues("workingDays") || [];

    let updated: number[];

    if (current.includes(day)) {
      updated = current.filter((d) => d !== day);
    } else {
      updated = [...current, day];
    }

    setValue("workingDays", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const validateWorkingDays = (days: number[]) => {
    if (!Array.isArray(days)) return "Invalid selection";

    if (days.length < 2 || days.length > 6) {
      return "Working days must be between 2 and 6";
    }

    const unique = new Set(days);
    if (unique.size !== days.length) {
      return "Duplicate days are not allowed";
    }

    const validRange = days.every(
      (d) => Number.isInteger(d) && d >= 0 && d <= 6,
    );

    if (!validRange) {
      return "Invalid day value";
    }

    return true;
  };

  const onSubmit = (data: ICreateDoctorData) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/");
        toast.success("Doctor profile is created and waiting for approval");
      },
      onError: (error) => {
        handleAxiosError(error);
      },
    });
  };

  return (
    <section className="createDoctorProfile">
      <div className="sectionContainer">
        <h2>Create Doctor Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="createDoctorForm">
          {/* Specialty */}
          <div>
            <Label>Specialty</Label>
            <select
              {...register("specialty", { required: "Specialty is required" })}
              className="w-full border rounded-md p-2 mt-1"
            >
              <option value="">Select Specialty</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.specialty && (
              <p className="text-red-500 text-sm">{errors.specialty.message}</p>
            )}
          </div>

          {/* Degree */}
          <div>
            <Label>Degree</Label>
            <Input
              {...register("degree", {
                required: "Degree is required",
                minLength: {
                  value: 4,
                  message: "Degree must be at least 4 characters",
                },
              })}
            />
            {errors.degree && (
              <p className="text-red-500 text-sm">{errors.degree.message}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <Label>Experience (years)</Label>
            <Input
              type="number"
              {...register("experience", {
                required: "Experience is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Cannot be negative",
                },
              })}
            />
            {errors.experience && (
              <p className="text-red-500 text-sm">
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Fees */}
          <div>
            <Label>Consultation Fees</Label>
            <Input
              type="number"
              {...register("fees", {
                required: "Fees is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Invalid fee",
                },
              })}
            />
            {errors.fees && (
              <p className="text-red-500 text-sm">{errors.fees.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <Label>Your Address</Label>
            <Input {...register("address")} />
          </div>

          {/* About */}
          <div>
            <Label>About</Label>
            <Textarea
              {...register("about", {
                required: "About is required",
                minLength: {
                  value: 20,
                  message: "Minimum 20 characters",
                },
              })}
            />
            {errors.about && (
              <p className="text-red-500 text-sm">{errors.about.message}</p>
            )}
          </div>

          {/* Working Days */}
          <div>
            <div className="flex items-center gap-2">
              <Label>Working Days</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    size={10}
                    className="text-muted-foreground cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select the days you are available to work.</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
              {workingDaysList.map((day) => (
                <button
                  type="button"
                  key={day.value}
                  onClick={() => toggleDay(day.value)}
                  className={`px-3 py-1 rounded border transition ${
                    selectedDays.includes(day.value)
                      ? "bg-indigo-600 text-white"
                      : ""
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>

            <input
              type="hidden"
              {...register("workingDays", {
                validate: validateWorkingDays,
              })}
            />

            {errors.workingDays && (
              <p className="text-red-500 text-sm">
                {errors.workingDays.message as string}
              </p>
            )}
          </div>

          {/* Slot Duration */}
          <div>
            <div className="flex items-center gap-2">
              <Label>Slot Duration</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    size={10}
                    className="text-muted-foreground cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Time for each patient</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <select
              {...register("slotDuration", {
                required: "Slot duration is required",
                valueAsNumber: true,
                validate: (v) =>
                  [20, 30].includes(v) || "Slot duration must be 20 or 30",
              })}
              className="w-full border rounded-md p-2 mt-1"
            >
              <option value={20}>20 Minutes</option>
              <option value={30}>30 Minutes</option>
            </select>
            {errors.slotDuration && (
              <p className="text-red-500 text-sm">
                {errors.slotDuration.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating..." : "Create Doctor Profile"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default CreateDoctorProfile;
