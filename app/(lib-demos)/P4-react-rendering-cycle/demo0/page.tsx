"use client";

import React, { useEffect, useState } from "react";

const Page = () => {
  useEffect(() => {
    console.log("Effect running");

    return () => {
      console.log("Cleanup from previous effect");
    };
  }, []);

  return <div>just a useEffect</div>;
};

export default Page;
