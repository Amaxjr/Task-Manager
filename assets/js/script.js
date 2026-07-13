const inputBox = document.getElementById("task-input");
const listContainer = document.getElementById("task-list");

function addTask() {
  if (inputBox.value === '') {
    alert("Please enter a task.");
  }
  else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    console.log(li);
    listContainer.appendChild(li);
  }
}
listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
    }
});
inputBox.value = "";