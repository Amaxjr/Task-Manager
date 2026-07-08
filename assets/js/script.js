console.log("Welcome to my Task Manager!");

const taskForm = document.getElementById("add-task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

console.log("Form:", taskForm);
console.log("Input:", taskInput);
console.log("List:", taskList);

let tasks = [];

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      text: taskInput.value,
      completed: false
    };

    tasks.push(newTask);
    taskInput.value = "";
    console.log(tasks);
});