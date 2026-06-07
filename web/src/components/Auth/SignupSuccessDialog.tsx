import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {useAuth} from "@/auth";

type SignupSuccessDialogProps = {
  email: string
}

const RESEND_COOLDOWN_SECONDS = 60

export function SignupSuccessDialog({ email }: SignupSuccessDialogProps) {
  const {client} = useAuth()
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS)
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cooldown <= 0) return

    const interval = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [cooldown])

  const handleResendEmail = async () => {
    if (!email || cooldown > 0 || isResending) return

    setIsResending(true)
    setMessage(null)
    setError(null)

    const { error } = await client.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsResending(false)
      return
    }

    setMessage('Bestätigungs-E-Mail wurde erneut gesendet.')
    setCooldown(RESEND_COOLDOWN_SECONDS)
    setIsResending(false)
  }

  return (
    <DialogContent
      className="sm:max-w-md"
      onInteractOutside={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle>Account erfolgreich erstellt</DialogTitle>
        <DialogDescription>
          Bestätige deine Email-Adresse um dich anzumelden. Wenn du keine Email
          erhalten hast, überprüfe deinen Spam-Ordner oder versuche die Email neu zu senden.
        </DialogDescription>
      </DialogHeader>

      <div className="rounded-md border bg-muted/40 p-3 text-sm">
        <div>
          Gesendet an: <span className="font-medium">{email}</span>
        </div>

        {message && <p className="mt-2 text-green-600">{message}</p>}
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      <DialogFooter className="flex-col gap-2 sm:flex-col sm:items-stretch">
        <Button
          type="button"
          variant="secondary"
          onClick={handleResendEmail}
          disabled={cooldown > 0 || isResending}
        >
          {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {cooldown > 0
            ? `Erneut senden in ${cooldown}s`
            : 'Bestätigungs-E-Mail erneut senden'}
        </Button>

        <p className="text-xs text-muted-foreground text-right">
          Aus Sicherheitsgründen ist erneutes Senden nur einmal pro{' '}
          {RESEND_COOLDOWN_SECONDS} Sekunden möglich.
        </p>
      </DialogFooter>
    </DialogContent>
  )
}
