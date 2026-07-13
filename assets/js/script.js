const inputBox = document.getElementById("task-input");
const listContainer = document.getElementById("task-list");
const counterTask = document.getElementById("task-count"); 

function addTask() {
  if (inputBox.value === '') {
    alert("Please enter a task.");
  }
  else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;

   
    let deleteBtn = document.createElement("span");
    deleteBtn.innerHTML = "\u00d7"; 
    deleteBtn.classList.add("delete-btn");
    li.appendChild(deleteBtn);

    listContainer.appendChild(li);
    inputBox.value = ""; 

    updateTaskCounter(); 
  }
}

listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
    }
    else if (e.target.classList.contains("delete-btn")) {
        e.target.parentElement.remove(); 
        updateTaskCounter(); 
    }
});
function updateTaskCounter() {
  const taskCount = listContainer.getElementsByTagName("li").length;
  counterTask.textContent = taskCount; 
}
updateTaskCounter(); 