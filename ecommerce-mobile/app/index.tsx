import { View, Text, FlatList } from "react-native";
import products from "../assets/products.json";
import ProductListItem from "../components/product-list-item";
import { Button, ButtonText } from "@/components/ui/button";

const HomeScreen = () => {
  return (
    <Button>
      <ButtonText>Press me!</ButtonText>
    </Button>
    // <View>
    //   <FlatList
    //     data={products}
    //     renderItem={({ item }) => <ProductListItem product={item} />}
    //   />
    // </View>
  );
};

export default HomeScreen;
