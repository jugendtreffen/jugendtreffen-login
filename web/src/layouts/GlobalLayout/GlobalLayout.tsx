import Navigation from 'src/components/Navigation/Navigation'
import Footer from "src/components/Navigation/Footer";

type GlobalLayoutProps = {
  children?: React.ReactNode
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className="sticky top-0 bg-slate-900">
        <Navigation />
      </header>
      <main className="bg-gradient-to-t from-gray-900 to-slate-900">
        {children}
      </main>
      <footer>
        <Footer/>
      </footer>
    </div>
  )
}

export default GlobalLayout
