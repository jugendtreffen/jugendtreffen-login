import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
} from '@/components/ui/field'
import { Form, useForm } from '@redwoodjs/forms'

import { Link, routes } from '@redwoodjs/router'

import React from 'react'
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {LabeledInput} from "@/components/ui/labeled-input";

const SignUpSchema = z
  .object({
    email: z.string().email('Bitte gib deine Email-Adresse an'),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })

export type SignupInput = z.infer<typeof SignUpSchema>

export function SignupForm({
  ...props
}: React.ComponentProps<typeof Card> & {
  onSubmit: (input: SignupInput) => void | Promise<void>
}) {
  const signUpForm = useForm({
    mode: 'onBlur',
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Registrieren</CardTitle>
        <FieldDescription>
          Nur Mitarbeiter brauchen einen Account, stadtdessen{' '}
          <Link to={routes.eventRegistration()}>als Teilnehmer Anmelden</Link>
        </FieldDescription>
      </CardHeader>
      <CardContent>
        <Form onSubmit={props.onSubmit} formMethods={signUpForm}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <LabeledInput
                name={'email'}
                label={'Email'}
                formControl={signUpForm.control}
              />
            </div>
            <div>
              <LabeledInput
                name={'password'}
                label={'Passwort'}
                formControl={signUpForm.control}
              />
            </div>
            <div>
              <LabeledInput
                name={'confirmPassword'}
                label={'Passwort Bestätigen'}
                formControl={signUpForm.control}
              />
            </div>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  Du hast schon einen Account?{' '}
                  <Link to={routes.login()}>Anmelden</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
