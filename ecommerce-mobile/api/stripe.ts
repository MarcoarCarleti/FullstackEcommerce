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

export async function createPaymentintent() {
  const token = useAuth.getState().token;

  const res = await fetch(`${API_URL}/stripe/payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    throw new Error("Error creating payment intent");
  }

  return data;
}
