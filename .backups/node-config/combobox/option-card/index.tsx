import React from "react";

const formatHeader = (header: string) => {
  return header.length > 10 ? `${header.slice(0, 10)}...` : header;
};

const OptionCard: React.FC<{ header: string }> = ({ header }) => {
  return (
    <div className="text-xs m-1 shadow-md px-1 py-1 text-white bg-gray-400 rounded-md">
      {formatHeader(header)}
    </div>
  );
};

export default OptionCard;
