{
    let loading = document.getElementById("loading");
    let content = document.getElementById("content");
    function openMenu(open, source){
        content.innerHTML = "";
        loading.style.display = "block";
        
        let script = document.createElement("script");
        script.src = "js/" + source + ".js?t=" + new Date().getTime();
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
    let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=it-services-link`;
    fetch(url).then(res => res.text()).then(response => {
        let data = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
        // console.log(data)
        fetch("./contents/it-services.html?t="  + new Date().getTime()).then(res => res.text()).then(response => {
            document.getElementById("content").innerHTML = response;
            document.title = "IT Services";
            for(let row = 0; row < data.length; row++){
                let items = document.createElement("div");
                items.setAttribute("class", "items");
                link = data[row].c[1]?data[row].c[1].v : "";
                items.setAttribute("onclick", "openLink('" + link + "')");
                items.innerText = data[row].c[0].v;
                document.querySelector(".container").appendChild(items)
            }

            let loading = document.getElementById("loading");
            loading.style.display = "none";
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))

    function openLink(link){
        if(link != ""){
            window.open(link, "", "popup");
        }
    }
}