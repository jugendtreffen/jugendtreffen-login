import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Form, Label, useForm } from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const formMethods = useForm({
    mode: 'onBlur',
    resolver: null,
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Bei Jugendtreffen Anmelden</CardTitle>
          <FieldDescription>
            Login ist nur für Mitarbeiter gedacht, stadtdessen{' '}
            <Link to={routes.eventRegistration()}>als Teilnehmer Anmelden</Link>
          </FieldDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={props.onSubmit} formMethods={formMethods}>
            <FieldGroup>
              <Field>
                <Label name="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="your@mail.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <Label name="password">Passwort</Label>
                  <Link
                    to="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Du hast keinen Account?{' '}
                  <Link to={routes.signup()}>Registrieren</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
