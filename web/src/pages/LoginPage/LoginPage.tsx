import { Form, InputField, Label, PasswordField, Submit } from "@redwoodjs/forms";
import { Link, navigate, routes } from "@redwoodjs/router";
import { Metadata } from "@redwoodjs/web";

import { useAuth } from "src/auth";
import { useAlert } from "src/components/Alert/AlertContext";
import AlertCenter from "src/components/Alert/AlertCenter";
import Card from "src/components/Card/Card";

const LoginPage = () => {
  const { logIn, isAuthenticated, userMetadata, loading } = useAuth();
  const { addAlert, removeAllAlerts } = useAlert();

  const onSubmit = async (data) => {
    removeAllAlerts();
    try {
      const response = await logIn({
        email: data.email,
        password: data.password,
        authMethod: "password"
      });
      response?.error?.message
        ? addAlert(response.error.message, "error")
        : navigate(routes.home());
    } catch (error) {
      addAlert(error.message, "error");
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <Metadata title="Anmelden" description="Login page" />
        <Card className="flex flex-col gap-1">
          <h2>You are already logged in as <span className="code">{userMetadata.email}</span></h2>
          <Link className="primary" to={routes.home()}>Home</Link>
        </Card>
      </>
    );
  }

  return (
    <>
      <Metadata title="Anmelden" description="Login page" />

      <AlertCenter></AlertCenter>
      <Card>
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Bei Jugendtreffen Anmelden
        </h1>
        <Form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
          <div>
            <Label
              name="email"
              className="label"
            >
              Email
            </Label>
            <InputField
              type="email"
              name="email"
              errorClassName="input error"
              className="input"
              placeholder="your@mail.com"
              validation={{
                required: true
              }}
            />
          </div>
          <div>
            <Label
              name="password"
              className="label"
            >
              Passwort
            </Label>
            <PasswordField
              name="password"
              placeholder="••••••••"
              className="input"
              errorClassName="input error"
              validation={{
                required: true
              }}
            />
          </div>
          {/*<div className="flex items-center justify-end">*/}
          {/*  <Link*/}
          {/*    to={routes.login()}*/}
          {/*    className="text-sm font-medium text-blue-500 hover:underline"*/}
          {/*  >*/}
          {/*    Passwort vergessen?*/}
          {/*  </Link>*/}
          {/*</div>*/}
          <Submit className="primary w-full" disabled={loading}>
            Anmelden
          </Submit>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Du hast noch keinen Account?{" "}
            <Link
              to={routes.signup()}
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Erstelle hier einen
            </Link>
          </p>
        </Form>
      </Card>
    </>
  );
};

export default LoginPage;
