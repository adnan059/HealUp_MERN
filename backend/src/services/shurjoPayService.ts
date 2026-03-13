import { Request } from "express";

interface TokenCache {
  token: string;
  store_id: string;
  expiresAt: number;
}

const TOKEN_TTL_MS = 55 * 60 * 1000;

let tokenCache: TokenCache | null = null;

const isCacheValid = (): boolean => {
  return !!tokenCache && Date.now() < tokenCache.expiresAt;
};

export const getToken = async (): Promise<{
  token: string;
  store_id: string;
}> => {
  if (isCacheValid() && tokenCache) {
    return { token: tokenCache.token, store_id: tokenCache.store_id };
  }

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
    throw new Error(
      `ShurjoPay token request failed with status: ${response.status}`,
    );
  }

  const data = await response.json();

  if (!data.token || !data.store_id) {
    throw new Error(
      "Invalid token response from ShurjoPay: missing token or store_id",
    );
  }

  // Cache the new token with expiry
  tokenCache = {
    token: data.token,
    store_id: data.store_id.toString(),
    expiresAt: Date.now() + TOKEN_TTL_MS,
  };

  return { token: tokenCache.token, store_id: tokenCache.store_id };
};

export const invalidateTokenCache = (): void => {
  tokenCache = null;
};

export const createPayment = async (
  appointmentId: string,
  amount: number,
  user: any,
  req: Request,
) => {
  const { token, store_id } = await getToken();

  const payload = {
    prefix: process.env.SP_PREFIX,
    token,
    store_id,
    amount,
    order_id: appointmentId,
    currency: "BDT",

    client_ip: req.ip || "127.0.0.1",
    return_url: `${process.env.BACKEND_URL}/appointments/payment-callback`,

    cancel_url: `${process.env.FRONTEND_URL}/payment/payment-cancelled`,
    customer_name: user.name || "N/A",
    customer_email: user.email || "test@example.com",
    customer_phone: user.phone || "01700000000",
    customer_address: user.address || "N/A",
    customer_city: user.city || "Dhaka",
    customer_post_code: user.postCode || "1212",
  };

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
    console.error("ShurjoPay createPayment error response:", text);
    throw new Error(
      `Payment creation failed at ShurjoPay with status: ${res.status}`,
    );
  }

  const data = await res.json();

  if (!data.checkout_url) {
    console.error("ShurjoPay response missing checkout_url:", data);
    throw new Error("Invalid response from ShurjoPay: checkout_url not found");
  }

  return data;
};

export const verifyPayment = async (order_id: string) => {
  if (!order_id) {
    throw new Error("order_id is required for payment verification");
  }

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
    console.error("ShurjoPay verifyPayment error response:", text);
    throw new Error(`ShurjoPay verification failed with status: ${res.status}`);
  }

  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    console.error("ShurjoPay verification returned invalid data:", data);
    throw new Error(
      "Invalid verification response from ShurjoPay: expected a non-empty array",
    );
  }

  return data;
};
