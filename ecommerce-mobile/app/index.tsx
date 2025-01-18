import {
  View,
  Text,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import ProductListItem from "../components/product-list-item";
import { Button, ButtonText } from "@/components/ui/button";
import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";
import { useEffect, useState } from "react";
import { listProducts } from "@/api/products";
import { useQuery } from "@tanstack/react-query";

const HomeScreen = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({ queryKey: ["products"], queryFn: listProducts });

  const numColumns = useBreakpointValue({
    default: 2,
    sm: 3,
    xl: 4,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error fetching products</Text>;
  }

  return (
    <FlatList
      key={numColumns}
      data={products}
      numColumns={numColumns}
      contentContainerClassName="gap-2 mx-auto w-full max-w-[960px]"
      columnWrapperClassName="gap-2"
      renderItem={({ item }) => <ProductListItem product={item} />}
    />
  );
};

export default HomeScreen;
