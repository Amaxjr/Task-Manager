const inputBox = document.getElementById("task-input");
const listContainer = document.getElementById("task-list");
const counterTask = document.getElementById("task-count");
const form = document.getElementById("add-task-form");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  addTask();
});

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
    updateTaskCounter();
    saveTasks();
  }
}

listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveTasks();
    }
    else if (e.target.classList.contains("delete-btn")) {
        e.target.parentElement.remove();
        updateTaskCounter();
        saveTasks();
    }
});

function updateTaskCounter() {
  const taskCount = listContainer.getElementsByTagName("li").length;
  counterTask.textContent = taskCount;
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


loadTasks();
updateTaskCounter();