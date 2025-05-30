import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-800">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://jugendtreffen.at/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img
              src="/Jugendtreffen-Logo-2.png"
              className="h-8"
              alt="Jugendtreffen"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              jugendtreffen.at
            </span>
          </a>
          <ul className="flex flex-wrap items-center text-sm font-medium text-gray-400 flex-between">
            <li>
              <a
                href="https://jugendtreffen.at/ueber-das-jugendtreffen/"
                className="hover:underline md:me-6"
              >
                Über Uns
              </a>
            </li>
            <li>
              <a
                href="https://jugendtreffen.at/impressum/"
                className="hover:underline md:me-6"
              >
                Impressum
              </a>
            </li>
            <li>
              <a
                href="https://jugendtreffen.at/datenschutzerklaerung/"
                className="hover:underline md:me-6"
              >
                Datenschutzerklärung
              </a>
            </li>
            <li>
              <a
                href="https://jugendtreffen.at/kontakt/"
                className="hover:underline"
              >
                Kontakt
              </a>
            </li>
          </ul>
        </div>
        <span className="block text-sm text-gray-400">
          Bei Problemen melde dich bei{' '}
          <a href="mailto:info@jugendtreffen.at" className="font-bold">
            info@jugendtreffen.at
          </a>
        </span>
        <hr className="my-6 sm:mx-auto border-gray-700 lg:my-8" />
        <span className="block text-sm sm:text-center text-gray-400">
          © 2024{' '}
          <a href="https://jugendtreffen.at/" className="hover:underline">
            jugendtreffen.at
          </a>
        </span>
      </div>
    </footer>
  )
}

export default Footer
