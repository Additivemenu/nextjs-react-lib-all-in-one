// /**
//  * the function creates a custom loader element that will be mounted in parallel to the rcb-typing-indicator element
//  * @returns
//  */
// export const createCustomLoader = () => {
//   const customLoader = document.createElement("div");
//   customLoader.className = "custom-loader flex items-center justify-center p-2";
//   // Using Tailwind classes for styling
//   customLoader.innerHTML = `
//           <div class="animate-spin text-primary">
//             <svg width="24" height="24" viewBox="0 0 24 24">
//               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
//               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
//             </svg>
//           </div>
//         `;
//   return customLoader;
// };

// /**
//  * The function creates a custom loader element with a button.
//  * When the button is clicked, it shows an alert with the message "hello".
//  * @returns {HTMLElement} The custom loader element containing the button.
//  */
// export const createCustomLoader = () => {
//   const customLoader = document.createElement("div");
//   customLoader.className =
//     "custom-loader flex items-center justify-center p-2";

//   // Using Tailwind classes for styling the button
//   customLoader.innerHTML = `
//             <div class="flex items-center justify-center">
//               <button
//                 class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[100px] h-[100px]"
//                 onclick="alert('hello')"
//               >
//                 Click Me
//               </button>
//             </div>
//           `;

//   return customLoader;
// };

// /**
//  * The function creates a custom element resembling the UI with a task label and a "Completed" badge.
//  * @returns
//  */
// export const createCustomLoader = () => {
//   // Create the container div
//   const customDiv = document.createElement("div");
//   customDiv.className =
//     "custom-ui flex items-center justify-between p-1 bg-gray-800 text-white rounded shadow-md w-[300px] h-[70px]";

//   // Set the inner HTML for the task label and "Completed" badge
//   customDiv.innerHTML = `
//       <span class="task-label text-sm font-medium">Scrape data from specified websites.</span>
//       <span class="status-badge flex items-center justify-center  bg-green-500 text-white text-sm px-3 py-1 rounded-full w-[30px] h-[30px]">
//         P
//       </span>
//     `;

//   return customDiv;
// };

/**
 * The function creates a custom element resembling the UI with a task label and a "Completed" badge.
 * After 3 seconds, the badge will turn yellow.
 * @returns
 */
export const createCustomLoader = () => {
  // Create the container div
  const customDiv = document.createElement("div");
  customDiv.className =
    "custom-ui flex items-center justify-between p-1 bg-gray-800 text-white rounded shadow-md w-[300px] h-[70px]";

  // Set the inner HTML for the task label and "Completed" badge
  customDiv.innerHTML = `
        <span class="task-label text-sm font-medium">Scrape data from specified websites.</span>
        <span id="status-badge" class="status-badge flex items-center justify-center bg-green-500 text-white text-sm px-3 py-1 rounded-full w-[30px] h-[30px]">
          P
        </span>
      `;

  // Change badge color to yellow after 3 seconds
  setTimeout(() => {
    const badge = customDiv.querySelector("#status-badge");
    if (badge) {
      badge.classList.remove("bg-green-500");
      badge.classList.add("bg-yellow-500");
      badge.textContent = "W";
    }
  }, 3000);

  return customDiv;
};
