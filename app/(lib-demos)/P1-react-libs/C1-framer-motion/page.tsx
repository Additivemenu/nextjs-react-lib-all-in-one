import PageWithAccordions from "@/components/pages/page-with-accordions";

const page = () => {
  return (
    <>
      <PageWithAccordions
        demos={[{ title: "Demo 1: framer motion", path: "/demo1/" }]}
      />
    </>
  );
};

export default page;
