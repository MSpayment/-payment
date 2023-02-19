import {
  Paper,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Autocomplete,
} from "@mantine/core";
import React, { FC, FormEvent } from "react";
import { useAuth } from "src/features/auth/hooks/useMutateAuth";
import { AuthSchema } from "src/features/auth/types";
import { useAuthInput } from "src/store/input";

export const Login: FC = () => {
  const email = useAuthInput((state) => state.email);
  const password = useAuthInput((state) => state.password);
  const setEmail = useAuthInput((state) => state.setEmail);
  const setPassword = useAuthInput((state) => state.setPassword);
  const { loginMutation } = useAuth();

  const data =
    email.trim().length > 0 && !email.includes("@")
      ? ["gmail.com", "outlook.com", "yahoo.com", "icloud.com"].map(
          (provider) => `${email}@${provider}`
        )
      : [];

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const validate = AuthSchema.parse({ email, password });
      loginMutation.mutate(validate);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",
      }}
      className="min-h-[900px] bg-cover"
    >
      <Paper
        onSubmit={submitHandler}
        component="form"
        className="min-h-[900px] max-w-full border-0 border-r border-r-blue-300 pt-20 md:max-w-md md:border-solid"
        radius={0}
        p={30}
      >
        <Title order={2} align="center" mt="md" mb={50}>
          Hello there!
        </Title>

        <Autocomplete
          data={data}
          label="Email"
          placeholder="メールアドレス"
          value={email}
          onChange={(event) => setEmail(event)}
        />
        <PasswordInput
          label="Password"
          placeholder="パスワード"
          mt="md"
          size="md"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit" fullWidth mt="xl" size="md">
          ログイン
        </Button>
        <Text align="center" mt="md">
          Don&apos;t have an account?
          <Anchor
            href="#"
            weight={700}
            onClick={(event) => event.preventDefault()}
            className="ml-1"
          >
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
};
