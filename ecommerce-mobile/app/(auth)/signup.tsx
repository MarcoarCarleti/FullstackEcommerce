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
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const signupMutation = useMutation({
    mutationFn: () => signup(name, email, password),
    onSuccess: (data) => {
      console.log("success sign up");

      if (data.user && data.token) {
        showNewToast({
          action: "success",
          title: "Sucesso",
          description: "Usuário cadastrado com sucesso!",
        });
        setUser(data.user);
        setToken(data.token);
      }
    },
    onError: (err, variables, context) => {
      if (err.message === "Email already in use") {
        showNewToast({
          action: "error",
          title: "Erro",
          description: "O e-mail inserido já está em uso por outro usuário.",
        });
        return;
      }

      showNewToast({
        action: "error",
        title: "Erro",
        description: "Ocorreu um erro, por favor, tente novamente mais tarde",
      });

      console.log(err);
    },
  });

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const handleSubmit = () => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;

    const nameRegex =
      /^(?![ ])(?!.*[ ]{2})((?:e|da|do|das|dos|de|d'|D'|la|las|el|los)\s*?|(?:[A-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð'][^\s]*\s*?))+( [A-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð'][^\s]*\s*?)+$/;

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!nameRegex.test(name)) {
      const error = "Insira um nome válido!";

      showNewToast({
        title: "Erro",
        description: error,
        action: "error",
      });
      return;
    }

    if (!emailRegex.test(email)) {
      const error = "Insira um email válido!";
      showNewToast({
        title: "Erro",
        description: error,
        action: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      const error = "As senhas não coincidem";
      showNewToast({
        title: "Erro",
        description: error,
        action: "error",
      });
      return;
    }

    if (!passwordRegex.test(password) || !passwordRegex.test(confirmPassword)) {
      const error =
        "Senhas devem conter ao menos: 8 caracteres, um caracter especial, um caracter maíusculo e um caracter minúsculo!";
      showNewToast({
        title: "Erro",
        description: error,
        action: "error",
      });
      return;
    }

    signupMutation.mutate();
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
        <VStack space="xs">
          <Text className="text-typography-500">Confirme sua senha</Text>
          <Input className="text-center">
            <InputField
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
            <Button
              className="flex-1"
              variant="outline"
              disabled={signupMutation.isPending}
            >
              <ButtonText>Login</ButtonText>
            </Button>
          </Link>
          <Button
            className="flex-1"
            disabled={signupMutation.isPending}
            onPress={handleSubmit}
          >
            {" "}
            {signupMutation.isPending && <ButtonSpinner />}
            <ButtonText>Cadastrar-se</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormControl>
  );
}
