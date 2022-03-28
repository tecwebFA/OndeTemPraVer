// Import UI Interactions
import {
    startLoadingAnimation,
    endLoadingAnimation,
    successPopup,
    errorPopup
} from "./modules/interactions.js"

// User functionalities
import {
    file,
    updateDp,
    updateUsername,
    updateDisplayNameInDOM,
    verifyEmail,
    checkNotifications
} from "./modules/userUpdates.js"

auth.onAuthStateChanged((user) => {
    if (user) {

        // Display user name
        updateDisplayNameInDOM(user)

        // Show the user's pfp
        db.collection('users').doc(user.uid).get().then((doc) => {
            if (doc.data().dp_URL) {
                document.querySelector("#nav_dp").classList.add("skeleton");
                document.querySelector("#nav_dp").src = "";
                document.querySelector("#nav_dp").src = doc.data().dp_URL;
                document.querySelector("#nav_dp").alt = "Profile picture of " + user.displayName;
            }
        })

        // Modal
        openAndCloseModal(user);

        // Email Verification
        if (!user.emailVerified) {
            // Show verify link
            document.querySelector("#verify-email-button").classList.toggle("show");

            // Verify user
            verifyEmail(user)
        } else {
            document.querySelector(".verified").classList.toggle("show")
        }

        // Notifications
        checkNotifications();

        // Logout
        document.getElementById('logout_btn').addEventListener("click", (e) => {
            e.preventDefault();

            // Start loading animation
            startLoadingAnimation(
                document.getElementById('logout_btn'),
                document.querySelector(".loader"),
                document.querySelector(".btn_text"),
                document.querySelector(".logout-icon")
            )

            // Sign the user out
            auth.signOut()
                .catch((error) => {
                    // If signout can't be completed, revert loading animation
                    document.querySelector(".loader").classList.toggle("hidden")
                    document.querySelector(".btn_text").classList.toggle("hidden")
                    window.alert(error)
                });
        })

    } else {
        // If the user is not logged in
        window.location.replace('../index.html')
    }
});

// Dropdown Menu
document.querySelector("#profile-dropdown").addEventListener("click", (e) => {
    // Hide/show the dropdown menu when arrow is clicked
    document.querySelector(".dropdown-content").classList.toggle("show");
});

// Modal
const openAndCloseModal = (currentUser) => {

    // DOM Elements
    const modal = document.querySelector(".modal");
    const openModalButton = document.querySelector("#update-profile-btn");
    const updateButton = document.querySelector("#update");
    const updateProfileForm = document.querySelector(".profile-update-form");
    const profileNameField = document.querySelector("#profile_name");
    const userBioField = document.querySelector("#user_bio");
    const closeModalButton = document.querySelector("#close-modal");

    // Open "update profile" modal when clicked from dropdown menu
    openModalButton.addEventListener("click", (e) => {
        e.preventDefault();

        // Hide the dropdown menu after opening update profile modal
        document.querySelector(".dropdown-content").classList.toggle("show");

        // Show user's email address, current username
        document.querySelector("#profile_email").placeholder = currentUser.email;
        document.querySelector("#profile_name").placeholder = currentUser.displayName;

        // Show the user's bio
        db.collection('users').doc(currentUser.uid).get().then((doc) => {
            if (doc.data().bio !== undefined) {
                document.querySelector("#user_bio").placeholder = doc.data().bio;
            } else {
                document.querySelector("#user_bio").placeholder = "Create your bio"
            }
        })

        // If the modal isn't open:
        if (!modal.classList.contains("show")) {

            // Open the modal
            modal.classList.toggle("show");
        }

        // Upon clicking on "update" button inside modal:
        updateButton.addEventListener("click", (e) => {
            e.preventDefault();

            // Get values
            const newName = profileNameField.value;
            const newBio = userBioField.value;

            // Update displayName
            if (newName !== "") {
                updateUsername(newName).then(() => {
                    // Update username inside Firestore database
                    db.collection('users').doc(currentUser.uid).set({
                        name: newName
                    }, {
                        merge: true
                    })
                })
            }

            // Update bio
            if (newBio !== "") {
                // Update bio inside Firebase database
                db.collection('users').doc(currentUser.uid).set({
                    bio: newBio
                }, {
                    merge: true
                }).then(() => {
                    // Show the user's bio
                    db.collection('users').doc(currentUser.uid).get().then((doc) => {
                        if (doc.data().bio !== undefined) {
                            document.querySelector("#user_bio").placeholder = doc.data().bio;
                        } else {
                            document.querySelector("#user_bio").placeholder = "Create your bio"
                        }
                    })
                }).then(() => {
                    // Success message
                    successPopup("Bio updated successfully!")
                })
            }

            // Update dp
            if (file !== "") {
                // Start the loading animation
                startLoadingAnimation(
                    updateButton,
                    document.querySelector(".update_loader"),
                    document.querySelector(".update_btn_text")
                )

                // Once the pfp has been updated, end the loading animation
                updateDp(currentUser).then(() => {
                    endLoadingAnimation(
                        updateButton,
                        document.querySelector(".update_loader"),
                        document.querySelector(".update_btn_text")
                    )

                    auth.currentUser.reload();
                    updateProfileForm.reset();
                })
            } else {return}

            // Reload the current user and reset the form
            auth.currentUser.reload();
            updateProfileForm.reset();
        })
    })

    // Close modal upon clicking the "x"
    closeModalButton.addEventListener("click", () => {
        modal.classList.toggle("show");
    })
}

document.getElementById("profile-dropdown").addEventListener("click", (e) => {
    e.preventDefault();

    if (document.querySelector(".dropdown-content").classList.contains("show")) {
        document.getElementById("profile-dropdown").children[1].children[0].innerHTML = "close"
    } else {
        document.getElementById("profile-dropdown").children[1].children[0].innerHTML = "menue"
    }
}) 