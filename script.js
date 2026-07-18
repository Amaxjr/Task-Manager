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

form.addEventListener("submit", function(e) {
  e.preventDefault();
  addTask();
});

clearTasksBtn.addEventListener("click", clearTasks);

function addTask() {
  if (inputBox.value === '') {
    alert("Please enter a task.");
  }
  else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;

    let deleteBtn = document.createElement("span");
    deleteBtn.textContent = "\u00d7";
    deleteBtn.classList.add("delete-btn");
    li.appendChild(deleteBtn);

    listContainer.appendChild(li);
    inputBox.value = "";
    inputBox.focus();
    updateCounters();
    saveTasks();
  }
}

listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        updateCounters();
        saveTasks();
    }
    else if (e.target.classList.contains("delete-btn")) {
        e.target.parentElement.remove();
        updateCounters();
        saveTasks();
    }
});

listContainer.addEventListener("dblclick", function(e) {
    if (e.target.tagName === "LI") {
        const newTaskText = prompt("Edit task:", e.target.firstChild.nodeValue.trim());
        if (newTaskText !== null) {
            e.target.firstChild.nodeValue = newTaskText.trim();
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
  const tasks = [];
  const taskElements = listContainer.getElementsByTagName("li");
  for (let i = 0; i < taskElements.length; i++) {
    const taskText = taskElements[i].childNodes[0].nodeValue.trim();
    const isChecked = taskElements[i].classList.contains("checked");
    tasks.push({ text: taskText, checked: isChecked });
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  listContainer.innerHTML = "";
  tasks.forEach(task => {
    let li = document.createElement("li");
    li.innerHTML = task.text;
    if (task.checked) {
      li.classList.add("checked");
    }

    let deleteBtn = document.createElement("span");
    deleteBtn.textContent = "\u00d7";
    deleteBtn.classList.add("delete-btn");
    li.appendChild(deleteBtn);

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

  clearActiveFilterBtn(); // troca a chamada
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
loadTasks();
updateCounters();