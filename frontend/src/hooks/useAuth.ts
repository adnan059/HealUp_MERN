import { postData, updateData } from "@/lib/crud-utils";
import { uploadToCloudinary } from "@/lib/utils";

import type { LoginFormValuesType, RegisterFormValuesType } from "@/types";

import { useMutation } from "@tanstack/react-query";

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterFormValuesType) =>
      postData<void, RegisterFormValuesType>("/auth/register", data),
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginFormValuesType) =>
      postData<void, LoginFormValuesType>("/auth/login", data),
  });
};

export const useUpdateAvatar = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const avatarUrl = await uploadToCloudinary(file);
      await updateData<void, { avatar: string }>("/auth/update-avatar", {
        avatar: avatarUrl,
      });
    },
  });
};
