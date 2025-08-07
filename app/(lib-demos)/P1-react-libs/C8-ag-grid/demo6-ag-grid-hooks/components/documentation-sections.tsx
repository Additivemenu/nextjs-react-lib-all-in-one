import React from "react";

interface DocumentationSectionProps {
  selectedParams: any;
}

export const HookDocumentationSection: React.FC<{ selectedParams: any }> = ({
  selectedParams,
}) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
    <h3 className="font-semibold text-blue-900 mb-2">
      Demonstrated Hooks & Their Params:
    </h3>
    <ul className="text-sm text-blue-800 space-y-1">
      <li>
        <strong>valueFormatter:</strong> Uses ValueFormatterParams (value, data,
        api, etc.)
      </li>
      <li>
        <strong>cellClass:</strong> Uses CellClassParams (value, data, rowIndex,
        etc.)
      </li>
      <li>
        <strong>cellStyle:</strong> Uses CellStyleParams (value, data, node,
        etc.)
      </li>
      <li>
        <strong>cellRenderer:</strong> Uses ICellRendererParams (value, data,
        setValue, etc.)
      </li>
      <li>
        <strong>tooltipValueGetter:</strong> Uses ITooltipParams (value, data,
        etc.)
      </li>
      <li>
        <strong>comparator:</strong> Uses individual values for sorting
      </li>
      <li>
        <strong>🆕 params.api:</strong> Grid API for programmatic control (get
        data, refresh cells, selections)
      </li>
      <li>
        <strong>🆕 params.context:</strong> Custom context data for company-wide
        information
      </li>
    </ul>
  </div>
);

export const SelectedParamsSection: React.FC<{ selectedParams: any }> = ({
  selectedParams,
}) => {
  if (!selectedParams) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-green-900 mb-2">
        Last Clicked Cell Params:
      </h3>
      <div className="text-sm text-green-800 whitespace-pre-wrap">
        {JSON.stringify(selectedParams, null, 2)}
      </div>
    </div>
  );
};

export const InteractionsSection: React.FC = () => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <h3 className="font-semibold text-gray-900 mb-2">
      Try These Interactions:
    </h3>
    <ul className="text-sm text-gray-700 space-y-1">
      <li>
        • <strong>Click any cell</strong> to see its params object above
      </li>
      <li>
        • <strong>Hover over names</strong> to see custom tooltips using
        params.data
      </li>
      <li>
        • <strong>Sort by age/salary</strong> to see dynamic formatting change
      </li>
      <li>
        • <strong>Filter by status</strong> to see how params affect filtering
      </li>
      <li>
        • <strong>🆕 Click action buttons (📈/ℹ️)</strong> to see params.api in
        action
      </li>
      <li>
        • <strong>🆕 Select multiple rows</strong> then click promote to see API
        usage
      </li>
      <li>
        • <strong>🆕 Hover over Budget Impact</strong> to see params.context
        tooltips
      </li>
      <li>
        • <strong>Notice the styling</strong> - all based on params.value and
        params.data
      </li>
    </ul>
  </div>
);

export const ParamsPropertiesSection: React.FC = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <h3 className="font-semibold text-yellow-900 mb-2">
      Key Params Properties Demonstrated:
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <h4 className="font-medium text-yellow-800 mb-1">Common Properties:</h4>
        <ul className="text-yellow-700 space-y-0.5">
          <li>
            • <code>params.value</code> - Current cell value
          </li>
          <li>
            • <code>params.data</code> - Entire row data object
          </li>
          <li>
            • <code>params.node</code> - Row node with metadata
          </li>
          <li>
            • <code>params.column</code> - Column instance
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium text-yellow-800 mb-1">
          Additional Properties:
        </h4>
        <ul className="text-yellow-700 space-y-0.5">
          <li>
            • <code>params.colDef</code> - Column definition
          </li>
          <li>
            • <code>params.api</code> - Grid API access
          </li>
          <li>
            • <code>params.rowIndex</code> - Row index
          </li>
          <li>
            • <code>params.context</code> - Custom context
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export const AdvancedFeaturesSection: React.FC = () => (
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
    <h3 className="font-semibold text-purple-900 mb-2">
      🚀 Advanced Features Demo:
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <h4 className="font-medium text-purple-800 mb-1">params.api Usage:</h4>
        <ul className="text-purple-700 space-y-0.5">
          <li>
            • <code>api.getSelectedNodes()</code> - Get selected rows
          </li>
          <li>
            • <code>api.refreshCells()</code> - Refresh specific cells
          </li>
          <li>
            • <code>api.forEachNode()</code> - Iterate all row nodes
          </li>
          <li>
            • <code>api.getDisplayedRowCount()</code> - Get visible row count
          </li>
          <li>
            • <code>node.setData()</code> - Update row data programmatically
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium text-purple-800 mb-1">
          params.context Usage:
        </h4>
        <ul className="text-purple-700 space-y-0.5">
          <li>• Company-wide configuration data</li>
          <li>• Department budget information</li>
          <li>• Fiscal year and currency settings</li>
          <li>• Performance thresholds</li>
          <li>• Dynamic calculations based on context</li>
        </ul>
      </div>
    </div>
  </div>
);
