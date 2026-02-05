import {ReactNode, useEffect, useState} from 'react'

import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "src/components/ui/card";
import YouTube from "react-youtube";

function CardAction(props: { children: ReactNode }) {
  return null;
}

const DefaultView = () => {
  const images = ['/A9A06698.webp', '/A9A07019.webp', '/DSC08102.webp']
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Metadata title="Home" description="Home page" />

      <section
        id="hero section"
      >
        <div className="absolute w-screen h-screen inset-0 flex flex-col gap-2 items-center justify-center text-center bg-transparent z-10">
          <h1 className={'md:text-7xl'}>Jugendtreffen</h1>
          <h2 className={'md:text-2xl'}>
            15. bis 20. Juli 2025 in Kremsmünster
          </h2>
          <button
            className="primary inline-flex items-center mt-4"
            onClick={() => navigate(routes.signup())}
          >
            <h2>Teilnehmen</h2>
          </button>
        </div>
        <div className="relative top-0 left-0 w-screen h-screen">
          <YouTube
            videoId={"EthdSsl3DT8"}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 1,
                mute: 1,           // Muss muted sein für autoplay
                loop: 1,
                playlist: "EthdSsl3DT8", // Für Loop playlist = videoId
                controls: 0,
                showinfo: 0,
                modestbranding: 1,
                fs: 0,
                cc_load_policy: 0,
                iv_load_policy: 3,
                autohide: 1,
              },
            }}
            onReady={(event: any) => {
              event.target.mute()
              event.target.playVideo()
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-[56.25vw] min-h-screen min-w-[177.78vh]"
          />
        </div>
      </section>

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
            <Card className="w-fit">
              <CardHeader>
                <CardDescription>Mehr Infos auf unserer</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row">
                <img
                  className="h-8 rounded-full"
                  src="/website-white.png"
                  alt="logo"
                />
                <h2 className="ml-2">Website</h2>
              </CardContent>
            </Card>
          </a>
          <a
            href="https://www.instagram.com/jugendtreffen/"
            target="_blank"
            rel="noreferrer"
          >
            <Card className="w-fit">
              <CardHeader>
                <CardDescription>Folge uns auf Instagramm</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row">
                <img
                  className="h-8 rounded-full"
                  src="/instagramm-white.png"
                  alt="logo"
                />
                <h2 className="ml-2">jugendtreffen</h2>
              </CardContent>
            </Card>
          </a>
          <a
            href="https://open.spotify.com/playlist/5tiCqfN1eIQtjmtRklgP2Q"
            target="_blank"
            rel="noreferrer"
          >
            <Card className="w-fit">
              <CardHeader>
                <CardDescription>Stimm dich mit unserer Playlist ein</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row">
                <img
                  className="h-8 rounded-full"
                  src="/spotify-white.png"
                  alt="logo"
                />
                <h2 className="ml-2">Jugendtreffen 2024 Worship</h2>
              </CardContent>
            </Card>
          </a>
          <a
            href="https://www.youtube.com/@jugendtreffenkremsmuenster"
            target="_blank"
            rel="noreferrer"
          >
            <Card className="w-fit">
              <CardHeader>
                <CardDescription>Schau dich auf unserm Youtube-Kanal um</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row">
                <img
                  className="h-8 rounded-full"
                  src="/youtube-white.png"
                  alt="logo"
                />
                <h2 className="ml-2">@jugendtreffenkremsmuenster</h2>
              </CardContent>
            </Card>
          </a>
        </div>
      </section>
    </>
  )
}

export default DefaultView
