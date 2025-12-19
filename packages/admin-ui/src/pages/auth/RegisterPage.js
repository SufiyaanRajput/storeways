import { notification } from "antd";
import { useMutation } from "@tanstack/react-query";
import Container from "./Container";
import { Header, Main } from "./styles";
import { register } from "./api";
import { useSetAtom } from "jotai";
import { setUserAtom } from "../../store/userAtom";
import QueryBoundary from "../../internals/QueryBoundary";

let RegisterPage = () => {
  const setUser = useSetAtom(setUserAtom);

  const registerMutation = useMutation({
    mutationFn: register,
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
    { label: "Full name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Mobile", name: "mobile" },
    { label: "Store name", name: "storeName" },
    { label: "Invite code", name: "inviteCode" },
    { label: "Password", name: "password" },
    { label: "Confirm password", name: "confirmPassword" },
  ];

  const handleSubmit = (values) => {
    const { mobile, ...payload } = values;
    registerMutation.mutate({
      ...payload,
      mobile: "+91" + mobile,
    });
  };

  return (
    <>
      <Header>
        <strong>Storeways</strong>
      </Header>
      <Main>
        <Container
          fields={fields}
          title="Register"
          onSubmitCb={handleSubmit}
          isLoading={registerMutation.isPending}
        />
      </Main>
    </>
  );
};

RegisterPage = (props) => (
  <QueryBoundary>
    <RegisterPage {...props} />
  </QueryBoundary>
);

export default RegisterPage;

