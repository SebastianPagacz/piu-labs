const boards = document.querySelectorAll(".board");
const colors = ["#1b5322", "#531c1b", "#531b39", "#531b29", "#1b4153", "#bab445", "#45ba58", "#ba45ac"];
// To do board
const addToDoButton = document.getElementById("add-to-do");
const toDoBoard = document.getElementById("to-do-board");
const toDoSort = document.getElementById("to-do-sort");
const toDoColor = document.getElementById("to-do-color");

// In progress board
const addInProgressButton = document.getElementById("add-in-progress");
const inProgressBoard = document.getElementById("in-progress-board");
const inProgressSort = document.getElementById("in-progress-sort");
const inProgressColor = document.getElementById("in-progress-color");


// Done board
const addDoneButton = document.getElementById("add-done");
const doneBoard = document.getElementById("done-board");
const doneSort = document.getElementById("done-sort");
const doneColor = document.getElementById("done-color");

// localstorage handling

function loadFromLocalStorage(){
    tasks.forEach(taskObject => {
        const task = document.createElement("div");

        task.innerText = taskObject.content;
        task.id = taskObject.id;
        task.draggable = true;
        task.style.backgroundColor = taskObject.color;

        task.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.id);
        });

        parentBoard = document.getElementById(taskObject.board);
        parentBoard.appendChild(task);
        attachDeleteButton(task);
        attachColorButton(task);
    })
}

function updateLocalStorage(){
    const currentTasks = [];

    const allTasks = document.querySelectorAll('[id^="task-"]');

    allTasks.forEach(taskElement => {
        let cleanText = "";

        taskElement.childNodes.forEach(node => {
            if (node.nodeType == 3){
                cleanText += node.nodeValue;
            }
        });

        const taskObject = {
            id: taskElement.id,
            content: cleanText,
            board: taskElement.parentElement.id,
            color: taskElement.style.backgroundColor
        };
        currentTasks.push(taskObject);
    });

    localStorage.setItem('tasks', JSON.stringify(currentTasks));
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// drag and drop handling
boards.forEach(container => {
    container.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    
    container.addEventListener("drop", (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const draggedElement = document.getElementById(id);

        if(e.target.classList.contains("board")){
            e.target.appendChild(draggedElement);
        }
        else if(e.target.parentElement.classList.contains("board")){
            e.target.parentElement.appendChild(draggedElement);
        }
        
        updateLocalStorage();
    });
});

// Task edition
const editPopUp = document.getElementById("pop-up");
const editInput = document.getElementById("edit-task");
const editColor = document.getElementById("edit-color");
const saveEditBtn = document.getElementById("save-changes-btn");
const cancelEditBtn = document.getElementById("cancel-changes-btn");

// editing single card

let currentTaskToEdit = null;

function openEditPopUp(taskElement){
    currentTaskToEdit = taskElement;

    let currentText = "";
    taskElement.childNodes.forEach(node => {
        if(node.nodeType === 3) currentText += node.nodeValue;
    })

    editInput.value = currentText.trim();

    editPopUp.classList.remove("hidden");
}

saveEditBtn.addEventListener("click", () => {
    if (!currentTaskToEdit) return;

    const newText = editInput.value;
    const newColor = editColor.value;

    let textNode = null;
    currentTaskToEdit.childNodes.forEach(node => {
        if(node.nodeType === 3) textNode = node;
    });

    if (textNode) {
        textNode.nodeValue = newText;
    } else {
        currentTaskToEdit.prepend(document.createTextNode(newText));
    }

    if(newColor) {
        currentTaskToEdit.style.backgroundColor = newColor;
    }

    updateLocalStorage();
    editPopUp.classList.add("hidden");
    currentTaskToEdit = null;
});

cancelEditBtn.addEventListener("click", () => {
    editPopUp.classList.add("hidden");
    currentTaskToEdit = null;
})

// Color of all tasks
const colorPopUp = document.getElementById("color-pop-up")
const editColorAll = document.getElementById("edit-color-all");
const saveEditColorBtn = document.getElementById("save-changes-color-btn");
const cancelEditColorBtn = document.getElementById("cancel-changes-color-btn");

let currentBoardToColor = null;

function openColorEditPopUp(board){
    currentBoardToColor = board;
    colorPopUp.classList.remove("hidden");
}

saveEditColorBtn.addEventListener("click", () => {
    if(!currentBoardToColor) return;

    const newColor = editColorAll.value;

    const tasksInBoard = currentBoardToColor.querySelectorAll('[id^="task-"]');

    tasksInBoard.forEach(task => {
        task.style.backgroundColor = newColor;
    });

    updateLocalStorage();
    colorPopUp.classList.add("hidden");
    currentBoardToColor = null;
})

cancelEditColorBtn.addEventListener("click", () => {
    colorPopUp.classList.add("hidden");
    currentBoardToColor = null;
})

// Cards DOM manipulation

function attachDeleteButton(taskElement){
    const deleteTask = document.createElement("span");
    deleteTask.classList.add("delete-task");
    deleteTask.innerText = "❌";
        
    deleteTask.addEventListener("click", () => {
        taskElement.remove();
        updateLocalStorage();
    });    

    taskElement.appendChild(deleteTask);
}

function attachColorButton(taskElement){
    const colorTask = document.createElement("span");
    colorTask.classList.add("change-color");
    colorTask.innerText = "🎨";
        
    colorTask.addEventListener("click", () => {
        openEditPopUp(taskElement);
    });    

    taskElement.appendChild(colorTask);
}

// Cards sorting

function sortCards(board){
    const tasks = Array.from(board.querySelectorAll('[id^="task-"]'));

    tasks.sort((a, b) =>{
        const textA = a.innerText.toLowerCase();
        const textB = b.innerText.toLowerCase();

        return textA.localeCompare(textB);
    });

    tasks.forEach(task => {
        board.appendChild(task);
    });

    updateLocalStorage();
}

// App start

loadFromLocalStorage();

// Evnet listeners

// boards sorting
toDoSort.addEventListener("click", () => {
    sortCards(toDoBoard);
})

inProgressSort.addEventListener("click", () => {
    sortCards(inProgressBoard);
})

doneSort.addEventListener("click", () => {
    sortCards(doneBoard);
})

// boards coloring
toDoColor.addEventListener("click", () => {
    openColorEditPopUp(toDoBoard);
})

inProgressColor.addEventListener("click", () => {
    openColorEditPopUp(inProgressBoard);
})

doneColor.addEventListener("click", () => {
    openColorEditPopUp(doneBoard);
})

// addign tasks
addToDoButton.addEventListener("click", () => {
    addTask(toDoBoard);
})

addInProgressButton.addEventListener("click", () => {
    addTask(inProgressBoard);
})

addDoneButton.addEventListener("click", () => {
    addTask(doneBoard);
})

function addTask(currentBoard) {
    let textValue = window.prompt("Please enter the task name");
    
    while(textValue == ""){
        textValue = window.prompt("Please enter the task name");
    }
    
    if(textValue == null){
        return;
    }

    const task = document.createElement("div");
    task.innerText = textValue;
    task.draggable = "true";
    task.style.backgroundColor = colors[Math.floor(Math.random()*8)]
    task.id = "task-" + Date.now(); // Unique id for each element
    
    task.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.id);
    });

    currentBoard.appendChild(task);
    
    attachDeleteButton(task);
    attachColorButton(task);
    updateLocalStorage();
}