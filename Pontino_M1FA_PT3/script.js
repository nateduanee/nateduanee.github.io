document.addEventListener("DOMContentLoaded", function () {
    const leftChild = document.querySelector(".leftChild");

    // Array of projects
    const projects = [
        { name: "Explore PH Tours", url: "http://nateduanee.github.io/ExplorePHTours/PontinoExplorePHTours.html" },
        { name: "2nd Term Course Schedule", url: "http://nateduanee.github.io/Pontino/PontinoCourseSchedule.html" }
    ];

    // Function to generate project list dynamically
    function generateProjects() {
        return `
            <div class="leftGrandChild" id="leftProjects">
                <ul>
                    <h1>${projects.map(project => `<li><a href="${project.url}" target="_blank">${project.name}</a></li>`).join("")}</h2>
                </ul>
            </div>
        `;
    }

    // Content mapping (default content + dynamic projects)
    const contentMap = {
        "rightAbout": `
            <div class="leftGrandChild" id="leftAbout">
                <h1>Nathan Duane Pontino</h1>
                <p>3rd Year Computer Science Student</p>
                <p>Digital Portfolio Showcase</p>
            </div>
        `,
        "rightProjects": generateProjects(), // Dynamically generate projects
        "rightContacts": `
            <div class="leftGrandChild" id="leftContacts">
                <ul>
                    <li><img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="Github Logo">
                        <a href="https://github.com/nateduanee"><h2>nateduanee</h2></a>
                    </li>
                    <li><img src="https://img.freepik.com/premium-vector/youtube-logo-with-red-square_876006-17.jpg" alt="Youtube Logo">
                        <a href="https://www.youtube.com/@nathanduanepontino5690"><h2>Nathan Duane Pontino</h2></a>
                    </li>

                    <li><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/2203px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png" alt="Onedrive Logo">
                        <a href="mailto:ndpontino@mcm.edu.ph"><h2>Email: ndpontino@mcm.edu.ph</h2></a>
                    </li>
                </ul>
            </div>
        `
    };

    // Set default content to "About" section
    leftChild.innerHTML = contentMap["rightAbout"];

    // Attach click events to right container buttons
    Object.keys(contentMap).forEach(rightId => {
        const rightElement = document.getElementById(rightId);
        if (rightElement) {
            rightElement.addEventListener("click", function () {
                leftChild.innerHTML = contentMap[rightId]; // Update content dynamically
            });
        }
    });
});
