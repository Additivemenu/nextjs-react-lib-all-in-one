"use client";

import React from "react";
import FormComponent from "./_components/FormComponent";
import { schemaWithRefine, schemaWithSuperRefine } from "./form";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Zod Validation Comparison
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <FormComponent schema={schemaWithRefine} title="Form with refine()" />
        <FormComponent
          schema={schemaWithSuperRefine}
          title="Form with superRefine()"
        />
      </div>
    </div>
  );
}
