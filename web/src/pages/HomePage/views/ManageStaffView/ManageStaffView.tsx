import React from 'react';
import {Metadata} from "@redwoodjs/web";
import StaffCell from "@/components/StaffCell/StaffCell"

const ManageStaffView = () => {
  return (
    <>
      <Metadata title="Mitarbeiter verwalten" />

      <section className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-bold">Staff verwalten</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Weise Benutzern Rollen zu oder entferne sie. Änderungen werden
            sofort in den Supabase App-Metadaten gespeichert.
          </p>
        </div>
        <StaffCell />
      </section>
    </>
  )
};

export default ManageStaffView;
