"use client";

import { useState, ChangeEvent } from "react";
import Comments from "./components/Comments";

import { Currency, CurrencyCode } from "./types";
import { currencies } from "./constants";
import { parseToPureNumber, formatCurrency } from "./utils/formatter";

export default function CurrencyInputDemo(): JSX.Element {
  const [amount, setAmount] = useState<string>("");
  const [submittedAmount, setSubmittedAmount] = useState<string>("");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    //! triggered on every keystroke
    const inputValue: string = e.target.value;
    
    // note we are using a text input element, so inputValue is not necessarily a number string
    //! Remove currency symbol and commas to get just digits (display value --> raw value)
    const rawValue: string = parseToPureNumber(inputValue);

    // Update state with raw numeric value
    setAmount(rawValue);
  };

  const handleSubmit = (): void => {
    setSubmittedAmount(amount);
  };

  const handleClear = (): void => {
    setAmount("");
    setSubmittedAmount("");
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setCurrency(e.target.value as CurrencyCode);
  };

  //! Get the display value (formatted with currency symbol)
  const displayValue: string = formatCurrency(amount, currency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Currency Input Component (TypeScript)
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Currency Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Currency
              </label>
              <select
                value={currency}
                onChange={handleCurrencyChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                {Object.entries(currencies).map(
                  ([code, { name }]: [string, Currency]) => (
                    <option key={code} value={code}>
                      {name} ({currencies[code].symbol})
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Currency Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Amount
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={displayValue}
                  onChange={handleInputChange}
                  placeholder={`${currencies[currency].symbol}0`}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Type numbers only - formatting is automatic
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Submit Amount
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Clear
              </button>
            </div>

            {/* Display Values */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">
                    Display Value
                  </h3>
                  <p className="text-lg font-mono bg-white p-2 rounded border">
                    {displayValue || "(empty)"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">
                    Raw Numeric Value
                  </h3>
                  <p className="text-lg font-mono bg-white p-2 rounded border">
                    {amount || "(empty)"}
                  </p>
                </div>
              </div>

              {submittedAmount && (
                <div className="pt-3 border-t border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-1">
                    Submitted Values
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Formatted:</p>
                      <p className="text-lg font-mono bg-green-100 p-2 rounded border border-green-200">
                        {formatCurrency(submittedAmount, currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Raw Number:</p>
                      <p className="text-lg font-mono bg-blue-100 p-2 rounded border border-blue-200">
                        {submittedAmount}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Comments />
      </div>
    </div>
  );
}
