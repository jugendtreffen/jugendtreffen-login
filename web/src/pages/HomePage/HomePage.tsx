import { Metadata } from "@redwoodjs/web";

import { motion } from "framer-motion";
import { useAuth } from "src/auth";
import EventsCell from "src/components/EventsCell";
import LoadingSpinner from "src/components/Loading/LoadingSpinner";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "src/components/Icons/Icons";
import Accordion from "src/components/Accordion/Accordion";
import { HomePageAccordionItems } from "src/pages/HomePage/HomepageAccordionItems";
import Card from "src/components/Card/Card";
import { navigate, routes } from "@redwoodjs/router";

const HomePage = () => {
  const { loading, isAuthenticated } = useAuth();
  const images = [
    "/A9A06698.webp",
    "/A9A07019.webp",
    "/DSC08102.webp"
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <>
        <Metadata title="Home" description="Home page" />
        <LoadingSpinner />
      </>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <Metadata title="Dashboard" description="Home Page" />
        <EventsCell />
      </>
    );
  }

  return (
    <>
      <Metadata title="Home" description="Home page" />

      <section id="hero section" className="w-screen-minus-scrollbar">
        <div
          className="absolute w-screen-minus-scrollbar h-screen inset-0 flex flex-col gap-2 items-center justify-center text-center bg-black bg-opacity-60 z-10">
          <h1>Jugendtreffen</h1>
          <h2>15. bis 20. Juli 2025 in Kremsmünster</h2>
          <button className="primary inline-flex items-center mt-4" onClick={() => navigate(routes.participate())}>
            <h3>Teilnehmen</h3>
            <ArrowRightIcon />
          </button>
        </div>
        <motion.div
          className="flex transition-all duration-500"
          animate={{ x: `-${index * (100 / images.length)}%` }}
          transition={{ ease: "linear", duration: 0.8 }}
          style={{ width: `calc(${images.length * 100}vw - ${images.length * 16}px)` }}
        >
          {images.map((src, i) => (
            <img key={i} src={src} alt={`Slide ${i}`} className="w-screen-minus-scrollbar h-screen object-cover flex-shrink-0" />
          ))}
        </motion.div>
      </section>

      <section id="FAQ" className="flex flex-col px-6 md:px-12 mx-auto lg:py-0 h-full my-12 gap-2">
        <h1>Infos & Facts</h1>
        <div className="w-full lg:w-2/3 ">
          <Accordion items={HomePageAccordionItems} />
        </div>
      </section>

      <section id="Stories" className="flex flex-col p-6 md:px-12 mx-auto lg:py-0 h-full w-full my-12">
        <h1>Stories</h1>
        <h2 className="text-red-500 mb-4">Hier brauch ich Ideen & Content zum hinschreiben</h2>
        <Card
          title="David G."
          description="Hier die Geschichte, Idee, whatever einfüllen">
        </Card>
      </section>

    </>
  );
};

export default HomePage;
