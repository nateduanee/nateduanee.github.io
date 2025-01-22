const sBtn = document.getElementById("submitBtn");
const nPass = document.getElementById("nPassTxtBox");
const cPass = document.getElementById("cPassTxtBox");
const successPass = document.getElementById("successPass");
const unsuccessPass = document.getElementById("unsuccessPass");
const changePassForm =  document.getElementById("changePassForm");

successPass.classList.add("hidden");
unsuccessPass.classList.add("hidden");

changePassForm.addEventListener("submit", (e) => {
    e.preventDefault();
})

sBtn.addEventListener("click", () => {

let errorText = false;

if (!nPass.value || !cPass.value){
errorText = true;
}

if(!errorText){
        if (nPass.value === cPass.value) {
            successPass.classList.remove("hidden");
            unsuccessPass.classList.add("hidden");
        } else {
            unsuccessPass.classList.remove("hidden");
            successPass.classList.add("hidden");
        } 
    }
});
