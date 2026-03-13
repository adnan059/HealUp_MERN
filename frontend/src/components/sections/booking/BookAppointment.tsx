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
import { api } from "@/lib/crud-utils";
import { formatDate, formatTime, handleAxiosError } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import type {
  ICreateAppointmentData,
  IDoctorDetailsWithSchedule,
  SlotType,
} from "@/types";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BookAppointment = ({
  doctorDetails,
}: {
  doctorDetails: IDoctorDetailsWithSchedule;
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: workingDays, isPending: isPending_workingDays } =
    useGetNextWorkingDays(doctorDetails.doctorId);

  const { data: slots, isPending: isPending_slot } = useGetAvailableSlots(
    doctorDetails.doctorId,
    selectedDate,
  );

  const { mutate, isPending: isPending_createAppointment } =
    useCreateNewAppointment();

  const handleBookAppointment = () => {
    if (!user) {
      toast.error("You need to login first");
      return navigate("/login");
    }
    if (!doctorDetails || !selectedSlot || !selectedDate) {
      return;
    }
    const createAppointmentData: ICreateAppointmentData = {
      doctorId: doctorDetails.doctorId,
      patientId: user._id,
      date: selectedDate,
      startMinute: selectedSlot.startMinute,
      endMinute: selectedSlot.endMinute,
      symptoms,
      paymentAmount: doctorDetails.fees,
    };

    setProcessing(true);
    mutate(createAppointmentData, {
      onSuccess: async (data) => {
        setSymptoms("");
        setSelectedDate("");
        setSelectedSlot(null);
        try {
          const payment = await api.post("/appointments/start-payment", {
            appointmentId: data._id,
          });
          window.location.href = payment.data.checkout_url;
        } catch (error) {
          handleAxiosError(error);
          setProcessing(false);
        }
      },
      onError: (error) => {
        handleAxiosError(error);
        setProcessing(false);
      },
    });
  };

  if (isPending_workingDays) {
    return <Loader />;
  }

  return (
    <div className="bookAppointment">
      <h2>Book Appointment</h2>

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
            <Label>Select a slot</Label>
            {isPending_slot && <p>Loading Slots ...</p>}
            <div className="timeSlotContainer">
              {slots?.map((slot) => (
                <button
                  key={slot.startMinute}
                  onClick={() => setSelectedSlot(slot)}
                  className={`slotButton ${
                    selectedSlot?.startMinute === slot.startMinute
                      ? "bg-indigo-600 text-white"
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
          disabled={isPending_createAppointment || processing}
          onClick={handleBookAppointment}
          className="submitButton"
        >
          {processing || isPending_createAppointment
            ? "Booking Appointment ..."
            : `Book Appointment & Make Payment`}
        </Button>
      </div>
    </div>
  );
};

export default BookAppointment;
