import { AlertProvider } from 'src/components/Alert/AlertContext'
import { SpeedInsights } from '@vercel/speed-insights/react'

type GlobalLayoutProps = {
  children?: React.ReactNode
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-900">
      <AlertProvider>{children}</AlertProvider>
      <SpeedInsights />
    </div>
  )
}

export default GlobalLayout
