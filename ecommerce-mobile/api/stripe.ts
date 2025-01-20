const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchStripeKeys() {
  const res = await fetch(`${API_URL}/stripe/keys`);

  if (!res.ok) {
    throw new Error("Error");
  }

  const data = await res.json();

  return data;
}
