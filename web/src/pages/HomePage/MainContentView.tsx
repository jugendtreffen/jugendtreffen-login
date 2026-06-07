import {Metadata} from '@redwoodjs/web'

import {useSidebar} from 'src/layouts/SidebarLayout/SidebarLayout'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Mail} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/auth";
import ParticipantsCell from "@/components/ParticipantsCell/ParticipantsCell";

const MainContentView = () => {
  const {sidebarItem} = useSidebar()
  const { currentUser } = useAuth()

  if (sidebarItem === 'Join the Team') {
    return (
      <>
        <Metadata title="Join the Team"/>

        <section className="flex flex-col md:flex-row gap-2">
          <div className="md:ml-3 flex flex-col gap-4">

            {currentUser.roles.at(0) == 'none' && <Card>
              <CardHeader>
                <CardTitle>Du bist noch nicht als Mitarbeiter aufgenommen!</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-4 p-6">
                Schreibe zuerst eine Mail an
                <Button asChild size="sm" variant="outline" className="gap-2 h-8">
                <a href="mailto:info@jugendtreffen.at">
                  <Mail className="size-3.5"/>
                  info@jugendtreffen.at
                </a>
              </Button> und frage nach einem Zugang. Es kann auch sein, dass du gar keinen Mitarbeiter Account brauchst.
              </CardContent>
            </Card>}

            <Card className="max-w-xl border-border shadow-sm">
              <CardContent className="flex flex-col items-start gap-4 p-6">

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Du brauchst Zugang zu{" "}
                  <span className="font-medium text-foreground">Checkin</span> oder{" "}
                  <span className="font-medium text-foreground">Quartier</span>?
                </p>

                <div className="flex items-center gap-3 pt-1 flex-wrap">
                  <Button asChild size="sm" variant="outline" className="gap-2 h-8">
                    <a href="mailto:info@jugendtreffen.at">
                      <Mail className="size-3.5"/>
                      info@jugendtreffen.at
                    </a>
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    oder{" "}
                    <span className="font-medium text-foreground">
                      Klemens Muthsam
                    </span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </>
    )
  }

  if (sidebarItem === 'Checkin') {
    return (
      <>
        <Metadata title="Checkin"/>

        <section className="flex flex-col md:flex-row gap-2">
          <ParticipantsCell></ParticipantsCell>
        </section>
      </>
    )
  }

  if (sidebarItem === 'Quartier') {
    return (
      <>
        <Metadata title="Quartier"/>
      </>
    )
  }
  return null
}

export default MainContentView
