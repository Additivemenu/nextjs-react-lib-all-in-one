"use client";
import React, { useEffect, useState, useRef } from "react";
import { Config as DriverConfig, Driver, driver } from "driver.js";
import "driver.js/dist/driver.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { set } from "zod";

/**
 *
 * https://driverjs.com/docs/async-tour
 *
 * @returns
 *
 */
const OnboardingDemo = () => {
  const [driverObj, setDriverObj] = useState<Driver | null>(null);
  // const [currentStep, setCurrentStep] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const stepIndex = useRef(0);

  const driverConfig: DriverConfig = {
    showProgress: true,
    allowClose: false,
    popoverOffset: 2,
    onHighlightStarted: (element, step, option) => {
      // debugger;
      // if (step.element === "#user-profile") {
      //   setCurrentStep(2);
      // }
    },
    steps: [
      {
        element: "#welcome-header",
        popover: {
          title: "Welcome to Our App",
          description: "Let us show you around our main features!",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#feature-section",
        popover: {
          title: "Key Features",
          description: "Discover all the powerful features we offer",
          side: "right",
        },
      },
      {
        element: "#user-profile",
        popover: {
          title: "Your Profile",
          description: "Click the Edit Profile button to continue!",
          side: "left",
          onNextClick: (element, step) => {
            setShowDialog(true);

            // ! basically need to wait for the dialog to open before moving to the next step
            setTimeout(() => {
              driverObj?.moveNext();
            }, 200);
          },
        },
      },
      {
        element: "#profile-modal",
        popover: {
          title: "Profile Settings",
          description: "Click 'Save Changes' to continue the tour!",
          side: "right",
          onNextClick: (element, step) => {
            setShowDialog(false);

            // ! basically need to wait for the dialog to open before moving to the next step
            setTimeout(() => {
              driverObj?.moveNext();
            }, 200);
          },
        },
      },
      {
        element: "#help-section",
        popover: {
          title: "Need Help?",
          description: "Our support team is always here to help!",
          side: "top",
          // onNextClick: (element, step) => {
          // // ! FIXME:  how TO stop the tour temporarily and then resume?
          //   debugger;
          //   // ! how to hide the popover temporarily?
          //   stepIndex.current = driverObj?.getActiveIndex()!;
          //   driverObj?.destroy();
          // },
        },
      },
      {
        element: "#final-section",
        popover: {
          title: "Final Section",
          description: "Farewell! This is the end of the tour",
          side: "top",
          showButtons: ["close", "next"],
        },
      },
    ],
  };

  useEffect(() => {
    // Initialize driver.js
    const driverInstance = driver(driverConfig);
    setDriverObj(driverInstance);
    driverInstance.drive();

    return () => {
      driverInstance.destroy();
    };
  }, []);

  // ! DOM manipulation are not working as driver.js manipulate body element
  // const hidePopover = () => {
  //   const popover = document.querySelector(".driver-popover") as HTMLElement;
  //   if (popover && popover.style.display !== "none") {
  //     popover.style.display = "none";
  //     popover.style.visibility = "hidden";
  //     popover.style.zIndex = "-1";
  //   }

  //   const popoverOverlay = document.querySelector(
  //     ".driver-overlay",
  //   ) as HTMLElement;
  //   if (popoverOverlay && popoverOverlay.style.display !== "none") {
  //     popoverOverlay.style.display = "none";
  //     popoverOverlay.style.visibility = "hidden";
  //     popoverOverlay.style.zIndex = "-1";
  //   }
  // };

  // const showPopover = () => {
  //   const popover = document.querySelector(".driver-popover") as HTMLElement;
  //   if (popover && popover.style.display !== "block") {
  //     popover.style.display = "block";
  //     popover.style.visibility = "visible";
  //     popover.style.zIndex = "100000";
  //   }

  //   const popoverOverlay = document.querySelector(
  //     ".driver-overlay",
  //   ) as HTMLElement;
  //   if (popoverOverlay && popoverOverlay.style.display !== "block") {
  //     popoverOverlay.style.display = "block";
  //     popoverOverlay.style.visibility = "visible";
  //     popoverOverlay.style.zIndex = "1000000000";
  //   }
  // };

  // ! This function is called when the user clicks the "Edit Profile" button
  const handleProfileClick = () => {
    setShowDialog(true);

    // ! basically need to wait for the dialog to open before moving to the next step
    setTimeout(() => {
      if (driverObj && driverObj?.hasNextStep()) {
        driverObj.moveNext();
      }
    }, 200);
  };

  const handleSaveChanges = () => {
    setShowDialog(false);

    // ! basically need to wait for the dialog to open before moving to the next step
    setTimeout(() => {
      if (driverObj && driverObj?.hasNextStep()) {
        driverObj.moveNext();
      }
    }, 200);
  };

  return (
    <>
      <div className="p-6">
        <h1 id="welcome-header" className="text-2xl font-bold mb-4">
          Welcome to Our Platform
        </h1>

        <div id="feature-section" className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Features</h2>
          <ul className="mt-2">
            <li>Advanced Analytics</li>
            <li>Team Collaboration</li>
            <li>Real-time Updates</li>
          </ul>
        </div>

        <div id="user-profile" className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          <div className="mt-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleProfileClick}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div id="help-section" className="p-4 border rounded mb-4">
          <h2 className="text-xl font-semibold">Help Center</h2>
          <p className="mt-2">
            Need assistance? Contact our support team 24/7.
          </p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {}}
          >
            help!
          </button>
        </div>

        <div id="should-not-highlight" className="p-4 border rounded mb-4">
          <h2 className="text-xl font-semibold">
            this should not be highlighted by tour
          </h2>
          <p className="mt-2">do not highlight me</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              // resume the tour
              const newDriverInstance = driver(driverConfig);
              setDriverObj(newDriverInstance);
              newDriverInstance.drive(stepIndex.current);

              // ! how to check if next step is a particular step?
              setTimeout(() => {
                // wait for driveObj to be updated
                if (driverObj?.hasNextStep()) {
                  driverObj?.moveNext();
                }
              }, 200);
            }}
          >
            click me to final!{" "}
          </button>
        </div>

        <div id="final-section" className="p-4 border rounded">
          <h2 className="text-xl font-semibold">Final section</h2>
          <p className="mt-2">
            about to end the tour, this is the final section
          </p>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          ref={dialogRef}
          id="profile-modal"
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Edit Your Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OnboardingDemo;
