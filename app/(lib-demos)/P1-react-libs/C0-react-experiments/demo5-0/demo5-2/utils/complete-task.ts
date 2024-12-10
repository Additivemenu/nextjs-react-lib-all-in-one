export const completeTask = (taskIndex: number) => {
  const taskEl = document.getElementById(`task-${taskIndex}`);
  if (!taskEl) return;

  // Update icon to checkmark
  const icon = taskEl.querySelector("svg");
  if (icon) {
    icon.innerHTML = `<circle cx="12" cy="12" r="10"></circle><path d="M9 12l2 2 4-4"></path>`;
    icon.setAttribute("class", "w-5 h-5 text-green-500");
  }

  // Update status
  const status = taskEl.querySelector(".status");
  if (status) {
    status.textContent = "Completed";
    status.className = "status text-sm mt-2 text-green-600";
  }

  // Add completion time
  const time = taskEl.querySelector(".time");
  if (time) {
    time.textContent += ` | Completed at: ${new Date().toLocaleTimeString()}`;
  }
};
