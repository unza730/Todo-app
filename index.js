let input = document.getElementById("input");
let date = document.getElementById("date");
let refresh = document.getElementById("refresh");
let list = document.getElementById("list");
let add = document.getElementById("add");
const options = { weekday: "long", month: "long", day: "numeric" };
let today = new Date();
let currentDate = today.toLocaleDateString("en-US", options);
date.innerHTML = currentDate;

let CHECK = "fa-check-circle";
let UNCHECK = "fa-circle-notch";
let trash = "fa-trash-restore";
let PIN = "fa-thumbtack";
let LIST = [],
  id = 0;

// Get items from local storage
let data = localStorage.getItem("TODO");
if (data) {
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST); // Load the list to the UI
} else {
  LIST = [];
  id = 0;
}

function loadList(arr) {
  arr.forEach(function (item) {
    addToDo(item.name, item.id, item.done, item.trash, item.pinned, item.memo);
  });
}

function addToDo2(toDo, id, done, trash, pinned, memo, isLastPinned = false) {
    console.log("islastPinned","todo",toDo, isLastPinned)
    if (trash) return;
  
    const DONE = done ? CHECK : UNCHECK;
    const MEMO = memo
      ? `<div class="memo" style="margin-left: 56px;">${memo}</div>`
      : "";
  
    // Task HTML
    
    let item = `
    <div>
   <li id="item" class="task-item" style="position: relative;">
 ${pinned ? `📌` : '<p></p> '}
   
    <i class="fas ${DONE}" style="font-size: 23px; cursor:pointer" id="${id}" job="complete"></i>
    <p class="text" style="margin-left:15px;">${toDo}</p>
    <div class="overflow-menu" style="position: absolute; right: 0px; top: 0px; display: flex; flex-direction: column; align-items: end;">
      <i class="fas fa-ellipsis-h" style="font-size: 18px; cursor:pointer; float: right" job="menu" data-id="${id}"></i>
      <div class="menu-options" id="menu-${id}" style="display: none; cursor:pointer; padding: 12px 33px; background: black; color: white;">
        <p style="cursor: pointer;" job="pin" data-id="${id}">${pinned ? "Unpin" : "Pin on Top"}</p>
        <p style="cursor: pointer;"  job="memo" data-id="${id}">Add Memo</p>
        <p style="cursor: pointer;"  job="delete" data-id="${id}">Delete</p>
      </div>
    </div>
  </li>
  </div>
  ${MEMO}
`;

  
    // Add separator if this is the last pinned item
    if (isLastPinned) {
      item += `<hr style="border: 1px solid white; margin: 10px 0;">`;
    }
  console.log("item: ", item)
    // Append the task based on whether it is pinned or not
    const position = pinned ? "afterbegin" : "beforeend";
    list.insertAdjacentHTML(position, item);
  }
  function addToDo(toDo, id, done, trash, pinned, memo, isLastPinned = false) {
    if (trash) return;
  
    const DONE = done ? CHECK : UNCHECK;
    const MEMO = memo ? `<div class="memo">${memo}</div>` : "";
  
    let item = `
     <li id="item"  class="task-item"  style="margin-left: ${pinned ? '0px' : '20px'};">


        ${pinned ? "📌" : ""}
        <i class="fas ${DONE}" id="${id}" job="complete" style="cursor:pointer;"></i>
        <p class="text">${toDo}</p>
        <div class="overflow-menu">
          <i class="fas fa-ellipsis-h" job="menu" data-id="${id}"></i>
          <div class="menu-options" id="menu-${id}">
            <p job="pin" data-id="${id}">${pinned ? "Unpin" : "Pin on Top"}</p>
            <p job="memo" data-id="${id}">Add Memo</p>
            <p job="delete" data-id="${id}">Delete</p>
          </div>
        </div>
      </li>
      ${MEMO}
    `;
  // Add separator if this is the last pinned item
  if (isLastPinned) {
    item += `<hr style="border: 1px solid white; margin: 10px 0;">`;
  }
    const position = pinned ? "afterbegin" : "beforeend";
    list.insertAdjacentHTML(position, item);
  }
  
  
  function loadList(arr) {
    // Separate pinned and regular tasks
    const pinnedTasks = arr.filter((item) => item.pinned && !item.trash);
    const regularTasks = arr.filter((item) => !item.pinned && !item.trash);
  
    // Render pinned tasks
    pinnedTasks.forEach((item, index) => {
      const isLastPinned = index === 0; // Check if it's the last pinned task
      addToDo(item.name, item.id, item.done, item.trash, item.pinned, item.memo, isLastPinned);
    });
  
    // Render regular tasks
    regularTasks.forEach((item) => {
      addToDo(item.name, item.id, item.done, item.trash, item.pinned, item.memo);
    });
  }
  

document.addEventListener("keyup", function (event) {
  if (event.keyCode == 13) {
    const toDo = input.value;
    if (toDo) {
      addToDo(toDo, id, false, false, false, "");
      LIST.push({
        name: toDo,
        id: id,
        done: false,
        trash: false,
        pinned: false,
        memo: "",
      });
      localStorage.setItem("TODO", JSON.stringify(LIST));
      id++;
    }
    input.value = "";
  }
});

function completeToDo(element, menuId) {
    console.log("element from complete todo", element)
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  LIST[menuId].done = LIST[menuId].done ? false : true;
}

function removeToDo(element, menuId) {
  element.parentNode.remove();
  LIST[menuId].trash = true;
  localStorage.setItem("TODO", JSON.stringify(LIST)); // Ensure list is saved after removal
  location.reload(); // Refresh the page
}

function pinToDo(element, menuId) {
  console.log("pinToDo called ", LIST, element);
  console.log("LIST[elemt.id] = ", LIST[menuId].pinned);
  LIST[menuId].pinned = !LIST[menuId].pinned;
  localStorage.setItem("TODO", JSON.stringify(LIST)); // Save the updated list
  location.reload(); // Refresh the page to reflect the pinned task on top
}

function addMemoToDo(element, menuId) {
  let memo = prompt("Enter your memo:");
  console.log("memo menu id", menuId, LIST);
  if (memo) {
    LIST[menuId].memo = memo;
    const ll = document.querySelector("#item");
    // document.querySelector(`#item`).insertAdjacentHTML('beforeend', `<p class="memo"> ${memo}</p>`);
    localStorage.setItem("TODO", JSON.stringify(LIST)); // Save the updated list with memo
  }
  location.reload(); // Refresh the page
}

list.addEventListener("click", function (event) {
  console.log("Clicked element: ", event.target);

  const element = event.target; // The clicked element
  const elementJob = element.attributes.job ? element.attributes.job.value : ""; // Get the job attribute
  console.log("elementJob: ", elementJob);
console.log("element: ", element);
  // Find the closest parent `li` element
  const taskElement = element.closest(".task-item");
  const dataId = element.getAttribute("data-id");
  console.log("dataId: ", dataId);
  if (!taskElement) {
    console.log("Task element not found");
    return; // Exit if no task element is found
  }

  // Get the task ID from the data-id attribute
  const taskId = element.getAttribute("id");
// const taskId = element.getElementById("item");
  console.log("taskId: ", taskId);

  const menuId = taskId; // Menu ID is the same as task ID
  const task = LIST.find((t) => t.id == taskId); // Find the corresponding task in the LIST

//   if (!task) {
//     console.log("Task not found in LIST");
//     return; // Exit if no task is found
//   }

  // Perform actions based on the job
  if (elementJob === "complete") {
    completeToDo(element, dataId);
  } else if (elementJob === "delete") {
    removeToDo(element, dataId);
  } else if (elementJob === "pin") {
    pinToDo(element, dataId);
  } else if (elementJob === "memo") {
    addMemoToDo(element, dataId);
} else if (elementJob === "menu") {
    // Toggle the visibility of the menu
    const menu = document.getElementById(`menu-${dataId}`);
    console.log("Toggling visibility of menu from ", menu);
    if (menu) {
        menu.style.display = menu.style.display === "none" ? "block" : "none";
        menu.style.width = "auto";
    menu.style.height = "auto";
    menu.style.zIndex = "99999";
    }
  }
  
  // Close menus when clicking outside
  document.addEventListener("click", function (event) {
      if (!event.target.closest(".overflow-menu")) {
          document.querySelectorAll(".menu-options").forEach(menu => {
              menu.style.display = "none";
          });
      }
  });

  // Update local storage
  localStorage.setItem("TODO", JSON.stringify(LIST));
});


refresh.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});

// Date navigation
document.getElementById("prevDate").addEventListener("click", function () {
  today.setDate(today.getDate() - 1);
  currentDate = today.toLocaleDateString("en-US", options);
  date.innerHTML = currentDate;
});

document.getElementById("nextDate").addEventListener("click", function () {
  today.setDate(today.getDate() + 1);
  currentDate = today.toLocaleDateString("en-US", options);
  date.innerHTML = currentDate;
});
