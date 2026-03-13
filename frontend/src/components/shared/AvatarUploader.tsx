import { useUpdateAvatar } from "@/hooks/useAuth";
import { useAuth } from "@/provider/auth-context";
import type { AvatarUploaderProps } from "@/types";
import { Camera, Loader2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import DEFAULT_AVATAR from "@/assets/images/user.png";

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
    <div className="avatarUploaderContainer">
      <div className="displayedAvatar">
        <img src={displayedAvatar} alt={userName} />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
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
            className="imagePreview"
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
          <button type="button" onClick={handleCancel} disabled={isPending}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarUploader;
