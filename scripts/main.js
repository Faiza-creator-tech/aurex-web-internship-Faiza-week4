let tasks = [];
let currentFilter = "all";

const taskform = document.getElementById("taskform");
const taskinput = document.getElementById("taskinput");
const tasklist = document.getElementById("tasklist");
const errorMsg = document.getElementById("errorMsg");
const FilterButtons = document.querySelectorAll(".filter-btn");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
  }
}

function renderTasks() {
  tasklist.innerHTML = "";
  let filteredTasks = tasks;
  if (currentFilter === "active") {
    filteredTasks = tasks.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  }
  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "  ");
    li.dataset.id = task.id;
    li.innerHTML = `
        <span class="task-text">${escapeHTML(task.text)}</span>
        <button class = "complete-btn">${task.completed ? "Undo" : "Done"}</button>
        <button class ="edit-btn">Edit</button>
        <button class ="delete-btn">Delete</button> `;
    tasklist.appendChild(li);
  });
}
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
taskform.addEventListener("submit" , function(e){
    e.preventDefault();
    const value = taskinput.value.trim();
    if(value===""){
        errorMsg.textContent = "Task cannot be empty";
        return;
    }
    errorMsg.textContent = " ";
    const newTask = {
        id : Date.now().toString(),
        text : value,
        completed : false

    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskform.reset();

});
tasklist.addEventListener( "click" , function(e){
const li = e.target.closest(".task-item");
if(!li) return;
const id = li.dataset.id;
if(e.target.classList.contains("delete-btn")){
deleteTask(id);
}
if(e.target.classList.contains("complete-btn")){
    toggleComplete(id);
}
if(e.target.classList.contains("edit-btn")){
    startEdit(li, id);
}
});
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}
 
function toggleComplete(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}
 
function startEdit(li, id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
 
  li.innerHTML = `
    <input type="text" class="edit-input" value="${escapeHTML(task.text)}" />
    <button class="save-btn">Save</button>
    <button class="cancel-btn">Cancel</button>
  `;
 
  const input = li.querySelector(".edit-input");
  input.focus();
 
  li.querySelector(".save-btn").addEventListener("click", () => {
    const newValue = input.value.trim();
    if (newValue === "") {
      alert("Task cannot be empty.");
      return;
    }
    tasks = tasks.map(t => (t.id === id ? { ...t, text: newValue } : t));
    saveTasks();
    renderTasks();
  });
 
  li.querySelector(".cancel-btn").addEventListener("click", () => {
    renderTasks();
  });
}
FilterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    FilterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});
loadTasks();
renderTasks();



