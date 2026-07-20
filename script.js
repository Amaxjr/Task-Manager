const inputBox = document.getElementById("task-input");
const listContainer = document.getElementById("task-list");
const counterTask = document.getElementById("task-count");
const completedCounter = document.getElementById("completed-count");
const incompleteCounter = document.getElementById("incomplete-count");
const form = document.getElementById("add-task-form");
const clearTasksBtn = document.getElementById("clear-tasks-btn");
const filterallBtn = document.getElementById("Filter-all");
const filtercompletedBtn = document.getElementById("Filter-completed");
const filterincompleteBtn = document.getElementById("Filter-incomplete");
const filterclearBtn = document.getElementById("Filter-clear");
const prioritySelect = document.getElementById("priority-select");
const sortSelect = document.getElementById("sort-select");

filterallBtn.addEventListener("click", () => filterTasks('all'));
filtercompletedBtn.addEventListener("click", () => filterTasks('completed'));
filterincompleteBtn.addEventListener("click", () => filterTasks('incomplete'));
filterclearBtn.addEventListener("click", clearFilter);
sortSelect.addEventListener("change", sortTasks);

form.addEventListener("submit", function(e) {
  e.preventDefault();
  addTask();
});

clearTasksBtn.addEventListener("click", clearTasks);

function createTaskElement(text, checked, priority, index) {
  let li = document.createElement("li");
  li.setAttribute("data-priority", priority);
  li.dataset.index = index !== undefined ? index : Date.now();
  if (checked) li.classList.add("checked");

  let taskText = document.createElement("span");
  taskText.classList.add("task-text");
  taskText.textContent = text;
  li.appendChild(taskText);

  let priorityBadge = document.createElement("span");
  priorityBadge.textContent = priority;
  priorityBadge.classList.add("priority-badge", `priority-${priority}`);
  li.appendChild(priorityBadge);

  let deleteBtn = document.createElement("span");
  deleteBtn.textContent = "\u00d7";
  deleteBtn.classList.add("delete-btn");
  li.appendChild(deleteBtn);

  return li;
}

function addTask() {
  if (inputBox.value === '') {
    alert("Please enter a task.");
  }
  else {
    const li = createTaskElement(inputBox.value, false, prioritySelect.value);
    listContainer.appendChild(li);
    inputBox.value = "";
    inputBox.focus();
    updateCounters();
    saveTasks();
  }
}

listContainer.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-btn")) {
        e.target.closest("li").remove();
        updateCounters();
        saveTasks();
        return;
    }
    if (e.target.classList.contains("priority-badge")) {
        return;
    }
    const li = e.target.closest("li");
    if (li) {
        li.classList.toggle("checked");
        updateCounters();
        saveTasks();
    }
});

listContainer.addEventListener("dblclick", function(e) {
    const li = e.target.closest("li");
    if (li) {
        const taskTextEl = li.querySelector(".task-text");
        const newTaskText = prompt("Edit task:", taskTextEl.textContent.trim());
        if (newTaskText !== null && newTaskText.trim() !== "") {
            taskTextEl.textContent = newTaskText.trim();
            saveTasks();
        }
    }
});

function updateCounters() {
  const allTasks = listContainer.getElementsByTagName("li").length;
  const completed = listContainer.getElementsByClassName("checked").length;
  const incomplete = allTasks - completed;

  counterTask.textContent = allTasks;
  completedCounter.textContent = completed;
  incompleteCounter.textContent = incomplete;
}

function saveTasks() {
  const tasksToSave = [];
  const taskElements = listContainer.getElementsByTagName("li");
  for (let i = 0; i < taskElements.length; i++) {
    const taskText = taskElements[i].querySelector(".task-text").textContent.trim();
    const isChecked = taskElements[i].classList.contains("checked");
    const priority = taskElements[i].getAttribute("data-priority") || "low";
    const index = taskElements[i].dataset.index;
    tasksToSave.push({ text: taskText, checked: isChecked, priority: priority, index: index });
  }
  localStorage.setItem("tasks", JSON.stringify(tasksToSave));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  listContainer.innerHTML = "";
  savedTasks.forEach(task => {
    const li = createTaskElement(task.text, task.checked, task.priority || "low", task.index);
    listContainer.appendChild(li);
  });
}

function clearTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    listContainer.innerHTML = "";
    updateCounters();
    saveTasks();
  }
}

function filterTasks(filter) {
  const tasks = listContainer.getElementsByTagName("li");
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (filter === 'all') {
      task.style.display = "";
    }
    else if (filter === 'completed') {
      task.style.display = task.classList.contains("checked") ? "" : "none";
    }
    else if (filter === 'incomplete') {
      task.style.display = task.classList.contains("checked") ? "none" : "";
    }
  }
  setActiveFilterBtn(filter);
}

function clearFilter() {
  const tasks = listContainer.getElementsByTagName("li");
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].style.display = "";
  }
  clearActiveFilterBtn();
}

function setActiveFilterBtn(filter) {
  clearActiveFilterBtn();
  if (filter === 'all') filterallBtn.classList.add('active');
  else if (filter === 'completed') filtercompletedBtn.classList.add('active');
  else if (filter === 'incomplete') filterincompleteBtn.classList.add('active');
}

function clearActiveFilterBtn() {
  [filterallBtn, filtercompletedBtn, filterincompleteBtn, filterclearBtn].forEach(btn => {
    btn.classList.remove('active');
  });
}

function filterTasksByPriority(priority) {
  const tasks = listContainer.getElementsByTagName("li");
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const taskPriority = task.getAttribute("data-priority");
    task.style.display = (priority === 'all' || priority === taskPriority) ? "" : "none";
  }
}

function sortTasks() {
  const tasksArray = Array.from(listContainer.getElementsByTagName("li"));
  const sortValue = sortSelect.value;

  if (sortValue === "recent") {
    tasksArray.sort((a, b) => b.dataset.index - a.dataset.index);
  }

  if (sortValue === "oldest") {
    tasksArray.sort((a, b) => a.dataset.index - b.dataset.index);
  }

  if (sortValue === "priority") {
    const priorityOrder = { "high": 1, "medium": 2, "low": 3 };
    tasksArray.sort((a, b) => priorityOrder[a.getAttribute("data-priority")] - priorityOrder[b.getAttribute("data-priority")]);
  }

  if (sortValue === "alphabetical"){
    const alphabetical = (a, b) => a.querySelector(".task-text").textContent.localeCompare(b.querySelector(".task-text").textContent);
    tasksArray.sort(alphabetical);
  }

  listContainer.innerHTML = "";
  tasksArray.forEach(task => listContainer.appendChild(task));
  saveTasks();
}

loadTasks();
updateCounters();