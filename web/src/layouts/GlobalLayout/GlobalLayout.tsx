import Navigation from "src/components/Navigation/Navigation";
import Footer from "src/components/Navigation/Footer";
import { AlertProvider } from "src/components/Alert/AlertContext";

type GlobalLayoutProps = {
  children?: React.ReactNode
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-900">
      <header className="sticky top-0 ">
        <Navigation />
      </header>
      <main className="relative w-screen overflow-hidden">
        <AlertProvider>
          {children}
        </AlertProvider>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default GlobalLayout;
