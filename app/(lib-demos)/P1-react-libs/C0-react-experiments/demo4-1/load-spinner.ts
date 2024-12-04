export const replaceLoadSpinner = () => {
  const existingLoader = document.querySelector(
    ".custom-rcb-loading-container",
  );
  if (existingLoader) return; // Exit if loader already exists

  const originalIndicator = document.querySelector(
    ".rcb-typing-indicator",
  ) as HTMLDivElement;
  if (!originalIndicator) return;

  const customLoader = document.createElement("div");
  customLoader.className = "custom-rcb-loading-container";
  customLoader.innerHTML = `
          <div aria-live="assertive" role="alert" class="custom-rcb-loader"></div>
          <span class="custom-rcb-loading-text">Loading .....</span>
      `;

  originalIndicator.style.display = "none";
  originalIndicator.parentNode!.insertBefore(customLoader, originalIndicator);
};
