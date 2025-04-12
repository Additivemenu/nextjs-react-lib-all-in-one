"use client";

import FreePlanReminderModal from "@/app/_components/modals/free-plan-reminder-modal";
import ModalManager from "@/components/modal";
import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
  return (
    <ModalManager.Provider manualPlaceholder>
      <div className="flex flex-col gap-4">
        <Button onClick={() => ModalManager.show(FreePlanReminderModal)}>
          Show Modal
        </Button>
      </div>
    </ModalManager.Provider>
  );
};

export default page;
