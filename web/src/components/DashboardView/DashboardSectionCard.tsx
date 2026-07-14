import type { ReactNode } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'

type DashboardSectionCardProps = {
  title: string
  description?: string
  children: ReactNode
}

const DashboardSectionCard = ({
                                title,
                                description,
                                children,
                              }: DashboardSectionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default DashboardSectionCard
