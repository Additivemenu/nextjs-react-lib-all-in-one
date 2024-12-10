"use client";
import React, { useEffect } from "react";
import introJs from "intro.js";
import "intro.js/minified/introjs.min.css";

const Onboarding = () => {
  useEffect(() => {
    // Initialize intro.js
    const intro = introJs();

    // Configure the steps
    intro.setOptions({
      steps: [
        {
          element: "#welcome-header",
          title: "Welcome to Our App",
          intro: "Let us show you around our main features!",
          position: "bottom-left-aligned",
        },
        {
          element: "#feature-section",
          title: "Key Features",
          intro: "Discover all the powerful features we offer",
          position: "right",
        },
        {
          element: "#user-profile",
          title: "Your Profile",
          intro: "Manage your settings and preferences here",
          position: "left",
        },
        {
          element: "#help-section",
          title: "Need Help?",
          intro: "Our support team is always here to help!",
          position: "top",
        },
      ],
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      showStepNumbers: true,
    });

    // Start the tour when component mounts
    intro.start();

    return () => {
      // Cleanup
      intro.exit(false);
    };
  }, []);

  return (
    <div className="p-6">
      <h1
        id="welcome-header"
        className="text-2xl font-bold mb-4"
        data-intro="Let us show you around our main features!"
        data-title="Welcome to Our App"
      >
        Welcome to Our Platform
      </h1>

      <div
        id="feature-section"
        className="mb-4 p-4 border rounded"
        data-intro="Discover all the powerful features we offer"
        data-title="Key Features"
      >
        <h2 className="text-xl font-semibold">Features</h2>
        <ul className="mt-2">
          <li>Advanced Analytics</li>
          <li>Team Collaboration</li>
          <li>Real-time Updates</li>
        </ul>
      </div>

      <div
        id="user-profile"
        className="mb-4 p-4 border rounded"
        data-intro="Manage your settings and preferences here"
        data-title="Your Profile"
      >
        <h2 className="text-xl font-semibold">Profile Settings</h2>
        <div className="mt-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Edit Profile
          </button>
        </div>
      </div>

      <div
        id="help-section"
        className="p-4 border rounded"
        data-intro="Our support team is always here to help!"
        data-title="Need Help?"
      >
        <h2 className="text-xl font-semibold">Help Center</h2>
        <p className="mt-2">Need assistance? Contact our support team 24/7.</p>
      </div>
    </div>
  );
};

export default Onboarding;
