import { useEffect, useRef } from 'react'

import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { ArrowRight } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from 'src/components/ui/card'
import { RollingText } from '@/components/animate-ui/primitives/texts/rolling'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentEvent } from '@/hooks/CurrenteventHook'
import { formatDayMonth, formatYear } from '@/lib/utils'

const DefaultView = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { loading, currentEvent } = useCurrentEvent()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => video.play()

    video.addEventListener('canplay', handleCanPlay, { once: true })
    return () => video.removeEventListener('canplay', handleCanPlay)
  }, [])

  return (
    <>
      <Metadata title="Home" description="Home page" />

      <section id="hero section">
        <div className="absolute w-screen h-screen inset-0 flex flex-col gap-2 items-center justify-center text-center bg-transparent z-10">
          <RollingText
            className="text-4xl md:text-7xl font-bold text-primary"
            text="Jugendtreffen"
          ></RollingText>
          {loading ? (
            <Skeleton className={'w-md max-w-2xl h-8 py-1'} />
          ) : (
            <h2 className={'md:text-2xl'}>
              {formatDayMonth(currentEvent?.startDate)} bis{' '}
              {formatDayMonth(currentEvent?.endDate)}{' '}
              {formatYear(currentEvent?.endDate)} in Kremsmünster
            </h2>
          )}
          <Button onClick={() => navigate(routes.eventRegistration())}>
            Teilnehmen
            <ArrowRight />
          </Button>
        </div>
        <video
          ref={videoRef}
          src="/aftermovie2025.webm"
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
          className="top-0 left-0 w-screen min-h-screen min-w-[177.78vh]"
        />
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
                <CardDescription>
                  Stimm dich mit unserer Playlist ein
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row">
                <img
                  className="h-8 rounded-full"
                  src="/spotify-white.png"
                  alt="logo"
                />
                <h2 className="ml-2">Jugendtreffen Worship</h2>
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
                <CardDescription>
                  Schau dich auf unserm Youtube-Kanal um
                </CardDescription>
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
