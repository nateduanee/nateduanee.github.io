const input = document.getElementById("input");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", () => {
    //alert("clicked");
    const task = input.value;
    if (task.trim() !== ""){
        const li = document.createElement("li");
        li.textContent = task; 
        taskList.appendChild(li);
        input.value = "";
}

})