import PageWithAccordions from "@/components/pages/page-with-accordions";
import React from "react";

const demos = [
  {
    title: "Demo 4: mutation observer + react chatbotify",
    path: "/demo4/",
  },
  {
    title: "Demo 4-1: useEffect + react chatbotify -> not working actually",
    path: "/demo4-1/",
  },
  {
    title: "Demo 4-2: mutation observer + react chatbotify + SSE",
    path: "/demo4-2/",
  },
  {
    title:
      "Demo 4-3: mutation observer + react chatbotify + SSE + context encapsulation in ref",
    path: "/demo4-3/",
  },
];

const Page = () => {
  return (
    <>
      <PageWithAccordions demos={demos} />
    </>
  );
};

export default Page;
