export {};
// import React, { useCallback, useMemo } from "react";

// import { useFieldArray } from "react-hook-form";
// import { FiMinus, FiPlus } from "react-icons/fi";

// import {
//   useGetDynamicColumnsForNode,
//   useTransformationForm,
// } from "@/hooks/workflow";
// import { cn } from "@/lib/utils";
// import {
//   useConfiguringNode,
//   useGetReactflowActions,
//   useRightSidebarActions,
// } from "@/store/workflow";

// import NodeConfig from "../../../components/node-config";

// import {
//   mapToDefaultValues,
//   parseData,
//   schema,
//   SortDataFormData,
// } from "./form";

// const SortData: React.FC = () => {
//   const { updateNodeDataById } = useGetReactflowActions();
//   const { closeRightSidebar } = useRightSidebarActions();

//   const configNode = useConfiguringNode();
//   const { data: columns } = useGetDynamicColumnsForNode<string[]>(configNode);
//   const lowerBound = 1;
//   const upperBound = columns.length;

//   const initialValues = useMemo(
//     () => ({
//       sort_columns: [
//         {
//           name: columns?.[0],
//           order: "ascending",
//         },
//       ],
//       na_position: false,
//     }),
//     [columns],
//   );

//   const methods = useTransformationForm<SortDataFormData>(
//     schema,
//     useCallback((data) => mapToDefaultValues(data, columns), [columns]),
//     initialValues as SortDataFormData,
//   );

//   const { fields, append, remove } = useFieldArray({
//     control: methods.control,
//     name: "sort_columns",
//   });

//   const columnOptions =
//     columns.map((column) => ({
//       label: column,
//       value: column,
//     })) ?? [];

//   const selectedColumnOptions = methods
//     .watch("sort_columns")
//     .map((column) => column.name);

//   const orderOptions = [
//     { label: "Ascending", value: "ascending" },
//     { label: "Descending", value: "descending" },
//   ];

//   const addNewRow = useCallback(() => {
//     append({ name: "", order: "ascending" });
//   }, [append]);

//   const removeLastRow = useCallback(() => {
//     if (fields.length === 1) return;
//     remove(fields.length - 1);
//   }, [remove, fields]);

//   const handleApply = useCallback(
//     (data: SortDataFormData) => {
//       if (!configNode) return;
//       updateNodeDataById(configNode.id, {
//         transformationParams: parseData(data),
//       });
//       closeRightSidebar();
//     },
//     [configNode, updateNodeDataById, closeRightSidebar],
//   );

//   return (
//     <NodeConfig methods={methods} onSubmit={handleApply}>
//       <NodeConfig.Title>Sort Data Records</NodeConfig.Title>

//       <div className="overflow-y-auto p-4">
//         <NodeConfig.Group>
//           <div className="grid grid-cols-2 gap-x-2">
//             {fields.map((field, index) => (
//               <React.Fragment key={field.id}>
//                 <NodeConfig.Select
//                   name={`sort_columns.${index}.name`}
//                   label="Target Columns"
//                   hideLabel={index !== 0}
//                   options={columnOptions}
//                   selectedOptions={selectedColumnOptions}
//                   fieldIndex={index}
//                   inGroup
//                 />
//                 <NodeConfig.Select
//                   name={`sort_columns.${index}.order`}
//                   label="Order"
//                   hideLabel={index !== 0}
//                   options={orderOptions}
//                   inGroup
//                 />
//               </React.Fragment>
//             ))}
//             <button
//               type="button"
//               className={cn(
//                 "btn btn-sm mt-2 border border-primary bg-ghost-hover",
//                 "w-full text-primary hover:bg-[#c7e4f2]",
//                 "disabled:!bg-gray-200 disabled:text-secondary-text",
//               )}
//               disabled={fields.length >= upperBound}
//               onClick={addNewRow}
//             >
//               <FiPlus />
//             </button>
//             <button
//               type="button"
//               className={cn(
//                 "btn btn-sm mt-2 border border-primary bg-ghost-hover",
//                 "w-full text-primary hover:bg-[#c7e4f2]",
//                 "disabled:!bg-gray-200 disabled:text-secondary-text",
//               )}
//               disabled={fields.length <= lowerBound}
//               onClick={removeLastRow}
//             >
//               <FiMinus />
//             </button>
//           </div>
//         </NodeConfig.Group>

//         <NodeConfig.Submit disabled={!methods.formState.isValid} />
//       </div>
//     </NodeConfig>
//   );
// };

// export default SortData;
