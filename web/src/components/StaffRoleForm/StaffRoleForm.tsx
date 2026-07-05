import { useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Muss synchron mit getSidebarItemsByRole in SidebarLayout.tsx bleiben
const AVAILABLE_ROLES = [
  { value: 'checkin', label: 'Check-in' },
  { value: 'quartier_boys', label: 'Quartier Burschen' },
  { value: 'quartier_girls', label: 'Quartier Mädchen' },
  { value: 'admin', label: 'Admin' },
]

const NO_ROLE_VALUE = 'none'

type StaffUser = { id: string; email: string; role: string | null }

type Props = {
  user: StaffUser
  onRoleChange: (userId: string, role: string | null) => void
  isSaving: boolean
}

const StaffRoleForm = ({ user, onRoleChange, isSaving }: Props) => {
  const [selectedRole, setSelectedRole] = useState<string>(
    user.role ?? NO_ROLE_VALUE
  )
  const isDirty = selectedRole !== (user.role ?? NO_ROLE_VALUE)

  const handleSave = () => {
    onRoleChange(user.id, selectedRole === NO_ROLE_VALUE ? null : selectedRole)
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.email}</p>
          <p className="text-xs text-muted-foreground">{user.id}</p>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor={`role-${user.id}`} className="sr-only">
            Rolle für {user.email}
          </Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger id={`role-${user.id}`} className="w-40">
              <SelectValue placeholder="Keine Rolle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_ROLE_VALUE}>
                <span className="text-muted-foreground">Keine Rolle</span>
              </SelectItem>
              {AVAILABLE_ROLES.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            title="Speichern"
          >
            <Save className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Speichern</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default StaffRoleForm
