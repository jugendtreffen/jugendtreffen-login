import { Link, navigate, routes } from "@redwoodjs/router";

import { useAuth } from "src/auth";
import SignoutButton from "src/components/Auth/SignoutButton";
import { useState } from "react";
import { BurgerMenueIcon, CloseIcon } from "src/components/Icons/Icons";

const Navigation = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  function handleNavToggle() {
    open ? setOpen(false) : setOpen(true);
  }

  function isMobile() {
    return window.innerWidth < 768;
  }

  return (
    <nav className="bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between mx-auto p-2 md:p-4">
        <Link to={routes.home()}>
          <img
            src="/Jugendtreffen-Logo-2.png"
            className="h-8"
            alt="Jugendtreffen"
          />
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {isAuthenticated ? (
            <SignoutButton />
          ) : !isMobile() && (
            <div className="flex space-x-2 me-2">
              <button className="secondary" onClick={() => navigate(routes.signup())}>
                Account erstellen
              </button>
              <button className="primary" onClick={() => navigate(routes.login())}>
                Anmelden
              </button>
            </div>
          )}
          <button
            onClick={handleNavToggle}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none text-white"
            aria-controls="navbar-cta"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {open ? <CloseIcon /> : <BurgerMenueIcon />}
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            open ? "" : "hidden"
          }`}
          id="navbar-cta"
        >
          <ul
            className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-zinc-200 rounded-lg bg-b md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            {/*<li>*/}
            {/*  <Link*/}
            {/*    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0"*/}
            {/*    to={routes.signup()}*/}
            {/*  >*/}
            {/*    Sign Up*/}
            {/*  </Link>*/}
            {/*</li>*/}
          </ul>
          {isMobile() && (<div className="flex space-x-2 justify-center">
            <button className="secondary" onClick={() => navigate(routes.signup())}>
              Account erstellen
            </button>
            <button className="primary" onClick={() => navigate(routes.login())}>
              Anmelden
            </button>
          </div>)}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
