import type {ReactNode} from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'
import {BarChart3, Table2} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from 'src/components/ui/tabs'

type DashboardSectionCardProps = {
  title: string
  description?: string
  chart: ReactNode
  table?: ReactNode
  chartLabel?: string
  tableLabel?: string
}

const DashboardSectionCard = ({
                                title,
                                description,
                                chartLabel = 'Chart',
                                tableLabel = 'Tabelle',
                                chart,
                                table,
                              }: DashboardSectionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="mb-4 grid w-full max-w-[280px] grid-cols-2">
            <TabsTrigger value="chart" className="gap-2">
              <BarChart3 className="h-4 w-4"/>
              {chartLabel}
            </TabsTrigger>
            {table && (
              <TabsTrigger value="table" className="gap-2">
                <Table2 className="h-4 w-4"/>
                {tableLabel}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="chart" className="mt-0">
            {chart}
          </TabsContent>

          <TabsContent value="table" className="mt-0">
            {table}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default DashboardSectionCard
