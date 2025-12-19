import { notification } from "antd";
import { useMutation } from "@tanstack/react-query";
import QueryBoundary from "../../internals/QueryBoundary";
import Container from "./Container";
import { Header, Main } from "./styles";
import { sendPasswordResetEmail, resetPassword } from "./api";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

let ForgotPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedQueryStrings = queryString.parse(location.search);
  const isToken = Boolean(parsedQueryStrings.token);

  const resetMutation = useMutation({
    mutationFn: (values) => {
      if (isToken) {
        return resetPassword(values);
      }
      return sendPasswordResetEmail(values);
    },
    onSuccess: () => {
      notification.success({
        message: isToken
          ? "Password reset successful!"
          : "Password reset link has been emailed!",
        placement: "bottomRight",
      });

      if (isToken) {
        navigate("/login");
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.response?.data?.message || "Something went wrong!",
        placement: "bottomRight",
      });
    },
  });

  const fields = !isToken
    ? [{ label: "Email", name: "email" }]
    : [
        { label: "Password", name: "password" },
        { label: "Confirm password", name: "confirmPassword" },
      ];

  const handleSubmit = (values) => {
    if (isToken) {
      resetMutation.mutate(values);
    } else {
      resetMutation.mutate({ ...values, token: parsedQueryStrings.token });
    }
  };

  return (
    <>
      <Header>
      <img src="/logo.png" alt="storeways logo" />
      </Header>
      <Main>
        <Container
          fields={fields}
          title="Password reset"
          onSubmitCb={handleSubmit}
          isLoading={resetMutation.isPending}
        />
      </Main>
    </>
  );
};

ForgotPasswordPage = (props) => (
  <QueryBoundary>
    <ForgotPasswordPage {...props} />
  </QueryBoundary>
);

export default ForgotPasswordPage;

