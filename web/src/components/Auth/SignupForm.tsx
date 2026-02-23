import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {Link, routes} from "@redwoodjs/router";
import {Form, InputField, Label, SubmitHandler, useForm} from "@redwoodjs/forms";
import React from "react";
import {SignupFormValues} from "@/pages/SignupPage/SignupPage";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card> & {
  onSubmit: SubmitHandler<SignupFormValues>
}) {
  const formMethods = useForm({
    mode: 'onBlur',
    resolver: null,
  })

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Registrieren</CardTitle>
        <FieldDescription>
          Nur Mitarbeiter brauchen einen Account, stadtdessen <Link to={"#"} >als Teilnehmer Anmelden</Link>
        </FieldDescription>
      </CardHeader>
      <CardContent>
        <Form onSubmit={props.onSubmit} formMethods={formMethods}>
          <FieldGroup>
            <Field>
              <Label name="email">
                Email
              </Label>
              <InputField
                type="email"
                name="email"
                errorClassName="input error"
                className="input"
                placeholder="your@mail.com"
                validation={{
                  required: true,
                  pattern: {
                    value: /[^@]+@[^.]+\..+/,
                    message: 'Bitte gib eine gültige E-Mail-Adresse ein'
                  }
                }}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" name="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" name="confirm-password" required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  Du hast schon einen Account? <Link to={routes.login()}>Anmelden</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </Form>
      </CardContent>
    </Card>
  )
}
