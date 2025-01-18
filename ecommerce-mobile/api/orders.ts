import { useAuth } from "@/store/authStore";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createOrder(items: any[]) {
  const token = useAuth.getState().token;
  const userId = useAuth.getState().user.id;

  console.log(token);

  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify({ order: {}, items, userId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return data;
}
