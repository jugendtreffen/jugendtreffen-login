import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { LoginForm } from '@/components/Auth/LoginForm'
import {Card, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import { useAuth } from 'src/auth'

import AlertCenter from 'src/components/Alert/AlertCenter'
import {useAlert} from "@/hooks/AlertHook";
import React from "react";

const LoginPage = (props) => {
  const { next } = props
  const { logIn, isAuthenticated, currentUser } = useAuth()
  const { addAlert, removeAllAlerts } = useAlert()

  const onSubmit = async (input) => {
    if (!input.email) return
    removeAllAlerts()
    try {
      const response = await logIn({
        email: input.email,
        password: input.password,
        authMethod: 'password',
      })
      response?.error?.message
        ? addAlert(response.error.message, 'error')
        : navigate(next || routes.home())
    } catch (error) {
      addAlert(error.message, 'error')
    }
  }

  if (isAuthenticated) {
    return (
      <>
        <Metadata
          title="Anmeldung"
          description="Erstelle einen Mitarbeiter Account"
        />

        <div className="flex w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <Card className="flex flex-col gap-1">
              <CardHeader>
                <CardTitle className="text-center">Angemeldet als</CardTitle>
                <CardDescription className="text-center">{currentUser?.email}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        <div className="w-1/2 mx-auto">
          <AlertCenter className="mt-2"></AlertCenter>
        </div>
      </>
    )
  }

  return (
    <>
      <Metadata title="Anmelden" description="Login page" />
      <div className="w-1/2 mx-auto">
        <AlertCenter className="mt-2"></AlertCenter>
      </div>

      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <LoginForm onSubmit={onSubmit} />
        </div>
      </div>
    </>
  )
}

export default LoginPage
