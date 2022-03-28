// Import UI Interactions
import {
    startLoadingAnimation,
    endLoadingAnimation,
    successPopup,
    errorPopup
} from "./modules/interactions.js"

document.querySelector("#login_btn").addEventListener('click', (e) => {
    e.preventDefault();

    window.location.replace('../index.html')
})

// Dropdown Menu
document.querySelector("#profile-dropdown").addEventListener("click", (e) => {
    // Hide/show the dropdown menu when arrow is clicked
    document.querySelector(".dropdown-content").classList.toggle("show");
});

document.getElementById("profile-dropdown").addEventListener("click", (e) => {
    e.preventDefault();

    if (document.querySelector(".dropdown-content").classList.contains("show")) {
        document.getElementById("profile-dropdown").children[0].innerHTML = "close"
    } else {
        document.getElementById("profile-dropdown").children[0].innerHTML = "menue"
    }
}) 