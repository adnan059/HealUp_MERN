import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/crud-utils";
import { useAuth } from "@/provider/auth-context";
import type { IPaymentStatusResponse } from "@/types";

export const usePaymentStatus = (
  expectedPaymentStatus: IPaymentStatusResponse["paymentStatus"],
) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();

  const txn_id = searchParams.get("txn_id");

  useEffect(() => {
    if (!isAuthLoading && (!txn_id || !user)) {
      navigate("/", { replace: true });
    }
  }, [txn_id, user, isAuthLoading, navigate]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payment-status", txn_id],
    queryFn: () =>
      fetchData<IPaymentStatusResponse>(
        `/appointments/payment-status?txn_id=${txn_id}`,
      ),

    enabled: !!txn_id && !!user && !isAuthLoading,
    retry: false,
  });

  useEffect(() => {
    if ((data && data.paymentStatus !== expectedPaymentStatus) || isError) {
      navigate("/", { replace: true });
    }
  }, [data, isError, expectedPaymentStatus, navigate]);

  return { isLoading, data };
};
