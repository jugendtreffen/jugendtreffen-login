import Navigation from 'src/components/Navigation/Navigation'

type GlobalLayoutProps = {
  children?: React.ReactNode
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2024 jugendtreffen.at All rights reserved.</p>
      </footer>
    </>
  )
}

export default GlobalLayout
