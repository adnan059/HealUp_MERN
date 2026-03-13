import { useUpdateAvatar } from "@/hooks/useAuth";
import { useAuth } from "@/provider/auth-context";
import type { AvatarUploaderProps } from "@/types";
import { Camera, Loader2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/previews/015/412/022/non_2x/doctor-round-avatar-medicine-flat-avatar-with-male-doctor-medical-clinic-team-round-icon-medical-collection-illustration-vector.jpg";

const AvatarUploader = ({ currentAvatar, userName }: AvatarUploaderProps) => {
  const { refetchUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate: updateAvatar, isPending } = useUpdateAvatar();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2 MB");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    if (!selectedFile) return;
    updateAvatar(selectedFile, {
      onSuccess: async () => {
        await refetchUser();
        toast.success("Avatar updated successfully");
        setPreviewUrl(null);
        setSelectedFile(null);
      },
      onError: () => {
        toast.error("Failed to update avatar. Please try again.");
      },
    });
  };

  const displayedAvatar = previewUrl || currentAvatar || DEFAULT_AVATAR;

  return (
    <div className="mb-6 rounded-full flex flex-col w-60 h-60 items-center gap-3">
      <div className="relative rounded-full w-full h-full ">
        <img
          src={displayedAvatar}
          alt={userName}
          className="w-full h-full rounded-full object-cover border-2 border-gray-200"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors"
          title="Change avatar"
        >
          <Camera size={14} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {previewUrl && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-indigo-500 disabled:opacity-60 transition-colors"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="text-sm px-4 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-60 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarUploader;
