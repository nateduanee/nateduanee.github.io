const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const calcBtn = document.getElementById("calcBtn");
const daysDiffDisplay = document.getElementById("daysDiff");

calcBtn.addEventListener("click", () => {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    if (start && end) {
        const timeDiff = end - start;
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        
        // Display the result in the <p> tag
        daysDiffDisplay.textContent = "The difference is " + daysDiff + " days.";
    } else {
        daysDiffDisplay.textContent = "Please select both dates.";
    }
});
