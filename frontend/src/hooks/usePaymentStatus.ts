import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/crud-utils";
import { useAuth } from "@/provider/auth-context";
import type { IPaymentStatusResponse } from "@/types";

/**
 * usePaymentStatus
 *
 * Used by payment result pages (success, failed, expired, cancelled).
 * - Reads `txn_id` from the URL query params
 * - If txn_id is missing or user is not logged in → redirects to "/"
 * - Fetches the real payment status from the backend (owner-only check)
 * - If the returned status doesn't match `expectedPaymentStatus` → redirects to "/"
 *   (prevents users from manually visiting e.g. /payment-success with a failed txn_id)
 * - If the query errors (404, wrong owner, network failure) → redirects to "/"
 *
 * @param expectedPaymentStatus - the paymentStatus value this page represents
 */
export const usePaymentStatus = (
  expectedPaymentStatus: IPaymentStatusResponse["paymentStatus"],
) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();

  const txn_id = searchParams.get("txn_id");

  // Step 1: if no txn_id in URL or user not logged in → kick out immediately
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
    // only run the query when we have both txn_id and a logged in user
    enabled: !!txn_id && !!user && !isAuthLoading,
    retry: false,
  });

  // Step 2: kick out if status mismatch OR if query errored (404, wrong owner etc.)
  // Both cases mean this page should not be visible to this user
  useEffect(() => {
    if ((data && data.paymentStatus !== expectedPaymentStatus) || isError) {
      navigate("/", { replace: true });
    }
  }, [data, isError, expectedPaymentStatus, navigate]);

  return { isLoading, data };
};
