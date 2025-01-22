const countBtn = document.getElementById("count_Btn");
const counter = document.getElementById("countingUp");

let count = 0;

countBtn.addEventListener("click", ()=>{
//alert("clicked");
console.log(counter.innerHTML)
count++;
counter.innerHTML = count;
});