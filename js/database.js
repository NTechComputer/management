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
    // items template
    let template = `\`<div class="items">
    <img src="\$\{fileId\}" alt="">
    <div class="items1"></div>
    <div class="itemInfo">
        <div class="t">
            <div>Id</div>
            <div>:</div>
            <div>\$\{mobileNo\}</div>
        </div>
        <div class="t">
            <div>Gather</div>
            <div>:</div>
            <div>\$\{gather\}</div>
        </div>
        <div class="t">
            <div>Branch</div>
            <div>:</div>
            <div>\$\{branch\}</div>
        </div>
        <div class="t">
            <div>Date</div>
            <div>:</div>
            <div>\$\{date\}</div>
        </div>
        <a href="\$\{download\}" class="download">Download</a>
    </div>
</div>\``;
    // content showing
    let sheetId = "1Duklkl9C3B8o_cK8ew2a59YbWcbA78_Inw0MRki_Wsg";
    let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    fetch(url).then(res => res.text()).then(response => {
        let data = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
        // console.log(data)
        fetch("./contents/database.html?t="  + new Date().getTime()).then(res => res.text()).then(response => {
            document.getElementById("content").innerHTML = response;
            document.title = "Database";
            let itmes = "";

            for(let row = 0; row < data.length; row++){
                let fileId = data[row].c[8].v, mobileNo = data[row].c[7].v, gather = data[row].c[5].v,
                branch = data[row].c[6].v, date = data[row].c[1].v, type = data[row].c[3].v,
                download = "https://drive.google.com/uc?export=download&id=" + fileId;
                if(type.startsWith("image/")) fileId = "https://drive.google.com/uc?export=view&id=" + fileId;
                else if(type == "application/pdf") fileId = "./pdf.png";
                else fileId = "./docx.png"
                date = date.substr(4, 11).replace(/ /g, ", ").replace(",", "");
            
                itmes += eval(template);
                //console.log(template)
            }
            document.querySelector(".container2").innerHTML = itmes;


            let loading = document.getElementById("loading");
            loading.style.display = "none";
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))


    // file upload 
    {
        const files = {};
			let content, file, data;
			function dropHandler(ev) {
				console.log("File(s) dropped");
				ev.preventDefault();
				file = ev.dataTransfer.files[0];
				data = [
					file.lastModifiedDate.toString(),
					file.name,
					file.type,
					file.size,
					JSON.parse(localStorage.userInfo).username,
					JSON.parse(localStorage.userInfo).branch ,
				];
				//console.log(file);
				if (
					(file.type.startsWith("image/") ||
						file.type == "application/pdf" ||
						file.type ==
							"application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
						file.type == "application/msword") &&
					!files[file.name + file.size + file.lastModified]
				) {
					const img = document.createElement("img");
					img.classList.add("obj");
					img.src = URL.createObjectURL(file);
					document.querySelector(".imgs").appendChild(img);
					if (!isNaN(file.name)) {
						document.querySelector("#fileNameValue").value = file.name;
					} else {
						document.querySelector("#fileNameValue").value = "";
					}
					let reader = new FileReader();
					console.log(reader);
					reader.onload = function (e) {
						content = reader.result;
						files[file.name + file.size + file.lastModified] =
							new Date().getTime();
						document.querySelector("#fileName").style.transform = "scale(1)";
					};
					reader.readAsDataURL(file);
				} else {
					console.error("File should be image");
				}
			}

			function uploadForm() {
				data.push(document.querySelector("#fileNameValue").value);
				let form = new FormData();
				form.append("data", JSON.stringify(data));
				form.append("content", content);
				let url =
					"https://script.google.com/macros/s/AKfycbwIarAirMKAsWGHKf8ejoEPIE-8Yoj98-C5EWNc/exec";
				fetch(url, {
					method: "POST",
					mode: "cors",
					header: {
						"Content-Type": "application/json",
					},
					body: form,
				})
					.then((res) => res.text())
					.then((response) => {
						const { result } = JSON.parse(response);
						if (result == "success") {
							data = undefined;
							document.querySelector("#fileName").style.transform = "scale(0)";
						} else data.shift();
						console.log(response);
					});
			}

            function dragOverHandler(ev) {
                console.log("File(s) in drop zone");
                ev.preventDefault();
            }
    }
}

