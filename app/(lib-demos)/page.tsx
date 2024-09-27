import Link from "next/link";

type ContentItem = {
  title: string;
  path: string;
  style?: string;
};

const content: ContentItem[] = [
  {
    title: "P1: react libs",
    path: "/P1-react-libs/",
    style: "text-red-500 underline",
  },
  {
    title: "P2: js libs",
    path: "/P2-js-libs/",
  },
  {
    title: "P3: react design patterns",
    path: "/P3-react-design-patterns/",
  },
];

export default function Home() {
  return (
    <>
      <h2 className="text-red-500">
        {" "}
        try to keep each page as independent as possible
      </h2>
      {content.map((item) => (
        <Link key={item.title} href={item.path}>
          <h1 className={`text-2xl font-bold ${item.style ?? ""}`}>
            {item.title}
          </h1>
        </Link>
      ))}
    </>
  );
}
