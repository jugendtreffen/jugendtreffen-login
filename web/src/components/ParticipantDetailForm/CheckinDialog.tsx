import React, {useState} from 'react';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {Checkbox} from "@/components/animate-ui/components/radix/checkbox";
import {Label} from "@/components/ui/label";
import {Controller} from "@redwoodjs/forms";
import {Button} from "@/components/ui/button";
import {UserCheck} from "lucide-react";

type CheckinDialogProps = {
  onCheckin: () => void,
  saving: boolean,
  acceptPhotos: boolean,
  form: any,
}

const CheckinDialog = ({onCheckin, saving, acceptPhotos, form}: CheckinDialogProps) => {
  const [ageChecked, setAgeChecked] = useState(false)
  const [parentConfirmationChecked, setParentConfirmationChecked] = useState(false)

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Teilnehhmer Einchecken</DialogTitle>
        <DialogDescription>
          Bitte überprüfe noch Folgende Dinge (verpflichtend!)
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            id="ageChecked"
            value={ageChecked}
            onCheckedChange={(value) => setAgeChecked(value as boolean)}
          />
          <Label htmlFor="ageChecked" className="ml-2">
            Ich bestätige, dass das Alter des Teilnehmers korrekt ist und er/sie die Teilnahmebedingungen erfüllt.
          </Label>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            id="parentConfirmationChecked"
            value={parentConfirmationChecked}
            onCheckedChange={(value) => setParentConfirmationChecked(value as boolean)}
          />
          <Label htmlFor="parentConfirmationChecked" className="ml-2">
            Ich bestätige, dass ich die Einverständniserklärung der Eltern habe. (nur bei U18 notwendig)
          </Label>
        </div>
        {!acceptPhotos && (
          <div className="flex flex-row items-center gap-2">
            <Controller
              name={"acceptPhotos"}
              control={form.control}
              render={({field, fieldState}) =>
                <>
                  <Checkbox
                    id="acceptPhotos"
                    value={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  <Label htmlFor="acceptPhotos" className="ml-2">
                    Während dem Treffen werden Fotos und Videos gemacht und Veröffentlicht. Der/die Teilnehmer/Teilnehmerin ist informiert und stimmt zu.
                  </Label>
                </>
              } />
          </div>
        )}
      </div>
      <DialogFooter>
        <DialogClose>
          <Button variant="outline">
            Abbrechen
          </Button>
        </DialogClose>
        <DialogClose>
          <Button onClick={onCheckin} disabled={saving || !ageChecked || !parentConfirmationChecked}>
            Einchecken
            <UserCheck className="h-4 w-4"/>
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default CheckinDialog;
