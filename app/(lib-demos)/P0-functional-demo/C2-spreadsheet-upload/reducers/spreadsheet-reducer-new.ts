// import { SpreadsheetState, SpreadsheetAction } from "../types";

// // Initial state
// export const initialSpreadsheetState: SpreadsheetState = {
//   data: [],
//   columnDefs: [],
//   selectedData: [],
//   selectedRange: "",
// };

// // Reducer
// export function spreadsheetReducer(
//   state: SpreadsheetState,
//   action: SpreadsheetAction,
// ): SpreadsheetState {
//   switch (action.type) {
//     case "SET_DATA":
//       return {
//         ...state,
//         data: action.payload.data,
//         columnDefs: action.payload.columnDefs,
//         selectedData: [],
//         selectedRange: "",
//       };
//     case "SET_SELECTION":
//       return {
//         ...state,
//         selectedData: action.payload.data,
//         selectedRange: action.payload.range,
//       };
//     case "CLEAR_DATA":
//       return initialSpreadsheetState;
//     default:
//       return state;
//   }
// }
