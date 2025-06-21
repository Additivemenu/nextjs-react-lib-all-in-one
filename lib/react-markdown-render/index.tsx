import React from "react";
import { createRoot } from "react-dom/client";
import Markdown from "react-markdown";

const markdown = `Just a link: www.nasa.gov.`;

createRoot(document.body).render(<Markdown>{markdown}</Markdown>);
