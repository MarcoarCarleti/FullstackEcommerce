import { fetchStripeKeys } from "@/api/stripe";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";

export default function CustomStripeProvider({ children }: { children: any }) {
  const { data: stripeKeys } = useQuery({
    queryKey: ["stripe", "keys"],
    queryFn: fetchStripeKeys,
  });

  return (
    <StripeProvider publishableKey={stripeKeys?.publishableKey}>
      {children}
    </StripeProvider>
  );
}
