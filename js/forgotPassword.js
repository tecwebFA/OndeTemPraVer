document.querySelector('#login_btn').addEventListener("click", (e) => {
    e.preventDefault();

    const email = document.querySelector('#user_email').value

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            document.querySelector('#login_btn').disabled = true;
            document.querySelector('#login_btn').innerHTML = "Email para resetar senha enviado para " + email;
            document.querySelector('#login_btn').style.cursor="default";
            document.querySelector('#login_btn').style.hover="none"
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            
            window.alert(errorCode + " " + errorMessage)
        });
})