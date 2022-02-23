{
    let loading = document.getElementById("loading");
    let content = document.getElementById("content");
    function openMenu(open, source){
        content.innerHTML = "";
        loading.style.display = "block";
        
        let script = document.createElement("script");
        script.src = "js/" + source + ".js";
        script.onload = function(){
            let activeMenu = document.querySelector(".activeMenu");
            activeMenu.removeAttribute("class");
            open.setAttribute("class", "activeMenu");

            document.getElementsByTagName("script")[0].remove();
        }
        document.body.appendChild(script);
    }

    function logout(open){
        let activeMenu = document.querySelector(".activeMenu");
        activeMenu.removeAttribute("class");
        open.setAttribute("class", "activeMenu");
        delete localStorage.userInfo;
        content.innerHTML = "";
        loading.style.display = "block";
        setTimeout(function(){window.location = "./"}, 1200);
    }
}

{
    fetch("./contents/changePassword.html").then(res => res.text()).then(response => {
        document.getElementById("content").innerHTML = response;
        document.title = "Change Password";
        let loading = document.getElementById("loading");
        loading.style.display = "none";
    }).catch(err => console.log(err))

    function changePassword(){
        let btn = document.querySelector(".btn");
        let error = document.querySelector(".error2");
        let loading2 = document.getElementById("loading2");

        error.style.display = "none";
        btn.style.display = "none";
        loading2.style.display = "block";
        
        if(document.getElementById("oldPassword").value != JSON.parse(localStorage.userInfo).password){
            document.getElementById("oldPassError").innerText = "Please enter right password";
            btn.style.display = "block";
            loading2.style.display = "none";
        }
        else{
            document.getElementById("oldPassError").innerText = "";
            if(document.getElementById("newPassword").value != document.getElementById("conNewPassword").value){
                document.getElementById("conNewPassError").innerText = "Doesn't match with new password.";
                btn.style.display = "block";
                loading2.style.display = "none";
            }
            else{
                document.getElementById("conNewPassError").innerText = "";
                let form = new FormData();
                form.append("action", "changePassword");
                form.append("id", JSON.parse(localStorage.userInfo).id);
                form.append("password", document.getElementById("newPassword").value);

                let url = "https://script.google.com/macros/s/AKfycbzUY22DxVclwNwVbfwAvFarg3HyozbWAcChqOOW5T9c4L9ESLI/exec";
                fetch(url, {
                    method: "POST",
                    mode: "cors",
                    header: {
                        "Content-Type" : "application/json"
                    },
                    body: form
                }).then(res => res.text()).then(response => {
                    console.log(response)
                    response = JSON.parse(response);
                    if(response.result == "success"){
                        loading2.style.display = "none";
                        alert("success!")
                        delete localStorage.userInfo;
                        let loading = document.getElementById("loading");
                        let content = document.getElementById("content");
                        content.innerHTML = "";
                        loading.style.display = "block";
                        setTimeout(function(){window.location = "../"}, 1200);
                    }
                    else{
                        btn.style.display = "inline";
                        loading2.style.display = "none";
                        error.style.display = "block";
                    }
                }).catch(err => {console.log(err)})
            }
        }
    }
}