import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default RootLayout;
