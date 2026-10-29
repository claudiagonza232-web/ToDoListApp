/* To-do List App */ 

// Get HTML elements
const taskInput = document.getElementById("new-task");
const priorityInput = document.getElementById("priority");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const taskError = document.getElementById("task-error");

// Store tasks
let tasks = [];

// Add a new task
function addTask() {
    const title = taskInput.value.trim();
    const priority = priorityInput.value;


//Check for empty input
if(title === "") {
    taskError.textContent = "Please enter a task title before adding it";
    return;
}

taskError.textContent = "";

//Creating a task
const task = {
    id: Date.now(),
    title: title,
    priority: priority,
    completed: false
};

tasks.push(task);
displayTasks();

// Clear input 
taskInput.value = "";
priorityInput.value = "low";
}


