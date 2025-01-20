import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
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
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastId, setToastId] = useState(0);

  const setUser = useAuth((s) => s.setUser);
  const setToken = useAuth((s) => s.setToken);
  const isLoggedIn = useAuth((s) => !!s.token);

  const toast = useToast();

  const showNewToast = ({
    action,
    title,
    description,
  }: {
    action?: "muted" | "success" | "error" | "warning" | "info";
    title: string;
    description: string;
  }) => {
    const newId = Math.random();
    setToastId(newId);
    toast.show({
      id: String(newId),
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action={action} variant="solid">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      console.log("success");

      if (data.user && data.token) {
        showNewToast({
          action: "success",
          title: "Sucesso",
          description: "Logado com sucesso!",
        });

        setUser(data.user);
        setToken(data.token);
      }
    },
    onError: (err) => {
      showNewToast({
        action: "error",
        title: "Erro",
        description: "Usuário ou senha incorretos, por favor, tente novamente.",
      });
      console.log(err);
    },
  });

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  if (isLoggedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <FormControl
      isInvalid={loginMutation.isError}
      className="p-4 border rounded-lg max-w-[500px] border-outline-300 bg-white m-2"
    >
      <VStack space="xl">
        <Heading className="text-typography-900 leading-3 pt-3">Login</Heading>
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
          <Link href={"/signup"} asChild>
            <Button
              disabled={loginMutation.isPending}
              className="flex-1"
              variant="outline"
            >
              <ButtonText>Cadastro</ButtonText>
            </Button>
          </Link>

          <Button
            className="flex-1"
            disabled={loginMutation.isPending}
            onPress={() => {
              loginMutation.mutate();
            }}
          >
            {loginMutation.isPending && <ButtonSpinner />}
            <ButtonText>Login</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormControl>
  );
}
