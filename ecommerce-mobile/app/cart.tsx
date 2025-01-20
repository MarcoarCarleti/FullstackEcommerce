import { createOrder } from "@/api/orders";
import { createPaymentintent } from "@/api/stripe";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/store/authStore";
import { useCart } from "@/store/cart-store";
import { formatCurrency } from "@/utils";
import { useStripe } from "@stripe/stripe-react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";

const CartScreen = () => {
  const items = useCart((state) => state.items);
  const resetCart = useCart((state) => state.resetCart);
  const isLoggedIn = useAuth((s) => !!s.token);
  const user = useAuth((s) => s.user);
  const router = useRouter();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const toast = useToast();
  const [toastId, setToastId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const showNewToast = ({
    action,
    title,
    description,
  }: {
    action?: "muted" | "success" | "error" | "warning" | "info";
    title: string;
    description: string;
  }) => {
    const newId = Math.random();
    setToastId(newId);
    toast.show({
      id: String(newId),
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action={action} variant="solid">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const { mutate: paymentIntentMutation } = useMutation({
    mutationFn: createPaymentintent,
    async onSuccess(data, variables, context) {
      console.log(data);
      const { customer, ephemeralKey, paymentIntent } = data;

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        defaultBillingDetails: {
          name: user.name,
          email: user.email,
        },
      });

      if (error) {
        showNewToast({
          title: "Erro",
          description: error.message,
          action: "error",
        });
        console.log(error);
      }
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });

  useEffect(() => {
    console.log("object");
    paymentIntentMutation();
  }, []);

  const createOrderMutation = useMutation({
    mutationFn: () =>
      createOrder(
        items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        }))
      ),
    onSuccess(data, variables, context) {
      console.log(data);
      resetCart();
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      showNewToast({
        title: "Erro",
        description: error.message,
        action: "error",
      });
      console.log(error);
      return;
    }

    showNewToast({
      title: "Sucesso",
      description: "Seu pedido foi confirmado!",
      action: "success",
    });
  };

  async function onCheckout() {
    if (!isLoggedIn) {
      return router.replace("/login");
    }

    try {
      setIsLoading(true);

      openPaymentSheet();

      // createOrderMutation.mutate();
    } finally {
      setIsLoading(false);
    }
  }

  if (items.length <= 0) {
    return <Redirect href={"/"} />;
  }

  return (
    <FlatList
      data={items}
      contentContainerClassName="gap-2 max-w-[960px] w-full h-full mx-auto p-2"
      renderItem={({ item }) => (
        <Box>
          <HStack className="bg-white p-3">
            <Image
              source={{
                uri: item.product.image,
              }}
              className="mr-6 rounded-md"
              alt={`${item.product.name} image`}
              resizeMode="contain"
            />
            <VStack space="sm">
              <Text bold>{item.product.name}</Text>
              <Text>{formatCurrency(item.product.price)}</Text>
            </VStack>
            <Text className="ml-auto">{item.quantity}</Text>
          </HStack>
        </Box>
      )}
      ListFooterComponent={() => (
        <Box className="mt-auto">
          <Text bold>
            {formatCurrency(
              items.reduce((total, item) => total + item.product.price, 0)
            )}
          </Text>
          <Button onPress={onCheckout} disabled={isLoading}>
            {isLoading && <ButtonSpinner />}
            <ButtonText>Checkout</ButtonText>
          </Button>
        </Box>
      )}
    />
  );
};

export default CartScreen;
