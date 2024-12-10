import PageWithAccordions from "@/components/pages/page-with-accordions";
import React from "react";

const demos = [
  {
    title: "C6 driver.js",
    path: "/C6-driver-js/",
    style: "text-red-500 underline",
  },
  {
    title: "C6 intro.js",
    path: "/C6-intro-js/",
    style: "text-red-500 underline",
  },
  {
    title: "C6 react joyride",
    path: "/C6-react-joyride/",
    style: "text-red-500 underline",
  },
];

const Page = () => {
  return (
    <div>
      <PageWithAccordions demos={demos} />
    </div>
  );
};

export default Page;
