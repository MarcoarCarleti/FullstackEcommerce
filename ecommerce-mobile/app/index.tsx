import { View, Text, FlatList, useWindowDimensions } from "react-native";
import products from "../assets/products.json";
import ProductListItem from "../components/product-list-item";
import { Button, ButtonText } from "@/components/ui/button";
import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";

const HomeScreen = () => {
  const numColumns = useBreakpointValue({
    default: 2,
    sm: 3,
    xl: 4,
  });

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
