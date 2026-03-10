import { postData } from "@/lib/crud-utils";

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
