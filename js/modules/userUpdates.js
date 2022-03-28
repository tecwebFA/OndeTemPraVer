import {
    errorPopup,
    successPopup
} from "./interactions.js";

let file = {}
window.chooseFile = (e) => {
    file = e.target.files[0]
    console.log(file)
    console.log(file.name)
    console.log(file.type)
}

const updateDp = async (currentUser) => {
    if ("name" in file) {
        try {
            if (
                file.type !== "image/jpeg" &&
                file.type !== "image/jpg" &&
                file.type !== "image/png" &&
                file.type !== "image/gif"
            ) {
                errorPopup("File must be .jpg, .jpeg, .png, or .gif", 5000);
                return;
            }

            if (file.size / 1024 / 1024 > 9) {
                errorPopup("File size must be less than 10mb", 5000);
                return;
            }

            const userPicRef = storage.ref("users/" + currentUser.uid + "/profileImage");

            await userPicRef.put(file);
            console.log("Image uploaded")

            const imgURL = await userPicRef.getDownloadURL();
            console.log(`Image URL: ${imgURL}`)

            await db.collection("users").doc(currentUser.uid).set({
                dp_URL: imgURL,
                dp_URL_last_modified: firebase.firestore.FieldValue.serverTimestamp()
            }, {
                merge: true,
            });

            console.log("Document Added")
            document.querySelector("#nav_dp").src = imgURL;

            file = ""

            successPopup("Profile Picture Updated Successfully!");
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("Empty/no file");
    }
}


const updateUsername = async (newName) => {
    if (newName.length > 50) {       
        errorPopup("Display name must be less than 50 characters", 5000);
        return;
    } else {
        await auth.currentUser.updateProfile({
            displayName: newName
        })       
        updateDisplayNameInDOM(auth.currentUser)
        document.querySelector("#profile_name").placeholder = auth.currentUser.displayName;
        successPopup("Username updated successfully!")
    }
}

const verifyEmail = (currentUser) => {
    document.querySelector("#verify-email-button").addEventListener("click", (e) => {
        e.preventDefault();

        currentUser.sendEmailVerification()
            .then(() => {
                document.querySelector("#verify-email-button").classList.toggle("show");

                successPopup("Verification email sent!");
            });
    })
}

const updateDisplayNameInDOM = (currentUser) => {
    document.querySelector("#user_name").innerHTML = currentUser.displayName;
}

const createNewCollection = () => {
    event.preventDefault();

    const newCollectionName = document.querySelector(".search-input").value
    const newCollectionDescription = document.querySelector(".description").value

    const userDocRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

    newCollectionNameErrorChecks(newCollectionName)

    userDocRef.get().then((doc) => {
        if (doc.data().movies_collections[newCollectionName]) {
            errorPopup(`${newCollectionName} is already a collection`, 5000)
            document.querySelector(".search-input").value = "";
            document.querySelector(".description").value = "";
            return
        } else {
    
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        
            userDocRef.set({
                movies_collections: {            
                    [newCollectionName]: {
                        dateCreated: timestamp,
                        description: newCollectionDescription,
                        createdBy: firebase.auth().currentUser.email,
                        movies: []
                    }
                }
            }, {
                merge: true
            }).then(() => {
                successPopup(`${newCollectionName} collection has been created`)
                document.querySelector(".search-input").value = "";
                document.querySelector(".description").value = "";
          
                document.querySelector(".existing-collections").innerHTML += `
                <div class="collection-name-container">
                    <p class="collection-name">
                        ${newCollectionName}
                    </p>
                </div>  
                `
            })
        }
    })
}

const newCollectionNameErrorChecks = (newCollectionName) => {
  
    if (newCollectionName.match(/^\s*$/)) {
        errorPopup("Collection name cannot be empty", 5000);
        return false;
    }
    if (newCollectionName === "All" || newCollectionName === "all" || newCollectionName === "" || newCollectionName === null) {
        errorPopup("Please use a valid collection name", 5000);
        return false;
    }
    if (newCollectionName.length > 20) {
        errorPopup("Collection name cannot be more than 20 characters", 6000);
        return false;
    }

    return true;
}

const checkNotifications = () => {
    const userDocRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

    userDocRef.get().then((doc) => {
        if (!doc.data().notifications) {        
            document.querySelector("#check-notificatios-btn").innerHTML += "No new notifications";
      
            userDocRef.set({
                notifications: {
                    friend_requests: {}
                }
            }, {
                merge: true
            })

            return
        }
        const notifications = doc.data().notifications;

        let notifications_count = 0;
       
        Object.keys(notifications).forEach((key) => {  
            Object.keys(notifications[key]).forEach((notification) => {     
                if (notifications[key][notification].accepted === false) {
                    notifications_count++;
                }
            })
        })

        if (notifications_count === 0) {
            document.querySelector("#check-notificatios-btn").innerHTML += "No new notifications";
        } else {
            document.querySelector("#check-notificatios-btn").innerHTML += `${notifications_count} new notifications`;
        }
    }).catch((error) => {
        errorPopup(error.message, 5000);
    })
}

export {
    file,
    updateDp,
    updateUsername,
    updateDisplayNameInDOM,
    verifyEmail,
    createNewCollection,
    newCollectionNameErrorChecks,
    checkNotifications
}