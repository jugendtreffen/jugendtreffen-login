import { AlertProvider } from '@/hooks/AlertHook'
import {CurrentEventProvider} from "@/hooks/CurrenteventHook";

type GlobalLayoutProps = {
  children?: React.ReactNode
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <AlertProvider>
        <CurrentEventProvider>
          {children}
        </CurrentEventProvider>
      </AlertProvider>
    </div>
  )
}

export default GlobalLayout
