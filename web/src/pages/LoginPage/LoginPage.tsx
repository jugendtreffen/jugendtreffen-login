// import { Link, routes } from '@redwoodjs/router'
import { Form, InputField, Label, PasswordField, Submit } from "@redwoodjs/forms";
import { Link, navigate, routes } from "@redwoodjs/router";
import { Metadata } from "@redwoodjs/web";

import { useAuth } from "src/auth";
import { useAlert } from "src/components/Alert/AlertContext";
import AlertCenter from "src/components/Alert/AlertCenter";

const LoginPage = () => {
  const { logIn, isAuthenticated, userMetadata } = useAuth();
  const { addAlert } = useAlert()

  const onSubmit = async (data) => {
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

  return (
    <>
      <Metadata title="Anmelden" description="Login page" />

        <AlertCenter></AlertCenter>
        <div
          className="w-full rounded-lg shadow border mt-6 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

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
              <Submit className="primary w-full">
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
          </div>
        </div>
    </>
  );
};

export default LoginPage;
