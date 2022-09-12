{
    let loading = document.getElementById("loading");
    let content = document.getElementById("content");
    function openMenu(open, source){
        content.innerHTML = "";
        loading.style.display = "block";
        
        let script = document.createElement("script");
        script.src = "js/" + source + ".js?t="  + new Date().getTime();
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
    // content showing
    let sheetId = "1VRTUEZawCxjwC0j4g33NCSZ72mT2AJMbzOKm-xeBJNg";
    let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=instractions`;
    fetch(url).then(res => res.text()).then(response => {
        if(localStorage.source && localStorage.source != "home"){
            let date = new Date().toLocaleDateString();
            if(localStorage.localDate){
                if(localStorage.localDate == date){
                    let source = localStorage.source;
                    openMenu(document.querySelector(`[source = '${source}']`), source);
                    return;
                }
                localStorage.localDate = date;
            } else{
                localStorage.localDate = date;
            }
        }
        let data = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
        // console.log(data)
        fetch("./contents/home.html?t=" + new Date().getTime()).then(res => res.text()).then(response => {
            document.getElementById("content").innerHTML = response;
            document.title = "Home";
            let ol = document.getElementsByTagName("ol")[0];
            ol.innerHTML = "";
            for(let i = 0; i < data.length; i++){
                let li = document.createElement("li");
                li.innerText = data[i].c[0].v;
                ol.appendChild(li);
            }
            if(localStorage['joinleave' + JSON.parse(localStorage.userInfo).username]){
                let joinleave = Number(localStorage['joinleave' + JSON.parse(localStorage.userInfo).username]);
                let joinleaveSection = document.querySelector(".form-label2");
                if(joinleave == 0){
                    joinleaveSection.innerText = "Join at morning";
                }
                else if(joinleave == 1){
                    joinleaveSection.innerText = "Leave at evening";
                }
                else if(joinleave == 2){
                    joinleaveSection.innerText = "Join at noon";
                }
                else if(joinleave == 3){
                    joinleaveSection.innerText = "Leave at night";
                }
            }else{
                localStorage['joinleave' + JSON.parse(localStorage.userInfo).username] = 0;
            }
            let loading = document.getElementById("loading");
            loading.style.display = "none";
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))

    // attendence
   
    function attendence(){
        let button = document.querySelector("button.submit-button");
        let loading2 = document.getElementById("loading2");
        let error = document.querySelector(".error");

        error.style.display = "none";
        button.style.display = "none";
        loading2.style.display = "inline";

        let data = JSON.parse(localStorage.userInfo)
        let form = new FormData();
        form.append("action", "mail");
        form.append("username", data.username);
        form.append("time", new Date().toString());
        form.append("comment", document.getElementById("comment").value);
        form.append("joinleave", document.querySelector(".form-label2").innerText);
        form.append("device", navigator.platform);
        form.append("deviceAgent", navigator.userAgent);
        form.append("branch", data.branch);

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
                localStorage['joinleave' + JSON.parse(localStorage.userInfo).username] = (++localStorage['joinleave' + JSON.parse(localStorage.userInfo).username])%4;
            }
            else{
                button.style.display = "inline";
                error.style.display = "block";
                loading2.style.display = "none";
            }
        }).catch(err => {console.log(err)})
    }

}