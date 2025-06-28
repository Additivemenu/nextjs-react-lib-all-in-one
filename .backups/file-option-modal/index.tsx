// "use client";
// import React, { useEffect, useState } from "react";

// import Image from "next/image";
// // eslint-disable-next-line import/named
// import { v4 as uuidv4 } from "uuid";

// import ModalManager from "@/components/modal";
// import { useModal } from "@/components/modal/hook";
// import {
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { toast } from "@/lib/toast-manager";
// import { cn } from "@/lib/utils";
// import {
//   useUploadActions,
//   useUploads,
// } from "@/store/workflow/add-file-modal/hooks";

// import { isExcelFile, readHeaderValuesAsync } from "../../utils/"; 

// import MultiSelect from "./_components/multi-select";
// import {
//   getColumnIndexBound,
//   getStartingCellRowNumber,
//   validateCell,
//   validateCellRange,
// } from "./_utils";
// import { CellRangeOption } from "./types";

// /**
//  * ! old version of FileOptionModal, not using react-hook-form, should not be used anymore
//  */
// const FileOptionModal = ModalManager.create(
//   ({ fileToUpload }: { fileToUpload: File }) => {
//     const modal = useModal();
//     const uploads = useUploads();
//     const uploadActions = useUploadActions();

//     const [useCols, setUseCols] = useState<string[]>([]); //  user selected headers

//     const [isCellRangeCheckboxOn, setIsCellRangeCheckboxOn] = useState(false);
//     const handleCellRangeCheckboxChange = async (
//       e: React.ChangeEvent<HTMLInputElement>,
//     ) => {
//       setIsCellRangeCheckboxOn(e.target.checked);

//       if (!e.target.checked) {
//         const newHeaderOptions = await readHeaderValuesAsync(
//           fileToUpload,
//           headerRowNumber,
//         );
//         setHeaderOptions(newHeaderOptions);
//         setUseCols(newHeaderOptions); // by default, select all columns when disable cell range option
//       } else {
//         if (cellRange.startingCell === "" || cellRange.endingCell === "") {
//           return;
//         }
//         if (!validateCellRange(cellRange)) {
//           setCellRangeErrMsg(
//             "Please make sure the cell range is valid! e.g. A1:E10",
//           );
//           return;
//         }

//         const { leftBoundIndex, rightBoundIndex } =
//           getColumnIndexBound(cellRange);
//         const fullHeaderOptions = await readHeaderValuesAsync(
//           fileToUpload,
//           headerRowNumber,
//         );

//         const newHeaderOptionsInCellRange = fullHeaderOptions.filter(
//           (_, index) => leftBoundIndex <= index && index <= rightBoundIndex,
//         );
//         setHeaderOptions(newHeaderOptionsInCellRange);
//         setUseCols(newHeaderOptionsInCellRange);
//       }
//     };

//     const [cellRangeErrMsg, setCellRangeErrMsg] = useState("");

//     const [cellRange, setCellRange] = useState<CellRangeOption>({
//       startingCell: "",
//       endingCell: "",
//     }); // only for excel files

//     const onCellRangeInputChange = async (
//       e: React.ChangeEvent<HTMLInputElement>,
//     ) => {
//       const { name, value } = e.target;
//       setCellRange((prev) => ({ ...prev, [name]: value }));
//       if (value === "") return;

//       // validate cell range input
//       if (!validateCell(value)) {
//         setCellRangeErrMsg(
//           "Please make sure the cell range is valid! e.g. A2:E10",
//         );
//         return;
//       }

//       let potentialNewCellRange: CellRangeOption;
//       if (name === "startingCell") {
//         if (cellRange.endingCell === "") return;

//         potentialNewCellRange = {
//           startingCell: value,
//           endingCell: cellRange.endingCell,
//         };
//       } else if (name === "endingCell") {
//         if (cellRange.startingCell === "") return;

//         potentialNewCellRange = {
//           startingCell: cellRange.startingCell,
//           endingCell: value,
//         };
//       }

//       if (!validateCellRange(potentialNewCellRange!)) {
//         setCellRangeErrMsg(
//           "Please make sure the cell range is valid! e.g. A2:E10",
//         );
//         return;
//       }
//       if (getStartingCellRowNumber(potentialNewCellRange!) <= headerRowNumber) {
//         setCellRangeErrMsg(
//           `The starting cell row number should be greater than the header row number: ${headerRowNumber}`,
//         );
//         return;
//       }

//       setCellRangeErrMsg("");
//       const { leftBoundIndex, rightBoundIndex } = getColumnIndexBound(
//         potentialNewCellRange!,
//       );
//       const fullHeaderOptions = await readHeaderValuesAsync(
//         fileToUpload,
//         headerRowNumber,
//       );

//       const newHeaderOptions = fullHeaderOptions.filter(
//         (_, index) => leftBoundIndex <= index && index <= rightBoundIndex,
//       );
//       setHeaderOptions(newHeaderOptions);

//       const newUseCols = useCols.filter(
//         (selectedCol) => newHeaderOptions.includes(selectedCol), // only include the selected columns within the cell range
//       );
//       setUseCols(newUseCols);
//     };

//     // header selection
//     const uploadInStore = uploads.find(
//       (u) => u.fileToUpload.name === fileToUpload.name,
//     );
//     const [headerRowNumber, setHeaderRowNumber] = useState(
//       uploadInStore?.headerRowNumber ?? 1,
//     );

//     const onHeaderRowNumberInputChange = async (
//       e: React.ChangeEvent<HTMLInputElement>,
//     ) => {
//       if (e.target.value === "0") return;
//       const newHeaderRowNumber = parseInt(e.target.value);
//       setHeaderRowNumber(newHeaderRowNumber);

//       if (
//         isCellRangeCheckboxOn &&
//         cellRange.startingCell !== "" &&
//         cellRange.endingCell !== "" &&
//         validateCellRange(cellRange)
//       ) {
//         // apply cellRange filtering to headerOptions & useCols -
//         const { leftBoundIndex, rightBoundIndex } =
//           getColumnIndexBound(cellRange);
//         const fullHeaderOptions = await readHeaderValuesAsync(
//           fileToUpload,
//           newHeaderRowNumber,
//         );

//         const newHeaderOptionsInCellRange = fullHeaderOptions.filter(
//           (_, index) => leftBoundIndex <= index && index <= rightBoundIndex,
//         );
//         setHeaderOptions(newHeaderOptionsInCellRange);
//         setUseCols(newHeaderOptionsInCellRange); // by default, select all columns when switch to a new headerRowNumber
//       } else {
//         // if cellRange option is not in use
//         const newHeaderOptions = await readHeaderValuesAsync(
//           fileToUpload,
//           newHeaderRowNumber,
//         );
//         setHeaderOptions(newHeaderOptions);
//         setUseCols(newHeaderOptions); // by default, select all columns when switch to a new headerRowNumber
//       }
//     };

//     const [headerOptions, setHeaderOptions] = useState<string[]>([]); // derived state from headerRowNumber

//     useEffect(() => {
//       const initFileOptionModalFromStore = async () => {
//         if (!fileToUpload) return;
//         const uploadInStore = uploads.find(
//           (u) => u.fileToUpload.name === fileToUpload.name,
//         );
//         if (!uploadInStore) return;

//         const initHeaderRowNumber = uploadInStore?.headerRowNumber ?? 1;
//         const newHeaderOptions = await readHeaderValuesAsync(
//           fileToUpload,
//           initHeaderRowNumber,
//         );

//         if (uploadInStore?.useCols === "") {
//           // user not yet config this file option
//           setHeaderOptions(newHeaderOptions);
//           setUseCols(newHeaderOptions); // by default, use all columns
//         } else {
//           // user already configured this file option and re-open the file option modal
//           const useColsDataFromStore = JSON.parse(
//             uploadInStore?.useCols,
//           ) as string[];
//           const cellRangeDataFromStore = uploadInStore.cellRange.split(":");

//           setHeaderRowNumber(initHeaderRowNumber);
//           setCellRange({
//             startingCell: cellRangeDataFromStore[0],
//             endingCell: cellRangeDataFromStore[1],
//           });
//           setHeaderOptions(newHeaderOptions);
//           setUseCols(useColsDataFromStore);
//         }
//       };

//       initFileOptionModalFromStore();
//     }, [fileToUpload, uploads]);

//     // apply file option to the upload store
//     const onApplyOptions = () => {
//       if (
//         isExcelFile(fileToUpload) &&
//         isCellRangeCheckboxOn &&
//         !validateCellRange(cellRange)
//       ) {
//         setCellRangeErrMsg(
//           "Please make sure the cell range is valid! e.g. A2:E10",
//         );
//         setCellRange({ startingCell: "", endingCell: "" });
//         return;
//       }

//       if (isNaN(headerRowNumber) || headerRowNumber < 1) {
//         toast.error("Please provide a valid header row number.");
//         return;
//       }

//       const useColsJsonString =
//         JSON.stringify(
//           useCols.filter((str): str is string => str !== undefined),
//         ) ?? "";
//       // when cell range checkbox is off, we parse all cells
//       const cellRangeString = isCellRangeCheckboxOn
//         ? `${cellRange.startingCell}:${cellRange.endingCell}`
//         : ":";

//       uploadActions.updateUpload(fileToUpload, {
//         useCols: useColsJsonString,
//         headerRowNumber: headerRowNumber,
//         cellRange: cellRangeString,
//       });

//       modal.remove();
//     };

//     return (
//       <>
      
//       <DialogContent className="h-auto max-w-[620px] bg-white text-primary-text">
//         <div>
//           <DialogHeader>
//             <DialogTitle className="text-xl">
//               {fileToUpload.name ?? "No file name"}
//             </DialogTitle>
//           </DialogHeader>

//           <DialogDescription>
//             Choose options to upload your file
//           </DialogDescription>

//           <div className="mt-2 space-x-6 rounded-md bg-[#F2F3F6] p-4 md:flex">
//             <div className="flex flex-col space-y-4 md:flex-1">
//               <div>
//                 <h3 className="mb-2 flex font-bold text-secondary-text">
//                   Column Headers
//                   <div
//                     className="tooltip my-auto ml-2"
//                     data-tip="Choose the row with column names."
//                   >
//                     <Image
//                       src="/info-thin.svg"
//                       alt="Info"
//                       width={20}
//                       height={20}
//                     />
//                   </div>
//                 </h3>
//                 <div className="pl-2">
//                   The row{" "}
//                   <input
//                     type="number"
//                     className="show-arrows w-10 rounded-md border border-border-2 px-1 py-0.5"
//                     placeholder="1"
//                     value={headerRowNumber}
//                     onChange={onHeaderRowNumberInputChange}
//                   />{" "}
//                   as header
//                 </div>
//               </div>
//               {isExcelFile(fileToUpload) && (
//                 <div>
//                   <div className="">
//                     <h3 className="mb-2 flex font-bold text-secondary-text">
//                       Cell Range
//                       <div
//                         className="tooltip my-auto ml-2"
//                         data-tip="Set the range of cells to import."
//                       >
//                         <Image
//                           src="/info-thin.svg"
//                           alt="Info"
//                           width={20}
//                           height={20}
//                         />
//                       </div>
//                     </h3>
//                     <div className="mb-2 flex pl-2">
//                       <div
//                         className="tooltip my-auto"
//                         data-tip="Toggle to import specific cell range; all cells imported when off."
//                       >
//                         <input
//                           type="checkbox"
//                           checked={isCellRangeCheckboxOn}
//                           className={cn(
//                             // "checkbox checkbox-secondary [--chkfg:white]", // checkbox-style switch
//                             "toggle", // toggle-style switch
//                             "my-auto mr-2",
//                             isCellRangeCheckboxOn
//                               ? "bg-white [--tglbg:#15b7cb]"
//                               : "bg-neutral [--tglbg:#f7f8fa]",
//                           )}
//                           onChange={handleCellRangeCheckboxChange}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex pl-2">
//                       {isCellRangeCheckboxOn && (
//                         <div>
//                           <input
//                             type="text"
//                             className="mr-1 w-10 rounded-lg border border-border-2 px-1 py-0.5"
//                             value={cellRange.startingCell}
//                             name="startingCell"
//                             onChange={onCellRangeInputChange}
//                             placeholder="A2"
//                             disabled={!isCellRangeCheckboxOn}
//                           />{" "}
//                           :{" "}
//                           <input
//                             type="text"
//                             className="ml-1 w-10 rounded-lg border border-border-2 px-1 py-0.5"
//                             value={cellRange.endingCell}
//                             name="endingCell"
//                             onChange={onCellRangeInputChange}
//                             placeholder="E6"
//                             disabled={!isCellRangeCheckboxOn}
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   {isCellRangeCheckboxOn && cellRangeErrMsg && (
//                     <div className="mt-2">
//                       <p className="text-xs text-red-500">{cellRangeErrMsg}</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//             <div className="md:flex-1">
//               <h3 className="flex font-bold text-secondary-text">
//                 Column Selection
//                 <div
//                   className="tooltip my-auto ml-2"
//                   data-tip="Select columns to include."
//                 >
//                   <Image
//                     src="/info-thin.svg"
//                     alt="Info"
//                     width={20}
//                     height={20}
//                   />
//                 </div>
//               </h3>

//               <div className="mt-2 rounded-2xl bg-white p-2 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
//                 {headerOptions.length === 0 && (
//                   <div className="min-h-[200px]">Oops, no headers found!</div>
//                 )}
//                 {headerOptions.length > 0 && (
//                   <MultiSelect
//                     selectedValues={useCols}
//                     setSelectedValues={setUseCols}
//                     className="max-h-[300px] overflow-y-auto"
//                   >
//                     {headerOptions.length > 0 &&
//                       headerOptions.map((header) => {
//                         if (!header) return null;

//                         return (
//                           <MultiSelect.Option key={uuidv4()} value={header}>
//                             <div className="ml-auto p-2 text-sm">
//                               {header?.length > 15
//                                 ? header.slice(0, 15) + "..."
//                                 : header}
//                             </div>
//                           </MultiSelect.Option>
//                         );
//                       })}
//                   </MultiSelect>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 h-[1px] w-full bg-slate-300" />

//           <div className="mt-5 flex justify-end space-x-3">
//             <button
//               className="btn bordered btn-sm rounded-lg border-border-2 bg-transparent px-4 py-2 font-semibold text-primary-text hover:bg-ghost-hover"
//               onClick={() => modal.remove()}
//             >
//               Cancel
//             </button>
//             <button
//               className="btn bordered btn-sm rounded-lg border-transparent bg-neutral px-4 py-2 font-semibold text-white hover:bg-accent"
//               data-onboarding="upload-file-step-4"
//               onClick={onApplyOptions}
//             >
//               Apply
//             </button>
//           </div>
//         </div>
//       </DialogContent>
//       </>
      
//     );
//   },
// );

// export default FileOptionModal;
