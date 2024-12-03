"use client";
import React, { useEffect, useState, useRef } from "react";
import { Driver, driver } from "driver.js";
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

  useEffect(() => {
    // Initialize driver.js
    const driverInstance = driver({
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
                driverInstance.moveNext();
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
                driverInstance.moveNext();
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
            showButtons: ["close", "next"],
          },
        },
      ],
    });

    setDriverObj(driverInstance);
    driverInstance.drive();

    return () => {
      driverInstance.destroy();
    };
  }, []);

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

        <div id="help-section" className="p-4 border rounded">
          <h2 className="text-xl font-semibold">Help Center</h2>
          <p className="mt-2">
            Need assistance? Contact our support team 24/7.
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
