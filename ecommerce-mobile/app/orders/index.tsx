import { getOrders } from "@/api/orders";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, Pressable } from "react-native";
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
import { formatCurrency } from "@/utils";
import { format } from "date-fns";
import { Link } from "expo-router";

const OrdersScreen = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
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
  return (
    <FlatList
      data={data.sort((a, b) => b.id - a.id)}
      contentContainerClassName="gap-2 max-w-[960px] w-full  mx-auto p-2 overflow-y-auto"
      renderItem={({ item }) => {
        const selectedStatus = statuses.find(
          ({ status }) => status === item.status
        );
        return (
          <Link href={`/orders/${item.id}`} asChild>
            <Pressable>
              <Box>
                <HStack className="bg-white p-3 justify-between">
                  <VStack space="sm">
                    <Text bold>Pedido #{item.id}</Text>
                    <Text className="ml-auto">
                      {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
                    </Text>
                  </VStack>
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
              </Box>
            </Pressable>
          </Link>
        );
      }}
    />
  );
};

export default OrdersScreen;
