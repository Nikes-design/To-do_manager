// Элементы DOM 
const taskInput = document.getElementById("taskInput"); 
const addBtn = document.getElementById("addBtn"); 
const taskList = document.getElementById("taskList"); 
const filterAll = document.getElementById("filterAll"); 
const filterActive = document.getElementById("filterActive"); 
const filterCompleted = document.getElementById("filterCompleted"); 
const searchInput = document.getElementById("searchInput"); 
// сортировка 
const sortDefault = document.getElementById("sortDefault"); 
const sortAsc = document.getElementById("sortAsc"); 
const sortDesc = document.getElementById("sortDesc"); 
// состояния 
let tasks = []; 
let currentFilter = "all"; 
let currentSort = "default"; 
let isEditing = false; 
// загрузка 
let savedTasks = localStorage.getItem("tasks"); 
if (savedTasks !== null) tasks = JSON.parse(savedTasks); 
let savedSort = localStorage.getItem("currentSort"); 
if (savedSort !== null) currentSort = savedSort; 
// добавление в DOM 
function addTaskToDOM(task) { 
let li = document.createElement("li"); 
   li.classList.add("task-item"); 
 
   let span = document.createElement("span"); 
   span.textContent = task.text; 
 
   if (task.completed) { 
       span.classList.add("completed"); 
   } 
 
   span.addEventListener("click", function () { 
       task.completed = !task.completed; 
       localStorage.setItem("tasks", JSON.stringify(tasks)); 
       render(); 
   }); 
 
   let buttonsContainer = document.createElement("div"); 
   buttonsContainer.classList.add("task-buttons"); 
 
   let editBtn = document.createElement("button"); 
   editBtn.textContent = "Изменить"; 
   editBtn.classList.add("edit-btn"); 
 
   let deleteBtn = document.createElement("button"); 
   deleteBtn.textContent = "Удалить"; 
   deleteBtn.classList.add("delete-btn"); 
 
   buttonsContainer.appendChild(editBtn); 
   buttonsContainer.appendChild(deleteBtn); 
 
   deleteBtn.addEventListener("click", function () { 
       tasks = tasks.filter(function (t) { 
           return t.id !== task.id; 
       }); 
       localStorage.setItem("tasks", JSON.stringify(tasks)); 
       render(); 
   }); 
 
   editBtn.addEventListener("click", function () { 
 
       if (isEditing) { 
           alert("Сначала завершите редактирование другой задачи"); 
           return; 
       } 
 
       isEditing = true; 
 
       let input = document.createElement("input"); 
       input.type = "text"; 
       input.value = task.text; 
 
       li.classList.add("editing"); 
 
       li.replaceChild(input, span); 
 
       input.focus(); 
       input.select(); 
 
       let saveBtn = document.createElement("button"); 
       saveBtn.textContent = "Сохранить"; 
       saveBtn.classList.add("save-btn"); 
 
       let cancelBtn = document.createElement("button"); 
       cancelBtn.textContent = "Отмена"; 
       cancelBtn.classList.add("cancel-btn"); 
 
       buttonsContainer.insertBefore(saveBtn, deleteBtn); 
       buttonsContainer.insertBefore(cancelBtn, deleteBtn); 
 
       function saveTask() { 
           let newText = input.value.trim(); 
 
           if (newText === "") { 
               alert("Задача не может быть пустой"); 
               return; 
           } 
 
           task.text = newText; 
 
           localStorage.setItem("tasks", JSON.stringify(tasks)); 
 
           isEditing = false; 
           render(); 
       } 
 
       saveBtn.addEventListener("click", function () { 
           saveTask(); 
       }); 
 
       input.addEventListener("keydown", function (event) { 
           if (event.key === "Enter") { 
               saveTask(); 
           } 
       }); 
 
       cancelBtn.addEventListener("click", function () { 
           li.replaceChild(span, input); 
           cancelBtn.remove(); 
           saveBtn.remove(); 
           li.classList.remove("editing"); 
 
           isEditing = false; 
       }); 
   }); 
 
   li.appendChild(span); 
   li.appendChild(buttonsContainer); 
 
   taskList.appendChild(li); 
} 
 
// добавление задачи 
function addTask() { 
   let text = taskInput.value.trim(); 
 
   if (text !== "") { 
       let newTask = { 
           id: Date.now(), 
           text: text, 
           completed: false 
       }; 
 
       tasks.push(newTask); 
       localStorage.setItem("tasks", JSON.stringify(tasks)); 
 
       taskInput.value = ""; 
       render(); 
   } 
} 
 
// render 
function render() { 
   taskList.innerHTML = ""; 
 
   let filteredTasks = tasks.slice(); 
 
   if (currentFilter === "active") { 
       filteredTasks = filteredTasks.filter(function (task) { 
           return !task.completed; 
       }); 
   } else if (currentFilter === "completed") { 
       filteredTasks = filteredTasks.filter(function (task) { 
           return task.completed; 
       }); 
   } 
 
   let query = searchInput.value.toLowerCase(); 
 
   if (query !== "") { 
       filteredTasks = filteredTasks.filter(function (task) { 
           return task.text.toLowerCase().includes(query); 
       }); 
   } 
 
   if (currentSort === "asc") { 
       filteredTasks.sort(function (a, b) { 
           return a.text.localeCompare(b.text); 
       }); 
   } 
 
   if (currentSort === "desc") { 
       filteredTasks.sort(function (a, b) { 
           return b.text.localeCompare(a.text); 
       }); 
   } 
 
   for (let i = 0; i < filteredTasks.length; i++) { 
       addTaskToDOM(filteredTasks[i]); 
   } 
} 
 
// события 
addBtn.addEventListener("click", addTask); 
 
taskInput.addEventListener("keydown", function (event) { 
   if (event.key === "Enter") addTask(); 
}); 
 
filterAll.addEventListener("click", function () { 
   currentFilter = "all"; 
   render(); 
}); 
 
filterActive.addEventListener("click", function () { 
   currentFilter = "active"; 
   render(); 
}); 
 
filterCompleted.addEventListener("click", function () { 
   currentFilter = "completed"; 
   render(); 
}); 
 
searchInput.addEventListener("input", function () { 
render(); 
}); 
sortDefault.addEventListener("click", function () { 
currentSort = "default"; 
localStorage.setItem("currentSort", currentSort); 
render(); 
}); 
sortAsc.addEventListener("click", function () { 
currentSort = "asc"; 
localStorage.setItem("currentSort", currentSort); 
render(); 
}); 
sortDesc.addEventListener("click", function () { 
currentSort = "desc"; 
localStorage.setItem("currentSort", currentSort); 
render(); 
}); 
// запуск 
render();