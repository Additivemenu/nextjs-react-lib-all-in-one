"use client";
import React, { useEffect, useRef, useState } from "react";
import { driver } from "driver.js";
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

const OnboardingDemo = () => {
  const [driverObj, setDriverObj] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const driverInstance = driver({
      showProgress: true,
      allowClose: true,
      steps: [
        {
          element: "#welcome-header",
          popover: {
            title: "Welcome to Our App",
            description: 'Click the "Get Started" button to begin the tour!',
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#feature-section",
          popover: {
            title: "Key Features",
            description:
              "Click any feature to learn more! <img src='https://images.unsplash.com/photo-1608096299210-db7e38487075?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' />",
            side: "right",
          },
        },
        {
          element: "#user-profile",
          popover: {
            title: "Your Profile",
            description: "Click the Edit Profile button to continue!",
            side: "left",
          },
        },
        {
          element: "#profile-modal",
          popover: {
            title: "Edit Profile",
            description: "Click on the save button to proceed!",
            side: "right",
          },
        },
        {
          element: "#help-section",
          popover: {
            title: "Almost Done!",
            description: 'Click the "Contact Support" button to move forward!',
            side: "top",
          },
        },
        {
          element: "#completion-section",
          popover: {
            title: "All Set!",
            description: "You've completed the tour. Click Finish to end.",
            side: "right",
          },
        },
      ],
      onHighlightStarted: (element, step, options) => {
        // Track current step
        const stepIndex = driverInstance.getActiveIndex();
        setCurrentStep(stepIndex!);

        // If we're moving to the modal step, wait for the modal to be ready
        if (stepIndex === 3) {
          return new Promise((resolve) => {
            setTimeout(resolve, 200);
          });
        }
      },
      onDestroyStarted: () => {
        // setShowDialog(false);
        if (
          !driverInstance.hasNextStep() ||
          confirm("Are you sure to exit the tutorial?")
        ) {
          driverInstance.destroy();
        }
      },
      showButtons: [], // Hide default buttons
    });

    setDriverObj(driverInstance);
    driverInstance.drive();

    return () => {
      driverInstance.destroy();
    };
  }, []);

  const handleGetStarted = () => {
    if (driverObj && currentStep === 0) {
      driverObj.moveNext();
    }
  };

  const handleFeatureClick = (featureIndex: number) => {
    if (driverObj && currentStep === 1) {
      driverObj.moveNext();
    }
  };

  const handleProfileClick = () => {
    if (driverObj && currentStep === 2) {
      setShowDialog(true);
      setTimeout(() => {
        driverObj.moveNext();
      }, 200);
    }
  };

  const handleSaveChanges = () => {
    if (driverObj && currentStep === 3) {
      setShowDialog(false);
      driverObj.moveNext();
    }
  };

  const handleSupportClick = () => {
    if (driverObj && currentStep === 4) {
      driverObj.moveNext();
    }
  };

  const handleFinish = () => {
    if (driverObj && currentStep === 5) {
      driverObj.destroy();
    }
  };

  return (
    <div className="p-6">
      <div
        id="welcome-header"
        className="text-2xl font-bold mb-4 flex items-center justify-between"
      >
        <h1>Welcome to Our Platform</h1>
        <button
          onClick={handleGetStarted}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Get Started
        </button>
      </div>

      <div id="feature-section" className="mb-4 p-4 border rounded">
        <h2 className="text-xl font-semibold">Features</h2>
        <ul className="mt-2">
          {[
            "Advanced Analytics",
            "Team Collaboration",
            "Real-time Updates",
          ].map((feature, index) => (
            <li
              key={feature}
              onClick={() => handleFeatureClick(index)}
              className="cursor-pointer hover:text-blue-500 py-1"
            >
              {feature}
            </li>
          ))}
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

      <div id="help-section" className="mb-4 p-4 border rounded">
        <h2 className="text-xl font-semibold">Help Center</h2>
        <p className="mt-2">Need assistance? Our support team is here 24/7.</p>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded mt-2"
          onClick={handleSupportClick}
        >
          Contact Support
        </button>
      </div>

      <div id="completion-section" className="p-4 border rounded">
        <h2 className="text-xl font-semibold">Tour Complete!</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          onClick={handleFinish}
        >
          Finish Tour
        </button>
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

      <style jsx global>{`
        .driver-popover.driverjs-theme {
          min-width: 300px;
        }
        .driver-popover-progress-text {
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default OnboardingDemo;
