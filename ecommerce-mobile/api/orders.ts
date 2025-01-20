import { useAuth } from "@/store/authStore";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createOrder(items: any[]) {
  const token = (useAuth.getState() as any).token;
  const userId = (useAuth.getState() as any).user.id;

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

export async function getOrders() {
  const token = (useAuth.getState() as any).token;

  const res = await fetch(`${API_URL}/orders`, {
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return data;
}

export async function getOrderById(orderId: string) {
  const token = (useAuth.getState() as any).token;

  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return data;
}
