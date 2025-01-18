import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import React from "react";
import { HStack } from "@/components/ui/hstack";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  return (
    <FormControl className="p-4 border rounded-lg max-w-[500px] border-outline-300 bg-white m-2">
      <VStack space="xl">
        <Heading className="text-typography-900 leading-3 pt-3">Login</Heading>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">E-mail</Text>
          <Input>
            <InputField type="text" />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500">Senha</Text>
          <Input className="text-center">
            <InputField type={showPassword ? "text" : "password"} />
            <InputSlot className="pr-3" onPress={handleState}>
              <InputIcon
                as={showPassword ? EyeIcon : EyeOffIcon}
                className="text-blue-500"
              />
            </InputSlot>
          </Input>
        </VStack>
        <HStack space="sm">
          <Button className="flex-1" variant="outline" onPress={() => {}}>
            <ButtonText>Cadastro</ButtonText>
          </Button>
          <Button className="flex-1" onPress={() => {}}>
            <ButtonText>Login</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormControl>
  );
}
