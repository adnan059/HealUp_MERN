import { Request } from "express";

let token: string | null = null;
let cachedStoreId: string | null = null;

/**
 * Get ShurjoPay token and store_id.
 * Caches the token and store_id to avoid repeated requests.
 */
export const getToken = async (): Promise<{
  token: string;
  store_id: string;
}> => {
  if (token && cachedStoreId) return { token, store_id: cachedStoreId };

  const response = await fetch(`${process.env.SP_ENDPOINT}/api/get_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: process.env.SP_USERNAME,
      password: process.env.SP_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get token from ShurjoPay");
  }

  const data = await response.json();

  if (!data.token || !data.store_id) {
    throw new Error("Invalid token response from ShurjoPay");
  }

  token = data.token;
  cachedStoreId = data.store_id.toString() as string;

  return { token: data.token, store_id: cachedStoreId };
};

/**
 * Create a new payment for an appointment.
 * Returns the ShurjoPay checkout_url for redirect.
 */
export const createPayment = async (
  appointmentId: string,
  amount: number,
  user: any,
  req: Request,
) => {
  const { token, store_id } = await getToken();

  // Required fields for ShurjoPay sandbox/production
  const payload = {
    prefix: process.env.SP_PREFIX,
    token, // token from getToken
    store_id, // store_id from getToken
    amount,
    order_id: appointmentId,
    currency: "BDT",
    client_ip: req.ip || "127.0.0.1", // sandbox safe default
    return_url: `${process.env.BACKEND_URL}/appointments/payment-callback`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    customer_name: user.name || "N/A",
    customer_email: user.email || "test@example.com",
    customer_phone: user.phone || "01700000000",
    customer_address: user.address || "N/A",
    customer_city: user.city || "Dhaka",
    customer_post_code: user.postCode || "1212",
  };

  // ShurjoPay expects form-urlencoded or multipart/form-data
  const formBody = new URLSearchParams(payload as any);

  const res = await fetch(`${process.env.SP_ENDPOINT}/api/secret-pay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("ShurjoPay createPayment error:", text);
    throw new Error("Payment creation failed at ShurjoPay");
  }

  const data = await res.json();

  if (!data.checkout_url) {
    console.error("ShurjoPay response missing checkout_url:", data);
    throw new Error("Invalid response from ShurjoPay");
  }

  // Return full payment info including checkout_url
  return data;
};

/**
 * Verify payment after callback from ShurjoPay.
 * Returns the verification info array.
 */
export const verifyPayment = async (order_id: string) => {
  const { token } = await getToken();

  const res = await fetch(`${process.env.SP_ENDPOINT}/api/verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ order_id }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("ShurjoPay verifyPayment error:", text);
    throw new Error("ShurjoPay verification failed");
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("ShurjoPay verification returned invalid data:", data);
    throw new Error("Invalid verification response from ShurjoPay");
  }

  return data; // array of payment info objects
};
