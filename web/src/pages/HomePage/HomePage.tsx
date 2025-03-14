import { Metadata } from "@redwoodjs/web";

import { motion } from "framer-motion";
import { useAuth } from "src/auth";
import EventsCell from "src/components/EventsCell";
import LoadingSpinner from "src/components/Loading/LoadingSpinner";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "src/components/Icons/Icons";
import Accordion from "src/components/Accordion/Accordion";
import { HomePageAccordionItems } from "src/pages/HomePage/HomepageAccordionItems";

const HomePage = () => {
  const { loading, isAuthenticated } = useAuth()
  const images = [
    "/A9A06698.webp",
    "/A9A07019.webp",
    "/DSC08102.webp"
  ]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, []);

  if (loading) {
    return (
      <>
        <Metadata title="Home" description="Home page" />
        <LoadingSpinner />
      </>
    )
  }

  if (isAuthenticated) {
    return (
      <>
        <Metadata title="Dashboard" description="Home Page" />
        <EventsCell />
      </>
    )
  }

  return (
    <>
      <Metadata title="Home" description="Home page" />

      <section>
        <div
          className="absolute w-screen h-screen inset-0 flex flex-col gap-2 items-center justify-center text-center bg-black bg-opacity-60 z-10">
          <h1>Jugendtreffen</h1>
          <h2>15. bis 20. Juli 2025 in Kremsmünster</h2>
          <button className="primary inline-flex items-center mt-4">
            <h3>Teilnehmen</h3>
            <ArrowRightIcon />
          </button>
        </div>

        <div className="w-full">
          <motion.div
            className="flex w-full h-full transition-all duration-500"
            animate={{ x: `-${index * (100 / images.length)}%` }}
            transition={{ ease: "linear", duration: 0.8 }}
            style={{ width: `${images.length * 100}%` }}
          >
            {images.map((src, i) => (
              <img key={i} src={src} alt={`Slide ${i}`} className="w-screen h-screen object-cover flex-shrink-0" />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="flex flex-col p-6 mx-auto lg:py-0 h-full my-12 ">
        <div className="w-2/3">
          <Accordion items={HomePageAccordionItems}/>

        </div>
      </section>
    </>
  );
};

export default HomePage;
