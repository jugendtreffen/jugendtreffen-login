type AuthLayoutProps = {
  children?: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <section className="flex flex-col items-center mt-14 p-6 mx-auto lg:py-0 h-full">
      {children}
    </section>);
};

export default AuthLayout;
