"use client";
import React, { useEffect, useRef, useState } from "react";
import introJs from "intro.js";
import { IntroJs } from "intro.js/src/intro";
import { Options } from "intro.js/src/option";
import "intro.js/minified/introjs.min.css";

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
 * check on programmatically moving to next step
 *
 * @returns
 */
const OnboardingDemo = () => {
  const [intro, setIntro] = useState<IntroJs | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const [showDialog, setShowDialog] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const introInstance = introJs();

    introInstance.setOptions({
      steps: [
        {
          element: "#welcome-header",
          title: "Welcome to Our App",
          intro: 'Click the "Get Started" button to begin the tour!',
          position: "bottom-left-aligned",
          tooltipClass: "custom-tooltip-1",
        },
        {
          element: "#feature-section",
          title: "Key Features",
          intro: "Click any feature to learn more!",
          position: "right",
          tooltipClass: "custom-tooltip-2",
        },
        {
          element: "#user-profile",
          title: "Your Profile",
          intro: "Click the Edit Profile button to continue!",
          position: "left",
          tooltipClass: "custom-tooltip-3",
        },
        {
          element: "#profile-modal",
          title: "Edit Profile",
          intro: "Click on the save button to proceed!",
          position: "right",
          tooltipClass: "custom-tooltip-4",
        },
        {
          element: "#help-section",
          title: "Almost Done!",
          intro: 'Click the "Contact Support" button to move forward!',
          position: "top",
          tooltipClass: "custom-tooltip-5",
        },
        {
          element: "#completion-section",
          title: "All Set!",
          intro: "You've completed the tour. Click Finish to end.",
          position: "right",
        },
      ],
      showProgress: true,
      exitOnOverlayClick: false,
      exitOnEsc: false,
      showBullets: true,
      showButtons: false, // Hide default navigation buttons, so user completely follows the guided tour to the end
      disableInteraction: false,
    } as Options);

    // ! hook run before entering next step
    introInstance.onbeforechange(async () => {
      const currentStepElement = introInstance._currentStep; // actually the next step number
      setCurrentStep(currentStepElement);

      console.log("current step number is", currentStepElement);

      if (currentStepElement === 3) {
        return new Promise((resolve) => {
          console.log("Performing I/O...");

          setTimeout(() => {
            console.log("I/O complete");
            resolve(true);
          }, 2000);
        });
      }

      return true;
    });

    setIntro(introInstance);
    introInstance.start();

    return () => {
      introInstance.exit(false);
    };
  }, []);

  const handleGetStarted = () => {
    if (intro && currentStep === 0) {
      intro.nextStep();
    }
  };

  const handleFeatureClick = (featureIndex: number) => {
    if (intro && currentStep === 1) {
      // Feature section step
      intro.nextStep();
    }
  };

  const handleProfileClick = () => {
    if (intro && currentStep === 2) {
      setShowDialog(true);

      // ! basically need to wait for the dialog to open before moving to the next step
      setTimeout(() => {
        intro.nextStep(); // ! this will trigger onbeforechange hook as well
      }, 200);
    }
  };

  const handleSaveChanges = () => {
    setShowDialog(false);

    if (intro && currentStep === 3) {
      // Profile modal step
      intro.nextStep();
    }
  };

  const handleSupportClick = () => {
    if (intro && currentStep === 4) {
      intro.nextStep();
    }
  };

  const handleFinish = () => {
    if (intro && currentStep === 5) {
      intro.exit(false);
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
        .introjs-tooltipbuttons {
          display: none !important;
        }
        .introjs-tooltip {
          min-width: 300px;
        }
        /* Disable bullet clicks while keeping them visible */
        .introjs-bullets ul li a {
          pointer-events: none !important;
          cursor: default !important;
        }
        /* Optional: Make bullets look slightly dimmed to indicate they're not interactive */
        .introjs-bullets ul li a {
          opacity: 0.7;
        }
        .introjs-bullets ul li a.active {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default OnboardingDemo;
