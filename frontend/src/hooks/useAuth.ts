import { postData } from "@/lib/crud-utils";
import type { LoginFormValuesType } from "@/pages/auth/Login";
import type { RegisterFormValuesType } from "@/pages/auth/Register";
import { useMutation } from "@tanstack/react-query";

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterFormValuesType) =>
      postData("/auth/register", data),
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginFormValuesType) =>
      postData("/auth/login", data),
  });
};
