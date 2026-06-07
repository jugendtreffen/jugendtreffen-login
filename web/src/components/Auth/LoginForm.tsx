import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { Form, useForm} from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'
import z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {LabeledInput} from "@/components/ui/labeled-input";
import React from "react";
import {SignupInput} from "@/components/Auth/SignupForm";

const LoginSchema = z
  .object({
    email: z.string().email('Bitte gib deine Email-Adresse an'),
    password: z.string(),
  })

export type LoginInput = z.infer<typeof LoginSchema>

export function LoginForm({className, ...props}: React.ComponentProps<'div'> & {onSubmit: (input: SignupInput) => void | Promise<void>}) {
  const loginForm = useForm({
    mode: 'onBlur',
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Bei Jugendtreffen Anmelden</CardTitle>
          <FieldDescription>
            Login ist nur für Mitarbeiter gedacht, Stattdessen{' '}
            <Link to={routes.eventRegistration()}>als Teilnehmer Anmelden</Link>
          </FieldDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={props.onSubmit} formMethods={loginForm}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <LabeledInput
                  name={'email'}
                  label={'Email'}
                  formControl={loginForm.control}
                />
              </div>
              <div>
                <LabeledInput
                  name={'password'}
                  label={'Passwort'}
                  formControl={loginForm.control}
                />
                <div className="flex justify-end mt-1">
                  <Link
                    to="#"
                    className=" inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Passwort vergessen?
                  </Link>
                </div>
              </div>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Du hast keinen Account?{' '}
                  <Link to={routes.signup()}>Registrieren</Link>
                </FieldDescription>
              </Field>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
