import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useCreateNewAppointment,
  useGetAvailableSlots,
  useGetNextWorkingDays,
} from "@/hooks/useAppointments";
import { formatDate, formatTime, handleAxiosError } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import type {
  ICreateAppointmentData,
  IDoctorDetailsWithSchedule,
} from "@/types";
import { useState } from "react";

type SlotType = { startMinute: number; endMinute: number };

const BookAppointment = ({
  doctorDetails,
}: {
  doctorDetails: IDoctorDetailsWithSchedule;
}) => {
  // console.log(doctorDetails);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const { user } = useAuth();

  const { data: workingDays, isPending: isPending_workingDays } =
    useGetNextWorkingDays(doctorDetails.doctorId) as {
      data: string[];
      isPending: boolean;
    };

  const { data: slots, isPending: isPending_slot } = useGetAvailableSlots(
    doctorDetails.doctorId,
    selectedDate,
  ) as {
    data: SlotType[];
    isPending: boolean;
  };

  const { mutate, isPending: isPending_createAppointment } =
    useCreateNewAppointment();

  const handleBookAppointment = () => {
    if (!doctorDetails || !user || !selectedSlot || !selectedDate) {
      return;
    }
    const createAppointmentData: ICreateAppointmentData = {
      doctorId: doctorDetails.doctorId,
      patientId: user._id,
      date: selectedDate,
      startMinute: selectedSlot.startMinute,
      endMinute: selectedSlot.endMinute,
      symptoms,
    };

    mutate(createAppointmentData, {
      onSuccess: (data) => {
        console.log("Appointment data", data);
        setSymptoms("");
        setSelectedDate("");
        setSelectedSlot(null);
      },
      onError: (error) => {
        handleAxiosError(error);
      },
    });
  };

  console.log("workingDays", workingDays);
  console.log("Slots", slots);
  if (isPending_workingDays) {
    return <Loader />;
  }

  return (
    <div className="bookAppointment">
      <h2 className="">Book Appointment</h2>

      <div className="bookAppointmentContainer">
        {/* Symptoms */}
        <div>
          <Label>Your Symptoms</Label>
          <textarea
            value={symptoms}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setSymptoms(e.target.value)
            }
            placeholder="Mention your AGE, GENDER and describe the symptoms briefly..."
          />
        </div>

        {/* Date Selection */}

        <div>
          <Label>Select a date</Label>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="selectDateTrigger">
              <SelectValue placeholder="Select a Date" />
            </SelectTrigger>
            <SelectContent>
              {workingDays?.map((day) => (
                <SelectItem key={day} value={day}>
                  {formatDate(day)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Slot Selection */}

        {selectedDate && (
          <div className="">
            <Label>Select Slot</Label>
            {isPending_slot && <p>Loading Slots ...</p>}
            <div className="grid grid-cols-3 gap-2">
              {slots?.map((slot) => (
                <button
                  key={slot.startMinute}
                  onClick={() => setSelectedSlot(slot)}
                  className={`border p-2 rounded-lg ${
                    selectedSlot?.startMinute === slot.startMinute
                      ? "bg-indigo-500 text-white"
                      : ""
                  }`}
                >
                  {formatTime(slot.startMinute)}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          disabled={isPending_createAppointment}
          onClick={handleBookAppointment}
        >
          {isPending_createAppointment
            ? "Booking Appointment ..."
            : "Book Appointment"}
        </Button>
      </div>
    </div>
  );
};

export default BookAppointment;
