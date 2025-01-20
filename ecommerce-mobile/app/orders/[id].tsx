import { getOrderById } from "@/api/orders";
import { Box } from "@/components/ui/box";
import { ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { formatCurrency } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Button, FlatList, Pressable } from "react-native";

const OrderScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderById(id),
  });

  const statuses = [
    {
      status: "payed",
      label: "Pago",
    },
    { status: "New", label: "Aguardando pagamento" },
    {
      status: "payment_failed",
      label: "Erro no pagamento",
    },
  ];

  if (isLoading) {
    return <ActivityIndicator />;
  }

  const selectedStatus = statuses.find(({ status }) => status === data?.status);

  const totalPrice = data.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Box className="flex-1 p-3 w-full relative">
      <Stack.Screen
        options={{
          title: `Pedido #${data.id}`,
        }}
      />

      <VStack space="sm" className="flex-1">
        <Text bold className="text-2xl">
          Detalhes do pedido
        </Text>

        <HStack className="justify-between">
          <Text bold>Data do pedido</Text>
          <Text>{format(new Date(data.createdAt), "dd/MM/yyyy HH:mm")}</Text>
        </HStack>

        <HStack className="justify-between">
          <Text bold>Status</Text>
          <Text
            className={`${
              selectedStatus?.status === "payed"
                ? "text-green-400"
                : selectedStatus?.status === "New"
                ? "text-black"
                : selectedStatus?.status === "payment_failed"
                ? "text-red-500"
                : "text-black"
            } text-right`}
          >
            {selectedStatus?.label}
          </Text>
        </HStack>

        <Text bold className="text-xl mt-4">
          Items
        </Text>

        <FlatList
          data={data.items}
          contentContainerStyle={{ paddingBottom: 100 }} // Adiciona espaço extra para evitar sobreposição
           contentContainerClassName="gap-2 max-w-[960px] w-full overflow-y-auto mx-auto p-2"
          renderItem={({ item }) => (
            <Link href={`/product/${item.productId}`} asChild>
              <Pressable>
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
              </Pressable>
            </Link>
          )}
        />
      </VStack>

      {/* Valor total fixo no rodapé */}
      <HStack className="justify-between absolute bottom-0 left-0 right-0 bg-white p-4 pb-8 shadow-md">
        <Text bold>Valor Total</Text>
        <Text bold>{formatCurrency(totalPrice)}</Text>
      </HStack>
    </Box>
  );
};

export default OrderScreen;
