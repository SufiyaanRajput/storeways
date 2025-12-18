import { notification } from "antd";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Container from "./Container";
import { Header, Main } from "./styles";
import { login } from "./api";
import { useSetAtom } from "jotai";
import { userAtom } from "../../store/userAtom";

const LoginPage = () => {
  const setUser = useSetAtom(userAtom);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const user = response?.data?.user || response?.user;
      if (user) setUser(user);
    },
    onError: (error) => {
      notification.error({
        message: error?.response?.data?.message || "Something went wrong",
        placement: "bottomRight",
      });
    },
  });

  const fields = [
    { label: "Email", name: "email" },
    { label: "Password", name: "password" },
  ];

  const handleSubmit = (values) => {
    loginMutation.mutate(values);
  };

  return (
    <>
      <Header>
        <strong>Storeways</strong>
      </Header>
      <Main>
        <Container
          fields={fields}
          title="Login"
          onSubmitCb={handleSubmit}
          isLoading={loginMutation.isPending}
        />
      </Main>
    </>
  );
};

export default LoginPage;

