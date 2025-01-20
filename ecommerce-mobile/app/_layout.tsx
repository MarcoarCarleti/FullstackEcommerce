import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Link, Stack } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Icon } from "@/components/ui/icon";
import { LogOut, ShoppingCart, User } from "lucide-react-native";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useCart } from "@/store/cart-store";
import { useAuth } from "@/store/authStore";
import { fetchStripeKeys } from "@/api/stripe";
import CustomStripeProvider from "@/components/custom-stripe-provider";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const RootLayout = () => {
  const cartItemsNum = useCart((state) => state.items.length);
  const isLoggedIn = useAuth((s) => !!s.token);
  const setUser = useAuth((s) => s.setUser);
  const setToken = useAuth((s) => s.setToken);

  const handleLogOut = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CustomStripeProvider>
        {" "}
        <GluestackUIProvider>
          <Stack
            screenOptions={{
              headerRight: () =>
                cartItemsNum > 0 && (
                  <Link href={"/cart"} asChild>
                    <Pressable className="flex-row gap-2">
                      <Icon as={ShoppingCart} />
                      <Text>{cartItemsNum}</Text>
                    </Pressable>
                  </Link>
                ),
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: "Produtos",
                headerLeft: () =>
                  !isLoggedIn ? (
                    <Link href={"/login"} asChild>
                      <Pressable className="flex-row gap-2">
                        <Icon as={User} />
                      </Pressable>
                    </Link>
                  ) : (
                    <Button variant="link" onPress={handleLogOut}>
                      <Icon as={LogOut} />
                    </Button>
                  ),
              }}
            />
            <Stack.Screen
              name="product/[id]"
              options={{
                title: "Produto",
              }}
            />
            <Stack.Screen
              name="cart"
              options={{
                title: "Carrinho",
              }}
            />
            <Stack.Screen
              name="(auth)/login"
              options={{
                title: "Login",
              }}
            />
            <Stack.Screen
              name="(auth)/signup"
              options={{
                title: "Cadastro",
              }}
            />
          </Stack>
        </GluestackUIProvider>
      </CustomStripeProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
