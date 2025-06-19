import React from "react";

export default function ComparisonTable() {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Key Differences
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-medium text-gray-900">
                Aspect
              </th>
              <th className="text-left py-2 px-3 font-medium text-blue-600">
                Controlled
              </th>
              <th className="text-left py-2 px-3 font-medium text-green-600">
                Uncontrolled
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-2 px-3 font-medium">Data Source</td>
              <td className="py-2 px-3">React state</td>
              <td className="py-2 px-3">DOM</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium">Value Access</td>
              <td className="py-2 px-3">Always available in state</td>
              <td className="py-2 px-3">Via ref when needed</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium">Re-renders</td>
              <td className="py-2 px-3">On every keystroke</td>
              <td className="py-2 px-3">Only when component re-renders</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium">Validation</td>
              <td className="py-2 px-3">Real-time validation possible</td>
              <td className="py-2 px-3">Validation on submit/blur</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium">Performance</td>
              <td className="py-2 px-3">More re-renders</td>
              <td className="py-2 px-3">Fewer re-renders</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
