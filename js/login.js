{
    if(!navigator.pdfViewerEnabled){
        document.body.style.display = "none";
    }

    let now = new Date().getTime();
    if(localStorage.lastUpadate){
        if(now - Number(localStorage.lastUpadate) > 100000){
            localStorage.lastUpadate = now;
            console.log("updated");
            window.location.reload();
        }
    }
    else{
        localStorage.lastUpadate = now;
    }
}
{
let username = document.getElementById("username");
let password = document.getElementById("password");
let userError = document.getElementById("userError");
let passError = document.getElementById("passError");
let loading = document.getElementById("loading");
let loginSection = document.getElementById("loginSection");

if(localStorage.userInfo){
    let data = JSON.parse(localStorage.userInfo);
    username.value = data.username;
    password.value = data.password;
    login();
}

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
                    loading.style.display = "none";
                    loginSection.style.display = "block";
                }else if(response == 406){
                    passError.innerText = "Password is not correct!";
                    loading.style.display = "none";
                    loginSection.style.display = "block";
                }else{
                    let url = "./contents/dashboard.html";
                    let data = JSON.parse(response);
                    data.username = username.value;
                    data.password = password.value;
                    localStorage.userInfo = JSON.stringify(data);
                    fetch(url).then(res => res.text()).then(response => {
                        let link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.href = "css/dashboard.css";
                        link.onload = function(){
                            username = data.username;
                            document.getElementById("stylesheet").remove();
                            this.id = "stylesheet";

                            document.body.innerHTML = "";
                            document.body.innerHTML = response;
                            document.title = "Home";
                            let script = document.createElement("script");
                            script.src = "js/home.js";
                            script.onload = function(){
                                document.getElementById("userName").innerText = username[0].toUpperCase() + username.substr(1);
                                document.getElementById("userPhoto").src = "https://drive.google.com/uc?export=view&id=" +data.photo;
                                document.getElementsByTagName("script")[0].remove();
                            }
                            document.body.appendChild(script);
                            
                        }
                        document.head.appendChild(link);
                    })
                    .catch(err => {console.log(err)})
                }
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
}


function invokeServiceWorkerUpdateFlow(registration) {
    // TODO implement your own UI notification element
    notification.show("New version of the app is available. Refresh now?");
    notification.addEventListener('click', () => {
        if (registration.waiting) {
            // let waiting Service Worker know it should became active
            registration.waiting.postMessage('SKIP_WAITING')
        }
    })
}

// check if the browser supports serviceWorker at all
if ('serviceWorker' in navigator) {
    // wait for the page to load
    window.addEventListener('load', async () => {
        // register the service worker from the file specified
        const registration = await navigator.serviceWorker.register('/management/sw.js')

        // ensure the case when the updatefound event was missed is also handled
        // by re-invoking the prompt when there's a waiting Service Worker
        if (registration.waiting) {
            invokeServiceWorkerUpdateFlow(registration)
        }

        // detect Service Worker update available and wait for it to become installed
        registration.addEventListener('updatefound', () => {
            if (registration.installing) {
                // wait until the new Service worker is actually installed (ready to take over)
                registration.installing.addEventListener('statechange', () => {
                    if (registration.waiting) {
                        // if there's an existing controller (previous Service Worker), show the prompt
                        if (navigator.serviceWorker.controller) {
                            invokeServiceWorkerUpdateFlow(registration)
                        } else {
                            // otherwise it's the first install, nothing to do
                            console.log('Service Worker initialized for the first time')
                        }
                    }
                })
            }
        })

        let refreshing = false;

        // detect controller change and refresh the page
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                window.location.reload()
                refreshing = true
            }
        })
    })
}

