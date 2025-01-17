import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <GluestackUIProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Shopping",
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
};

export default RootLayout;
