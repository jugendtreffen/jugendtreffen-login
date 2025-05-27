import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { navigate, routes } from "@redwoodjs/router";
import { Metadata } from "@redwoodjs/web";

import Card from "src/components/Card/Card";
import { ArrowRightIcon } from "src/components/Icons/Icons";

const DefaultView = () => {
  const images = ["/A9A06698.webp", "/A9A07019.webp", "/DSC08102.webp"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000)
    return () => clearInterval(interval);
  }, [])

  return (
    <>
      <Metadata title="Home" description="Home page" />

      <section
        id="hero section"
        className="w-screen-minus-scrollbar bg-secondary"
      >
        <div
          className="absolute w-screen h-screen inset-0 flex flex-col gap-2 items-center justify-center text-center bg-black bg-opacity-60 z-10">
          <h1 className={"md:text-7xl"}>Jugendtreffen</h1>
          <h2 className={"md:text-2xl"}>
            15. bis 20. Juli 2025 in Kremsmünster
          </h2>
          <button
            className="primary inline-flex items-center mt-4"
            onClick={() => navigate(routes.signup())}
          >
            <h2>Teilnehmen</h2>
            <ArrowRightIcon />
          </button>
        </div>
        <motion.div
          className="flex transition-all duration-500"
          animate={{ x: `-${index * (100 / images.length)}%` }}
          transition={{ ease: "linear", duration: 0.8 }}
          style={{
            width: `calc(${images.length * 100}vw - ${images.length * 16}px)`
          }}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Slide ${i}`}
              className="w-screen-minus-scrollbar h-screen object-cover flex-shrink-0"
            />
          ))}
        </motion.div>
      </section>

      {/*<section id="FAQ" className="flex flex-col px-6 md:px-12 mx-auto lg:py-0 h-full my-12 gap-2">*/}
      {/*  <h1>Infos & Facts</h1>*/}
      {/*  <div className="w-full lg:w-2/3 ">*/}
      {/*    <Accordion items={HomePageAccordionItems} />*/}
      {/*  </div>*/}
      {/*</section>*/}

      <section
        id="Socials"
        className="flex flex-col p-6 md:px-12 mx-auto lg:py-0 h-full w-full my-12 gap-2"
      >
        <div className="flex flex-row flex-wrap gap-4 w-full">
          <a
            href="https://www.jugendtreffen.at"
            target="_blank"
            rel="noreferrer"
          >
            <Card description="Mehr Infos auf unserer">
              <div className="flex flex-row gap-2 mb-2 h-8">
                <img
                  className="h-8 rounded-full"
                  src="/website-white.png"
                  alt="logo"
                />
                <h2>Website</h2>
              </div>
            </Card>
          </a>
          <a
            href="https://www.instagram.com/jugendtreffen/"
            target="_blank"
            rel="noreferrer"
          >
            <Card description="Folge uns auf Instagramm">
              <div className="flex flex-row gap-2 mb-2 h-8">
                <img
                  className="h-8 rounded-full"
                  src="/instagramm-white.png"
                  alt="logo"
                />
                <h2>jugendtreffen</h2>
              </div>
            </Card>
          </a>
          <a
            href="https://open.spotify.com/playlist/5tiCqfN1eIQtjmtRklgP2Q"
            target="_blank"
            rel="noreferrer"
          >
            <Card description="Stimm dich mit unserer Playlist ein">
              <div className="flex flex-row gap-2 mb-2">
                <img className="h-8" src="/spotify-white.png" alt="logo" />
                <h2>Jugendtreffen 2024 Worship</h2>
              </div>
            </Card>
          </a>
          <a
            href="https://www.youtube.com/@jugendtreffenkremsmuenster"
            target="_blank"
            rel="noreferrer"
          >
            <Card description="Schau dich auf unserm Youtube-Kanal um">
              <div className="flex flex-row gap-2 mb-2">
                <img className="h-7" src="/youtube-white.png" alt="logo" />
                <h2>@jugendtreffenkremsmuenster</h2>
              </div>
            </Card>
          </a>
        </div>
      </section>
    </>
  )
}

export default DefaultView;
