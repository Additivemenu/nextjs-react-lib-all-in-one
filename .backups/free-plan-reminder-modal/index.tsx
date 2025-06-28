import React from "react";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { useLocalStorage } from "usehooks-ts";

import ModalManager from "@/components/modal";
import { useModal } from "@/components/modal/hook";
import { ModalHocProps } from "@/components/modal/types";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface FreePlanReminderModalProps extends ModalHocProps {
  reminderText: string;
  showReminderCheckbox: boolean;
}

const FreePlanReminderModal: React.FC<FreePlanReminderModalProps> =
  ModalManager.create(({ reminderText, showReminderCheckbox }) => {

    const [showAgain, setShowAgain] = useLocalStorage<boolean>(
      `upgrade_plan_reminder_spoonlee24k@gmail.com`,
      true,
    );
    const modal = useModal();

    return (
      <DialogContent
        className={cn(
          "bg-white font-nunito text-primary-text",
          "h-auto w-[700px] max-w-[700px] p-0",
        )}
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="relative h-40 w-full rounded-lg bg-gradient-to-r from-[#479295] to-[#7dd5d5] pt-8">
          <div className="text-center text-3xl font-semibold text-white">
            Oops!
          </div>
          <Image
            src="/reminder-modals/rhombo-crying.svg"
            alt="Illustration"
            width={210}
            height={210}
            className="absolute left-1/2 top-20 -translate-x-1/2 transform"
          />
          <Image
            src="/reminder-modals/rhombo-shadow.svg"
            alt="Illustration"
            width={210}
            height={33}
            className="absolute -bottom-[136px] left-1/2 -translate-x-1/2 transform"
          />
        </div>
        <p className="mx-20 mt-36 text-center text-sm font-semibold">
          {reminderText}
          <br />
          <br />
          View our{" "}
          <Link
            href="/pricing"
            onClick={() => modal.remove()}
            className="text-neutral hover:link"
          >
            pricing page
          </Link>{" "}
          to find the right plan for you.
        </p>
        <div className="flex items-center justify-center">
          <form action="/api/subscription/portal" method="POST">
            <Button
              className="h-10 rounded-full bg-primary-landing py-0 text-primary-text hover:bg-secondary-landing"
              type="submit"
            >
              Upgrade Now <FaArrowRight className="ml-3" />
            </Button>
          </form>
        </div>
        <div className="mb-4 mr-4 flex items-center justify-end text-xs">
          {!!showReminderCheckbox && (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={!showAgain}
                onChange={() => setShowAgain(!showAgain)}
                className="checkbox-secondary checkbox checkbox-xs [--chkfg:white]"
              />
              <span>Don&apos;t remind me again</span>
            </label>
          )}
        </div>
      </DialogContent>
    );
  });

export default FreePlanReminderModal;
