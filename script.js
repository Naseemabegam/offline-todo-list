const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const priorityInput = document.getElementById("priorityInput");
const timeInput = document.getElementById("timeInput");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const dateTitle = document.getElementById("dateTitle");
const dayTitle = document.getElementById("dayTitle");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const progressCircle = document.getElementById("progressCircle");

const taskSummary = document.getElementById("taskSummary");
const taskCount = document.getElementById("taskCount");


// ================================
// LOAD SAVED TASKS
// ================================

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];


// Selected date
let selectedDate = new Date();


// ================================
// GET DATE KEY
// ================================

function getDateKey(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ================================
// DISPLAY DATE
// ================================

function updateDateDisplay() {

    const options = {
        month: "long",
        day: "numeric",
        year: "numeric"
    };

    dateTitle.textContent =
        selectedDate.toLocaleDateString(
            "en-US",
            options
        );

    dayTitle.textContent =
        selectedDate.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );
}


// ================================
// DISPLAY TASKS
// ================================

function displayTasks() {

    updateDateDisplay();

    const dateKey = getDateKey(selectedDate);

    const todayTasks = tasks.filter(
        task => task.date === dateKey
    );

    taskList.innerHTML = "";


    // Task count

    taskCount.textContent =
        `${todayTasks.length} ${
            todayTasks.length === 1
                ? "task"
                : "tasks"
        }`;


    // Empty message

    emptyMessage.style.display =
        todayTasks.length === 0
            ? "block"
            : "none";


    // Display each task

    todayTasks.forEach(task => {

        const div = document.createElement("div");

        div.className = "task-card";


        if (task.completed) {
            div.classList.add("completed");
        }


        div.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <div class="task-content">

                <div class="task-text">
                    ${task.text}
                </div>

                <div class="task-meta">

                    <span class="badge">
                        ${task.category}
                    </span>

                    <span class="badge">
                        ${task.priority}
                    </span>

                    ${
                        task.time
                            ? `<span class="badge">
                                ⏰ ${task.time}
                               </span>`
                            : ""
                    }

                </div>

            </div>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
            >
                🗑️
            </button>

        `;

        taskList.appendChild(div);

    });


    // Update progress

    updateProgress(todayTasks);
}


// ================================
// ADD TASK
// ================================

function addTask() {

    const text = taskInput.value.trim();


    // Check empty task

    if (!text) {

        alert("Please enter a task.");

        taskInput.focus();

        return;
    }


    // Create new task

    const newTask = {

        id: Date.now(),

        date: getDateKey(selectedDate),

        text: text,

        category: categoryInput.value,

        priority: priorityInput.value,

        time: timeInput.value,

        completed: false

    };


    // Add to array

    tasks.push(newTask);


    // Save

    saveTasks();


    // Clear inputs

    taskInput.value = "";

    timeInput.value = "";


    // Show updated tasks

    displayTasks();


    // Focus task input

    taskInput.focus();
}


// ================================
// COMPLETE / UNCOMPLETE TASK
// ================================

function toggleTask(id) {

    const task = tasks.find(
        task => task.id === id
    );


    if (task) {

        task.completed =
            !task.completed;

    }


    saveTasks();

    displayTasks();
}


// ================================
// DELETE TASK
// ================================

function deleteTask(id) {

    const confirmed =
        confirm("Delete this task?");


    if (!confirmed) {
        return;
    }


    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    displayTasks();
}


// ================================
// UPDATE PROGRESS
// ================================

function updateProgress(todayTasks) {

    const total =
        todayTasks.length;


    const completed =
        todayTasks.filter(
            task => task.completed
        ).length;


    // No tasks

    if (total === 0) {

        progressText.textContent = "0%";

        progressCircle.textContent = "0%";

        progressFill.style.width = "0%";

        taskSummary.textContent =
            "0 of 0 tasks completed";

        return;
    }


    // Calculate percentage

    const percentage =
        Math.round(
            (completed / total) * 100
        );


    progressText.textContent =
        percentage + "%";


    progressCircle.textContent =
        percentage + "%";


    progressFill.style.width =
        percentage + "%";


    taskSummary.textContent =
        `${completed} of ${total} tasks completed`;
}


// ================================
// CHANGE DATE
// ================================

function changeDate(days) {

    selectedDate.setDate(
        selectedDate.getDate() + days
    );


    displayTasks();
}


// ================================
// GO TO TODAY
// ================================

function goToday() {

    selectedDate = new Date();

    displayTasks();
}


// ================================
// SAVE TASKS
// ================================

function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );
}


// ================================
// ENTER KEY
// ================================

taskInput.addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ================================
// INITIAL LOAD
// ================================

displayTasks();