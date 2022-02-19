let username = document.getElementById("username");
let password = document.getElementById("password");
let userError = document.getElementById("userError");
let passError = document.getElementById("passError");
let loading = document.getElementById("loading");
let loginSection = document.getElementById("loginSection");

function login(){
    loading.style.display = "inline-block";
    loginSection.style.display = "none";
    if(username.value == "" || password.value == ""){
        userErrorHandle();
        passErrorHandle();
        loading.style.display = "none";
        loginSection.style.display = "block";
    }else{
        userErrorHandle();
        passErrorHandle();
        let form = new FormData();
        form.append("username", username.value);
        form.append("password", password.value);

        let url = "https://ntechform.herokuapp.com/it.php";
        fetch(url, {
            method: "POST",
            mode: "cors",
            header: {
                "Content-Type" : "application/json"
            },
            body: form
        }).then(res => res.text()).then(response => {
            if(response != 401){
                if(response == 404){
                    userError.innerText = "Error! Username not found";
                }else if(response == 406){
                    passError.innerText = "Password is not correct!";
                }else{
                    alert(response)
                }
                loading.style.display = "none";
                loginSection.style.display = "block";
            }else{
                alert("401")
            }
        }).catch(err => {console.log(err)})
    }
}



function userErrorHandle(){
    if(username.value == ""){
        userError.innerText = "Please enter your username";
    }else{
        userError.innerText = ""
    }
}

function passErrorHandle(){
    if(password.value == ""){
        passError.innerText = "Please enter your password";
    }else{
        passError.innerText = ""
    }
}