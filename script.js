/* To-do List App */ 

// Get HTML elements
const taskInput = document.getElementById("new-task");
const priorityInput = document.getElementById("task-priority");
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

// Display tasks
function displayTasks(){
    taskList.innerHTML = "";

    //Sort by priority 
    const priorityOrder = { "high": 1, "medium": 2, "low": 3 };
    const sortedTasks = [...tasks].sort((a,b) => { 
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    sortedTasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task-item";

        taskDiv.innerHTML = `
            <span class="task-title">${task.title}</span>
            <span class="${task.priority}">${task.priority}</span>
        `;
        taskList.appendChild(taskDiv);
    }); 
    document.getElementById("todo-count").textContent = tasks.length;
}

//add a button event 
addTaskButton.addEventListener("click",addTask);
