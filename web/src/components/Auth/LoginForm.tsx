import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
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
} from "@/components/ui/field"
import {Form, InputField, Label, PasswordField} from "@redwoodjs/forms";
import {Link} from "@redwoodjs/router";

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Bei Jugendtreffen Anmelden</CardTitle>
          <FieldDescription>
            Login ist nur für Mitarbeiter gedacht, stadtdessen <Link to={"#"}>als Teilnehmer Anmelden</Link>
          </FieldDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={props.onSubmit}>
            <FieldGroup>
              <Field>
                <Label name="email" className="label">
                  Email
                </Label>
                <InputField
                  type="email"
                  name="email"
                  errorClassName="input error"
                  placeholder="your@mail.com"
                  validation={{
                    required: true,
                  }}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <Label name="password" className="label">Passwort</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <PasswordField
                  name="password"
                  placeholder="••••••••"
                  errorClassName="input error"
                  validation={{
                    required: true,
                  }}/>
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="#">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
