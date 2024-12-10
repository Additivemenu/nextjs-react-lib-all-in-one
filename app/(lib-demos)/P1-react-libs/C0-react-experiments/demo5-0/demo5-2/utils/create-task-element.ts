export const createTaskElement = (taskName: string, taskIndex: number) => {
  const taskEl = document.createElement("div");
  taskEl.id = `task-${taskIndex}`;
  taskEl.className = "task-item border rounded-lg p-4 mb-4 bg-white";

  const header = document.createElement("div");
  header.className = "flex items-center justify-between mb-2";

  const titleWrapper = document.createElement("div");
  titleWrapper.className = "flex items-center gap-2";

  const icon = document.createElement("span");
  icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  const title = document.createElement("span");
  title.className = "font-medium";
  title.textContent = taskName;

  const index = document.createElement("span");
  index.className = "text-sm text-gray-500";
  index.textContent = `Task ${taskIndex}`;

  const status = document.createElement("div");
  status.className = "status text-sm mt-2 text-gray-600";
  status.textContent = "In Progress...";

  const time = document.createElement("div");
  time.className = "time text-sm text-gray-500 mt-1";
  time.textContent = `Started at: ${new Date().toLocaleTimeString()}`;

  titleWrapper.appendChild(icon);
  titleWrapper.appendChild(title);
  header.appendChild(titleWrapper);
  header.appendChild(index);
  taskEl.appendChild(header);
  taskEl.appendChild(status);
  taskEl.appendChild(time);

  return taskEl;
};
