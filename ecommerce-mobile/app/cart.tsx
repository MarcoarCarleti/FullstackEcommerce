import { createOrder } from "@/api/orders";
import { createPaymentintent } from "@/api/stripe";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
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
import { MinusIcon, PlusIcon, XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View, FlatList, Pressable } from "react-native";

const CartScreen = () => {
  const items = useCart((state) => state.items);
  const resetCart = useCart((state) => state.resetCart);
  const removeProduct = useCart((state) => state.removeProduct);
  const addProduct = useCart((state) => state.addProduct);

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

  const paymentIntentMutation = useMutation({
    mutationFn: createPaymentintent,
    async onSuccess(data, variables, context) {
      console.log(data);
      const { customer, ephemeralKey, paymentIntent } = data;

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Marco Ecommerce",
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

      openPaymentSheet();
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });

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
      paymentIntentMutation.mutate({ orderId: data.id });
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
    resetCart();
    router.push(`/orders`);
  };

  const handleRemoveProductClick = (productId: number) => {
    removeProduct(productId);
  };

  const handleAddProductClick = (product: any) => {
    addProduct(product);
  };

  async function onCheckout() {
    if (!isLoggedIn) {
      return router.replace("/login");
    }

    try {
      setIsLoading(true);
      createOrderMutation.mutate();
    } finally {
      setIsLoading(false);
    }
  }

  if (items.length <= 0) {
    return <Redirect href={"/"} />;
  }

  return (
    <View className="flex-1">
      {/* Lista de Itens */}
      <FlatList
        data={items}
        contentContainerStyle={{ paddingBottom: 100 }}
        contentContainerClassName="gap-2 max-w-[960px] w-full  mx-auto p-2" // Adiciona espaço no final para o botão
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
                <Text
                  bold
                  style={{
                    overflow: "hidden",
                    maxWidth: "80%", 
                  }}
                >
                  {item.product.name}
                </Text>
                <Text>{formatCurrency(item.product.price)}</Text>
              </VStack>

              <VStack space="lg" className="ml-auto items-center">
                <Text>{item.quantity}</Text>
                <HStack space="md">
                  {item.quantity > 1 ? (
                    <Pressable
                      onPress={() => handleRemoveProductClick(item.product.id)}
                    >
                      <Icon as={MinusIcon}></Icon>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => handleRemoveProductClick(item.product.id)}
                    >
                      <Icon as={XIcon} className="text-red-500"></Icon>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => handleAddProductClick(item.product)}
                  >
                    <Icon as={PlusIcon}></Icon>
                  </Pressable>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        )}
      />
      {/* Checkout fixo */}
      <Box className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-md pb-8">
        <HStack className="justify-between mb-2">
          <Text bold className="text-lg">
            Total
          </Text>
          <Text bold className=" text-lg">
            {formatCurrency(
              items.reduce(
                (total, item) => total + item.product.price * item.quantity,
                0
              )
            )}
          </Text>
        </HStack>
        <Button onPress={onCheckout} disabled={isLoading}>
          {isLoading && <ButtonSpinner />}
          <ButtonText>Checkout</ButtonText>
        </Button>
      </Box>
    </View>
  );
};

export default CartScreen;
