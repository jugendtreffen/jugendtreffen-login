import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function ParticipantsFilters({ table }) {
  return (
    <div className="flex flex-row items-center gap-2 flex-nowrap">
      <Select
        onValueChange={(value) =>
          table.getColumn("gender")?.setFilterValue(
            value === "all" ? undefined : value
          )
        }
      >
        <SelectTrigger className="h-8 w-[160px]">
          <SelectValue placeholder="Geschlecht" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Alle</SelectItem>
          <SelectItem value="male">Burschen</SelectItem>
          <SelectItem value="female">Mädchen</SelectItem>
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) =>
          table.getColumn("age")?.setFilterValue(
            value === "all" ? undefined : value
          )
        }
      >
        <SelectTrigger className="h-8 w-[160px]">
          <SelectValue placeholder="Alter" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Alle</SelectItem>
          <SelectItem value="under18">Unter 18</SelectItem>
          <SelectItem value="18plus">18+</SelectItem>
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) =>
          table.getColumn("accommodation")?.setFilterValue(
            value === "all" ? undefined : value
          )
        }
      >
        <SelectTrigger className="h-8 w-[180px]">
          <SelectValue placeholder="Unterkunft" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Alle</SelectItem>
          <SelectItem value="jugendtreffen">Quartier beim Jugendtreffen</SelectItem>
          <SelectItem value="subiaco">Haus Subiaco</SelectItem>
          <SelectItem value="private">Privat</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
