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
      <main className="">
        <AlertProvider>
          <section className="flex flex-col items-center p-6 mx-auto lg:py-0 h-full">
            {children}
          </section>
        </AlertProvider>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default GlobalLayout;
