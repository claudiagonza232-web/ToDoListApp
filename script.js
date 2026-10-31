/* To-do List App */ 

// Get HTML elements
const taskInput = document.getElementById("new-task");
const priorityInput = document.getElementById("task-priority");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const taskError = document.getElementById("task-error");

// Store tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// select task 
let doingNowId = null;

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
localStorage.setItem("tasks", JSON.stringify(tasks));
displayTasks();

// Clear input 
taskInput.value = "";
priorityInput.value = "low";
}

// Complete or restore a task
function toggleComplete(taskId) {
    const task = tasks.find(task => task.id === taskId);
    
    if (task) {

        if(doingNowId === taskId) {
            selectDoingNow(taskId);
        }

        task.completed = !task.completed;

        tasks = tasks.filter(item => item.id !== taskId);
        tasks.push(task);
        //save changes 
        localStorage.setItem("tasks", JSON.stringify(tasks));
        
        //Refresh task list
        displayTasks();
    }
}

function editTask(taskId) {
    const task = tasks.find(task => task.id === taskId);

    if(!task) {
        return;
    }
    const newTitle = prompt("Edit task title:", task.title);

    if(newTitle === null){
        return;
    }
    if (newTitle.trim() === "") {
        alert("Task title cannot be empty.");
        return;
    }

    task.title = newTitle.trim();

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

//Delete a task
function deleteTask(taskId) {
    const confirmDelete= confirm("Are you sure you want to delete this task?");
    if(!confirmDelete){
        return;
    }
    tasks = tasks.filter(task => task.id !== taskId);
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

//changes task priority 
function changePriority(taskId, newPriority) {
    const task = tasks.find(task => task.id === taskId);

    if(!task || task.priority === newPriority) {
        return;
    }

    task.priority = newPriority;

   //move active tasks to the end of its new priority group
   if(!task.completed) {
       tasks = tasks.filter(item => item.id !== taskId);
       tasks.push(task);
   }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

// Select the current task being focused on
function selectDoingNow(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if(!task || task.completed) {
        return;
    }

    //clicking the same task again clears it 

    doingNowId = doingNowId === taskId ? null : taskId;

    //to update current task 
    document.getElementById("doing-task-name").textContent = 
    doingNowId === null ? "Current Task: None" : "Current Task: " + task.title;

    //start only when task is selected 
    document.getElementById("start-timer").disabled = doingNowId === null;
    displayTasks();
}
    

// Display tasks
function displayTasks(){
    taskList.innerHTML = "";

    //Sort by priority 
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    const sortedTasks = [...tasks].sort((a,b) => {
    if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
    }

    // Keep completed tasks in completion order
    if(a.completed && b.completed) {
        return 0;
    }
    
    return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    sortedTasks.forEach(task => {
        const taskDiv = document.createElement("div");

        taskDiv.className = "task-item";

        if(doingNowId === task.id) {
            taskDiv.classList.add("doing-now");
        }

        if(task.completed) {
            taskDiv.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => { toggleComplete(task.id);
    });
    
    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title; 

    const priority = document.createElement("span");
    priority.className = task.priority;
    priority.textContent = task.priority;
    
    //Priority change dropdown
    const prioritySelect = document.createElement("select");
    ["high", "medium", "low"].forEach(level => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        prioritySelect.appendChild(option);
    });
    prioritySelect.value = task.priority;
    prioritySelect.addEventListener("change", () => {
        changePriority(task.id, prioritySelect.value);
    });
    // Doing now button
    const doingButton = document.createElement("button");
    
    doingButton.textContent = doingNowId === task.id ? "Clear" : "Doing Now";
    doingButton.disabled = task.completed;

    doingButton.addEventListener("click", () => {
        selectDoingNow(task.id);
    });

    taskDiv.appendChild(doingButton);

    //Edit Button 
    const editButton = document.createElement("button");
    editButton.textContent = "Edit"; 

    editButton.addEventListener("click", () => {
        editTask(task.id);
    }); 

    //Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
    });

    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";

    priority.textContent = task.priority + " priority";

     taskInfo.appendChild(title);
     taskInfo.appendChild(priority);

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskInfo);
    taskDiv.appendChild(prioritySelect);
    taskDiv.appendChild(doingButton);
    taskDiv.appendChild(editButton);
    taskDiv.appendChild(deleteButton);


    taskList.appendChild(taskDiv);
});

//Update task summary 
const completedTasks = tasks.filter(task => task.completed);
const activeTasks = tasks.filter(task => !task.completed);

    document.getElementById("todo-count").textContent = activeTasks.length;
    document.getElementById("completed-count").textContent = completedTasks.length;
}

//add a button event 
addTaskButton.addEventListener("click",addTask);

//Displays saved tasks on page load
displayTasks();
