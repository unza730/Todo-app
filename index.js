let input = document.getElementById("input");
let date = document.getElementById("date");
let referesh = document.getElementById("refresh");
let List = document.getElementById("list");
let add = document.getElementById("add");
const options ={weekday:"long", month:"long", day:"numeric"};
let today = new Date();
date.innerHTML= today.toLocaleDateString("en-US",options);

let CHECK = "fa-check-circle";
let UNCHECK = "fa-circle-notch";
// let LINETHROUGH = "lineThrough";
let trash = "fa-trash-restore";
let LIST, id;

//get item from local storage
let data = localStorage.getItem("TODO");
//if data in not empty
if(data){
    LIST=JSON.parse(data);
    id = LIST.length;
    loadList(LIST);//load the lis to the user interface
}
else{
    //if data is epmty
    LIST=[];
    id=0;
}
function loadList(arr){
    arr.forEach(function(itemm) {
        addToDo(itemm.name, itemm.id, itemm.done, itemm.trash);
    });
}

referesh.addEventListener("click",function(){
    localStorage.clear();
    location.reload();
})

function addToDo (toDo,id, done,trash){
    if(trash){
        return trash;
    }
    const DONE = done ? CHECK: UNCHECK;
    // const LINE= done? LINETHROUGH :" ";
    let item = `<li id="item">
    <i class="fas ${DONE}" style="font-size: 23px; cursor:pointer " id="${id}" job="complete"></i>
    <p class="text " style="margin-left:15px;"> ${toDo}</p>
    <i class="fas  fa-trash-restore ${trash}" job="delete" style="font-size:22px;
     position: absolute; right: 0; margin-right:25px; cursor:pointer" id="${id}"
            style="font-size: 23px; "></i>
    </p>`;
    const position= "beforeend";
    List.insertAdjacentHTML(position,item);
}
document.addEventListener("keyup",function(event){

    if(event.keyCode == 13){
      const toDo = input.value;
      
    //if input is not empty
    if (toDo){
        addToDo (toDo,id,false,false);
        LIST.push({
            name: toDo,
            id:id,
            done:false,
            trash:false,
        });
        //add item to local storage(this code must be added where the array is updates)
       localStorage.setItem("TODO",JSON.stringify(LIST));
        id++;
    }
    input.value="";
}
   
});
function completeToDo(element){
element.classList.toggle(CHECK);
element.classList.toggle(UNCHECK);
LIST[element.id].done=LIST[element.id].done?false:true;
}
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    List[element.id].trash=true;
}
List.addEventListener("click",function(event){
    const element = event.target;
    const elementJob= element.attributes.job.value;
    if(elementJob=="complete"){
        completeToDo(element);
    }
    else if(elementJob=="delete"){
        removeToDo(element);
    }
    //add item to local storage(this code must be added where the array is updates)
localStorage.setItem("TODO",JSON.stringify( LIST));
});