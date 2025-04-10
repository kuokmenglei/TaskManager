let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => (notification.style.display = "none"), 1000);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const description = document.getElementById("taskDescription").value.trim();
  const status = document.getElementById("taskStatus").value;
  const dueDate = document.getElementById("taskDueDate").value;
  const priority = document.getElementById("taskPriority").value;
  const error = document.getElementById("error");

  if (!description) {
    error.textContent = "Task description cannot be empty.";
    return;
  }

  error.textContent = "";

  const task = {
    id: Date.now(),
    description,
    status,
    dueDate,
    priority,
  };

  tasks.push(task);
  saveTasks();
  showNotification("Task added successfully.");
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";
  document.getElementById("charCount").textContent = "0";
  displayTasks();
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  const newDesc = prompt("Edit task description:", task.description);
  if (newDesc !== null && newDesc.trim() !== "") {
    task.description = newDesc.trim().slice(0, 200);
    saveTasks();
    showNotification("Task updated successfully.");
    displayTasks();
  }
}

function toggleStatus(id) {
  const task = tasks.find((t) => t.id === id);
  task.status = task.status === "Pending" ? "Completed" : "Pending";
  saveTasks();
  showNotification(`Task marked as ${task.status}.`);
  displayTasks();
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    showNotification("Task deleted successfully.");
    displayTasks();
  }
}

function filterTasks(status) {
  filter = status;
  displayTasks();
}

function displayTasks() {
  const list = document.getElementById("taskList");
  let searchKeyword = "";
  const sortOption = document.getElementById("sortOptions")?.value || "default";

  if (document.getElementById("searchInput") != null) {
    searchKeyword = document.getElementById("searchInput").value;
  }

  list.innerHTML = "";

  let filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  // Keyword search
  if (searchKeyword) {
    console.log("searchKeyword");
    filteredTasks = filteredTasks.filter((task) =>
      task.description.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }

  // Sort logic
  switch (sortOption) {
    case "descAsc":
      filteredTasks.sort((a, b) => a.description.localeCompare(b.description));
      break;
    case "descDesc":
      filteredTasks.sort((a, b) => b.description.localeCompare(a.description));
      break;
    case "statusAsc":
      filteredTasks.sort((a, b) => a.status.localeCompare(b.status));
      break;
    case "statusDesc":
      filteredTasks.sort((a, b) => b.status.localeCompare(a.status));
      break;
  }

  // Render tasks
  filteredTasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task";

    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate - now;
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const desc = document.createElement("span");
    desc.innerHTML = `
    ${task.description} 
    <span class="priority ${task.priority.toLowerCase()}">[${
      task.priority
    }]</span>
    ${task.dueDate ? `<small> - Due: ${task.dueDate}</small>` : ""}
    <strong>${
      remainingDays >= 0
        ? `${remainingDays} days left`
        : `Overdue by ${Math.abs(remainingDays)} days`
    }</strong>
    (${task.status})
  `;
    if (task.status === "Completed") desc.classList.add("completed");

    const controls = document.createElement("div");
    controls.className = "task-controls";
    controls.innerHTML = `
      <button onclick="editTask(${task.id})">Edit</button>
      <button onclick="toggleStatus(${task.id})">DONE</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;

    div.appendChild(desc);
    div.appendChild(controls);
    list.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggleDarkMode");
  function updateButtonText() {
    toggleBtn.textContent = document.body.classList.contains("dark-mode")
      ? "☀️ Light Mode"
      : "🌙 Dark Mode";
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode")
    );
    updateButtonText();
  });

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
  updateButtonText();

  const textarea = document.querySelector("#taskDescription");

  textarea.addEventListener("input", function () {
    const target = event.currentTarget;
    const maxLength = target.getAttribute("maxlength");
    const currentLength = target.value.length;

    if (currentLength >= maxLength) {
      //return console.log("You have reached the maximum number of characters.");
    }

    //console.log(`${maxLength - currentLength} chars left`);

    document.getElementById("charCount").textContent = currentLength;
  });
  const btnAddTask = document.querySelector("#btnAddTask");
  btnAddTask.onclick = function () {
    //alert('Button clicked!');
    addTask();
  };

  const btnfilterTasksall = document.querySelector("#btnfilterTasksall");
  btnfilterTasksall.onclick = function () {
    //alert('Button clicked!');
    filterTasks("all");
  };

  const btnfilterTasksPending = document.querySelector(
    "#btnfilterTasksPending"
  );
  btnfilterTasksPending.onclick = function () {
    //alert('Button clicked!');
    filterTasks("Pending");
  };

  const btnfilterTasksCompleted = document.querySelector(
    "#btnfilterTasksCompleted"
  );
  btnfilterTasksCompleted.onclick = function () {
    //alert('Button clicked!');
    filterTasks("Completed");
  };

  displayTasks();
});
