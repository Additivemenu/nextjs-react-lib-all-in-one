import React from "react";

const Page = () => {
  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-[500px]">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Pagination + Filtering Form
        </h1>
        <p className="text-purple-600">
          This is a more tricky one as the values of input has dependencies, so
          it is challenging to validate them.
        </p>
        <div className="h-1 bg-purple-600" />

        <form action="">
          <p>header row number: determine the full list of header option list</p>
          <p>cell range: filtering full header option list</p>
          <p>header option list: the resultant options</p>
        </form>
      </div>
    </div>
  );
};

export default Page;
