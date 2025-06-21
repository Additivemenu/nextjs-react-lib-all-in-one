import PageWithAccordions from "@/components/pages/page-with-accordions";

const content = [
  {
    title: "demo-1: simple modal",
    path: "/demo-1/",
    style: "text-red-500 underline",
  },
  {
    title: "demo-2: modal manager",
    path: "/demo-2/",
    style: "text-blue-500 underline",
    description:
      "A modal manager that allows you to open multiple modals at once and close them in a stack.",
  },
];

export default function Page() {
  return (
    <>
      <PageWithAccordions demos={content} />
    </>
  );
}
