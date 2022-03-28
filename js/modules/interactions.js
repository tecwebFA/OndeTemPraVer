const errorPopup = (error, duration) => {
    const errorIcon = 
    `
    <span class="material-icons error-icon">
        error
    </span>
    `

    const errorMessage = 
    `
    <div class="error-message">
        <p>${error}</p>
    </div>
    `
    // Create a div element, and add the class "error-popup" to it.
    const errorPopup = document.createElement("div")
    errorPopup.classList.add("error-popup")

    // Add the error icon and error message to the div element.
    errorPopup.innerHTML += errorIcon
    errorPopup.innerHTML += errorMessage

    // Append the div element to the body element.
    document.body.appendChild(errorPopup)

    // Set the timeout to hide the error popup.
    setTimeout(() => {
        // Remove the error popup from the body element.
        document.body.removeChild(errorPopup)
    }, duration);

}

const successPopup = (success) => {
    const successIcon = 
    `
    <span class="material-icons success-icon">
        check_circle
    </span>
    `

    const successMessage = 
    `
    <div class="error-message">
        <p>${success}</p>
    </div>
    `
    // Create a div element, and add the class "error-popup" to it.
    const successPopup = document.createElement("div")
    successPopup.classList.add("success-popup")

    // Add the error icon and error message to the div element.
    successPopup.innerHTML += successIcon
    successPopup.innerHTML += successMessage

    // Append the div element to the body element.
    document.body.appendChild(successPopup)   

    // Set the timeout to hide the error popup.
    setTimeout(() => {
        // Remove the error popup from the body element.
        document.body.removeChild(successPopup)
    }, 2000);
}

const startLoadingAnimation = (buttonElement, loaderElement, buttonTextElement, buttonIconElement) => {
    // buttonElement, loaderElement, and buttonTextElement are all DOM elements.

    // start loading animation if loaderElement is hidden
    if (loaderElement.classList.contains("hidden")) {
        buttonElement.style.cursor = 'default'
        buttonElement.disabled = true
        buttonElement.style.justifyContent = 'center'
        
        loaderElement.classList.remove("hidden");
        buttonTextElement.classList.add("hidden");
        
        // Sometimes a button won't have an icon, so only try to hide it if a buttonIconElement exists.
        if (buttonIconElement) {
            buttonIconElement.classList.add("hidden");
        }
    }
}

const endLoadingAnimation = (buttonElement, loaderElement, buttonTextElement) => {
    // buttonElement, loaderElement, and buttonTextElement are all DOM elements.

    // Hide the loading animation if loading animation is present
    if (!loaderElement.classList.contains("hidden")) {
        buttonElement.style.cursor = 'pointer'
        buttonElement.disabled = false
        loaderElement.classList.add("hidden");
        buttonTextElement.classList.remove("hidden");
    }
}

export {startLoadingAnimation, endLoadingAnimation, errorPopup, successPopup}