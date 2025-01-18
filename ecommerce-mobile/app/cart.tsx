import { createOrder } from "@/api/orders";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCart } from "@/store/cart-store";
import { formatCurrency } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { View, FlatList } from "react-native";

const CartScreen = () => {
  const items = useCart((state) => state.items);
  const resetCart = useCart((state) => state.resetCart);

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

  async function onCheckout() {
    createOrderMutation.mutate();
  }

  if (items.length <= 0) {
    return <Redirect href={"/"} />;
  }

  return (
    <FlatList
      data={items}
      contentContainerClassName="gap-2 max-w-[960px] w-full mx-auto p-2"
      renderItem={({ item }) => (
        <Box>
          <HStack className="bg-white p-3">
            <VStack space="sm">
              <Text bold>{item.product.name}</Text>
              <Text>{formatCurrency(item.product.price)}</Text>
            </VStack>
            <Text className="ml-auto">{item.quantity}</Text>
          </HStack>
        </Box>
      )}
      ListFooterComponent={() => (
        <Button onPress={onCheckout}>
          <ButtonText>Checkout</ButtonText>
        </Button>
      )}
    />
  );
};

export default CartScreen;
