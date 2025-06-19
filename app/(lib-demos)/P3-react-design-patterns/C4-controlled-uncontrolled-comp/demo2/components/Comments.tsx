import React from "react";

const Comments = () => {
  return (
    <>
      {/* Example Usage Code */}
      <div className="mt-8 bg-gray-900 text-gray-100 rounded-xl p-6 text-sm overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Implementation Details
        </h3>
        <pre className="text-green-400">
          {`// Key functions used in this component:

const formatNumber = (num) => {
  if (!num) return '';
  return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
};

const parseNumber = (value) => {
  return value.replace(/[^\\d]/g, '');
};

const handleInputChange = (e) => {
  const inputValue = e.target.value;
  const rawValue = parseNumber(inputValue); // Extract digits only
  setAmount(rawValue); // Store raw number
};

// Display value is formatted with currency symbol
const displayValue = formatCurrency(amount, currency);`}
        </pre>
      </div>

      {/* Feature List */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Auto-formats with thousand separators
            </div>
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Multiple currency symbols
            </div>
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Returns raw numeric value
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Accepts only numeric input
            </div>
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Real-time formatting
            </div>
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Controlled component pattern
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Comments;
