import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login, signup } from "@/api/auth";
import { Link, Redirect } from "expo-router";
import { useAuth } from "@/store/authStore";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const setUser = useAuth((s) => s.setUser);
  const setToken = useAuth((s) => s.setToken);
  const isLoggedIn = useAuth((s) => !!s.token);

  const signupMutation = useMutation({
    mutationFn: () => signup(name, email, password),
    onSuccess: (data) => {
      console.log("success sign up");

      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
      }
    },
    onError: () => {
      console.log("Error");
    },
  });

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <FormControl
      isInvalid={signupMutation.isError}
      className="p-4 border rounded-lg max-w-[500px] border-outline-300 bg-white m-2"
    >
      <VStack space="xl">
        <Heading className="text-typography-900 leading-3 pt-3">
          Cadastro
        </Heading>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Nome</Text>
          <Input>
            <InputField value={name} onChangeText={setName} type="text" />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">E-mail</Text>
          <Input>
            <InputField value={email} onChangeText={setEmail} type="text" />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500">Senha</Text>
          <Input className="text-center">
            <InputField
              value={password}
              onChangeText={setPassword}
              type={showPassword ? "text" : "password"}
            />
            <InputSlot className="pr-3" onPress={handleState}>
              <InputIcon
                as={showPassword ? EyeIcon : EyeOffIcon}
                className="text-blue-500"
              />
            </InputSlot>
          </Input>
        </VStack>
        <HStack space="sm">
          <Link href="/login" asChild>
            <Button className="flex-1" variant="outline">
              <ButtonText>Login</ButtonText>
            </Button>
          </Link>
          <Button
            className="flex-1"
            onPress={() => {
              signupMutation.mutate();
            }}
          >
            <ButtonText>Cadastrar-se</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormControl>
  );
}
