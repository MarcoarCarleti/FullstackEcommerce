import { useAuth } from "@/store/authStore";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchStripeKeys() {
  const res = await fetch(`${API_URL}/stripe/keys`);

  if (!res.ok) {
    throw new Error("Error");
  }

  const data = await res.json();

  return data;
}

export async function createPaymentintent({ orderId }: { orderId: number }) {
  const token = (useAuth.getState() as any).token;

  const res = await fetch(`${API_URL}/stripe/payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({ orderId }),
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    throw new Error("Error creating payment intent");
  }

  return data;
}
