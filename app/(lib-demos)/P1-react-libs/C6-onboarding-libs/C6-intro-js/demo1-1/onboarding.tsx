"use client";
import React, { useEffect, useState } from "react";
import introJs from "intro.js";
import { IntroJs } from "intro.js/src/intro";
import { Options } from "intro.js/src/option";
import "intro.js/minified/introjs.min.css";

/**
 *
 * check on programmatically moving to next step
 *
 * @returns
 */
const OnboardingDemo = () => {
  const [intro, setIntro] = useState<IntroJs | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

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
          element: "#help-section",
          title: "Almost Done!",
          intro: 'Click the "Contact Support" button to move forward!',
          position: "top",
          tooltipClass: "custom-tooltip-4",
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

    introInstance.onbeforechange(() => {
      const currentStepElement = introInstance._currentStep;
      setCurrentStep(currentStepElement);

      return true;
    });

    setIntro(introInstance);
    introInstance.start();

    return () => {
      introInstance.exit(false);
    };
  }, []);

  const handleFeatureClick = (featureIndex: number) => {
    if (intro && currentStep === 1) {
      // Feature section step
      intro.nextStep();
    }
  };

  const handleProfileClick = () => {
    if (intro && currentStep === 2) {
      intro.nextStep();
    }
  };

  const handleSupportClick = () => {
    if (intro && currentStep === 3) {
      intro.nextStep();
    }
  };

  const handleGetStarted = () => {
    if (intro && currentStep === 0) {
      intro.nextStep();
    }
  };

  const handleFinish = () => {
    if (intro && currentStep === 4) {
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

// "use client";
// import React, { useEffect, useState } from "react";
// import introJs from "intro.js";
// import { IntroJs } from "intro.js/src/intro";
// import { Options } from "intro.js/src/option";

// import "intro.js/minified/introjs.min.css";

// const Onboarding = () => {
//   const [intro, setIntro] = useState<IntroJs | null>(null);
//   const [currentStep, setCurrentStep] = useState(0);

//   useEffect(() => {
//     // Initialize intro.js
//     const introInstance = introJs();

//     introInstance.setOptions({
//       steps: [
//         {
//           element: "#welcome-header",
//           title: "Welcome to Our App",
//           intro: "Let us show you around our main features!",
//           position: "bottom-left-aligned",
//         },
//         {
//           element: "#feature-section",
//           title: "Key Features",
//           intro: "Discover all the powerful features we offer",
//           position: "right",
//         },
//         {
//           element: "#user-profile",
//           title: "Your Profile",
//           intro:
//             'Click the Edit Profile button to continue!  <img src="https://images.unsplash.com/photo-1608096299210-db7e38487075?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" /> ',
//           position: "left",
//           tooltipClass: "hidden-buttons", // ! Custom class to hide default buttons
//         },
//         {
//           element: "#help-section",
//           title: "Need Help?",
//           intro: "Our support team is always here to help!",
//           position: "top",
//         },
//       ],
//       showProgress: true,
//       exitOnOverlayClick: false,
//       exitOnEsc: false,
//       showBullets: true,
//       showButtons: true,
//     } as Options);

//     // hooks registration ------------------------------------------------------
//     // Track step changes
//     introInstance.onbeforechange((targetElement) => {
//       //   debugger;

//       const currentStepElement = introInstance._currentStep;
//       setCurrentStep(currentStepElement);

//       // If we're on the profile step, hide the next button
//       if (currentStepElement === 2) {
//         document.querySelector(".introjs-nextbutton")?.classList.add("hidden");
//       } else {
//         document
//           .querySelector(".introjs-nextbutton")
//           ?.classList.remove("hidden");
//       }

//       return true;
//     });

//     setIntro(introInstance);
//     introInstance.start();

//     return () => {
//       introInstance.exit(false);
//     };
//   }, []);

//   const handleProfileClick = () => {
//     console.log("handleProfileClick, currentStep is", currentStep);

//     // If we're on the profile step (index 2), move to next step
//     if (intro && currentStep === 2) {
//       intro.nextStep();
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 id="welcome-header" className="text-2xl font-bold mb-4">
//         Welcome to Our Platform
//       </h1>

//       <div id="feature-section" className="mb-4 p-4 border rounded">
//         <h2 className="text-xl font-semibold">Features</h2>
//         <ul className="mt-2">
//           <li>Advanced Analytics</li>
//           <li>Team Collaboration</li>
//           <li>Real-time Updates</li>
//         </ul>
//       </div>

//       <div id="user-profile" className="mb-4 p-4 border rounded">
//         <h2 className="text-xl font-semibold">Profile Settings</h2>
//         <div className="mt-2">
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//             onClick={handleProfileClick}
//           >
//             Edit Profile
//           </button>
//         </div>
//       </div>

//       <div id="help-section" className="p-4 border rounded">
//         <h2 className="text-xl font-semibold">Help Center</h2>
//         <p className="mt-2">Need assistance? Contact our support team 24/7.</p>
//       </div>

//       <style jsx global>{`
//         .hidden-buttons .introjs-nextbutton {
//           display: none !important;
//         }
//         .hidden {
//           display: none !important;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Onboarding;
