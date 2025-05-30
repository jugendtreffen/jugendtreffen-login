import { AlertProvider } from "src/components/Alert/AlertContext";
import Footer from "src/components/Navigation/Footer";
import Navigation from "src/components/Navigation/Navigation";

type GlobalLayoutProps = {
  children?: React.ReactNode
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-900">
      <header className="fixed top-0 z-50 w-screen">
        <Navigation />
      </header>
      <main className="relative overflow-hidden h-full flex-1">
        <AlertProvider>{children}</AlertProvider>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default GlobalLayout
