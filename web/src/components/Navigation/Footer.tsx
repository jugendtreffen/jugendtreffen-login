import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-gray-900">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://jugendtreffen.at/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://jugendtreffen.at/wp-content/uploads/2021/06/Jugendtreffen-Logo-2.png"
              className="h-8"
              alt="Jugendtreffen"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              jugendtreffen.at
            </span>
          </a>
          <ul className="flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 flex-between">
            <li>
              <a href="https://jugendtreffen.at/ueber-das-jugendtreffen/" className="hover:underline md:me-6">
                Über Uns
              </a>
            </li>
            <li>
              <a href="https://jugendtreffen.at/impressum/" className="hover:underline md:me-6">
                Impressum
              </a>
            </li>
            <li>
              <a href="https://jugendtreffen.at/datenschutzerklaerung/" className="hover:underline md:me-6">
                Datenschutzerklärung
              </a>
            </li>
            <li>
              <a href="https://jugendtreffen.at/kontakt/" className="hover:underline">
                Kontakt
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{' '}
          <a href="https://jugendtreffen.at/" className="hover:underline">
            Jugendtreffen Pöllau
          </a>
        </span>
      </div>
    </footer>
  )
};

export default Footer;
