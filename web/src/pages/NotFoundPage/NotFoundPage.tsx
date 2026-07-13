import {navigate, routes} from '@redwoodjs/router'
import {ArrowLeft, Home, ShieldAlert} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";

export default () => (
  <main className="flex min-h-[100svh] items-center justify-center px-6 py-10">
    <Card className={"p-8 shadow-sm flex flex-col items-center"}>
      <div className="mb-6 rounded-full border bg-muted/40 p-4">
        <ShieldAlert className="size-6 text-muted-foreground" />
      </div>

      <p className="mb-2 text-sm font-medium text-muted-foreground">404 error</p>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => navigate(routes.home())}>
          <Home className="size-4" />
          Back home
        </Button>

        <Button onClick={() => window.history.back()} variant="outline">
          <ArrowLeft className="size-4" />
          Go back
        </Button>
      </div>
    </Card>
  </main>
)
