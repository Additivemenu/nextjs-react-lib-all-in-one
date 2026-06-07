import PageWithAccordions from "@/components/pages/page-with-accordions";

const page = () => (
  <PageWithAccordions
    demos={[
      {
        title: "Demo 1: basic JavaScript editor (vanilla TS + iframe)",
        path: "/demo1/",
      },
    ]}
  />
);

export default page;
