const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const listProducts = async () => {
  const res = await fetch(`${API_URL}/products`);

  if (!res.ok) {
    throw new Error("Error");
  }

  const data = await res.json();

  return data;
};

export async function fetchProductById(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`);

  if (!res.ok) {
    throw new Error("Error");
  }

  const data = await res.json();

  return data;
}
