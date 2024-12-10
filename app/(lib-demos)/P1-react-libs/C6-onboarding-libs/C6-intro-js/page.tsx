"use client";

import React from "react";
import PageWithAccordions from "@/components/pages/page-with-accordions";

const demos = [
  {
    title: "Demo 1: read large excel file certain row",
    path: "/demo1/",
    style: " underline",
    description:
      "only read a certain row from a large excel file with web worker, but no caching",
    links: [
      {
        name: "useMutation official doc",
        link: "https://tanstack.com/query/latest/docs/framework/react/guides/mutations",
      },
    ],
  },
  {
    title: "Demo 1-1: programmatically moving to next step",
    path: "/demo1-1/",
    style: " underline",
    description:
      "continuing demo1, programmatically moving to next step, instead of click on next button in popover",
  },
  {
    title: "Demo 1-2: see if work on modal",
    path: "/demo1-2/",
    style: " underline text-red-500",
    description:
      "continuing demo1-1, see if intro.js work on modal dialog (dynamically added component) and the answer is likely a no",
  },
  {
    title: "Demo 1-3: see if can break and resume",
    path: "/demo1-3/",
    style: " underline",
    description:
      "continuing demo1-2, see if driver.js work on breaking tour in the middle and then resume back, and the answer is likely a no",
  },
  {
    title: "Demo 2: advanced onboarding",
    path: "/demo2/",
    style: " underline",
    description: "upgrade from demo1, with caching mechanism",
  },
];

/**
 * still a bit problematic
 *
 * need to check:
 * - if we can move to next step programmatically? - yes
 *   - !in our case, moving to next step can be triggered by a variety of events, such as clicking on a button, user drag over a node, ....
 *   - async tour might be useful in this case https://driverjs.com/docs/async-tour
 * - if the onboarding popover can disable clicking on outside of the popover? - yes
 *   - but for user drag and drop a node onto canvas, if we disable the clicking outside of the popover, the user can't drag and drop the node (only click on the node)
 * - can the element in step3, 5 be the same? - yes
 * 
 * challenges: depending on how we design the user onboarding flow
 *! - a challenge is that how to resume back to previous step if a state change has been made 
 *! - another challenge is that how to stop the tour steps (consecutive popover and popover overlays) in the middle and then resume back
      - actually, allowing user to stop the tour in the middle and then resume back is not a good idea, as it will introduces too many edge cases and complexity
 *! - another challenge is how to allow user to drag and drop a node onto canvas while the popover is still open, the popover will block areas not highlighted
      - a solution can be just allow user to click on the node icon in left sidebar to create node on canvas
      - or is it possible to highlight multiple elements at the same time in one step?
 *
 * @returns
 */
const Page: React.FC = () => {

  return <PageWithAccordions demos={demos} />;
};

export default Page;
