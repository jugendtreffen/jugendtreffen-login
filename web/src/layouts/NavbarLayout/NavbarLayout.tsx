import Navigation from 'src/components/Navigation/Navigation'
import Footer from 'src/components/Navigation/Footer'

type NavbarLayoutProps = {
  children?: React.ReactNode
}

const NavbarLayout = ({ children }: NavbarLayoutProps) => {
  return (
    <>
      <header className="fixed top-0 z-50 w-screen">
        <Navigation />
      </header>
      <main className="relative overflow-hidden h-full flex-1">{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  )
}

export default NavbarLayout
