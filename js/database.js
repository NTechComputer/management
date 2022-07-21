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
    let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&range=A1:I500&tq=SELECT+B,D,F,G,H,I`;
    fetch(url).then(res => res.text()).then(response => {
        let data = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
         //console.log(data)
        fetch("./contents/database.html?t="  + new Date().getTime()).then(res => res.text()).then(response => {
            document.getElementById("content").innerHTML = response;
            document.title = "Database";
            let itmes = "";

            for(let row = 0; row < data.length; row++){
                let fileId = data[row].c[5].v, mobileNo = data[row].c[4].v, gather = data[row].c[2].v,
                branch = data[row].c[3].v, date = data[row].c[0].v, type = data[row].c[1].v,
                download = "https://drive.google.com/uc?export=download&id=" + fileId;
                if(type.startsWith("image/")) fileId = "https://drive.google.com/uc?export=view&id=" + fileId;
                else if(type == "application/pdf") fileId = "./pdf.png";
                else fileId = "./docx.png"
                date = date.substr(4, 11).replace(/ /g, ", ").replace(",", "");
            
                itmes += eval(template);
                //console.log(template)
            }
            document.querySelector(".container").innerHTML = itmes;


            let loading = document.getElementById("loading");
            loading.style.display = "none";
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))

    // search option
    function searchFileInDatabase(value){
        if(value){
            let type = document.querySelector(".searchOption").value;
            document.querySelector(".container").innerHTML = "";
            document.getElementById("loading2").style.display = "block";
            let sheetId = "1Duklkl9C3B8o_cK8ew2a59YbWcbA78_Inw0MRki_Wsg";
            value = Number(value).toString();
            value = value[0] + "." + value.substr(1);
            value = Number(value)
            let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&range=A1:I500&tq=SELECT+B,D,F,G,H,I+WHERE+${type}+LIKE+"%25${value}%25"`;
            fetch(url).then(res => res.text()).then(response => {
                //console.log(response)
                let data = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
                //console.log(data)
                let itmes = "";
                for(let row = 0; row < data.length; row++){
                    let fileId = data[row].c[5].v, mobileNo = data[row].c[4].v, gather = data[row].c[2].v,
                    branch = data[row].c[3].v, date = data[row].c[0].v, type = data[row].c[1].v,
                    download = "https://drive.google.com/uc?export=download&id=" + fileId;
                    if(type.startsWith("image/")) fileId = "https://drive.google.com/uc?export=view&id=" + fileId;
                    else if(type == "application/pdf") fileId = "./pdf.png";
                    else fileId = "./docx.png"
                    date = date.substr(4, 11).replace(/ /g, ", ").replace(",", "");
                
                    itmes += eval(template);
                    //console.log(template)
                }
                document.querySelector(".container").innerHTML = itmes;
                let loading = document.getElementById("loading2");
                loading.style.display = "none";
            }).catch(err => console.log(err))
        }
        else{
            openMenu(document.querySelector(".activeMenu"), 'database');
        }
    }

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
                    if(file.type.startsWith("image/")) {
                        document.querySelector("#uploadImg").src = URL.createObjectURL(file);
                    }
                    else if(file.type == "application/pdf") document.querySelector("#uploadImg").src = "./pdf.png";
                    else document.querySelector("#uploadImg").src = "./docx.png"
					if (!isNaN(file.name)) {
						document.querySelector("#fileNameValue").value = file.name;
					} else {
						document.querySelector("#fileNameValue").value = "";
					}
					let reader = new FileReader();
					//console.log(reader);
					reader.onload = function (e) {
						content = reader.result;
						files[file.name + file.size + file.lastModified] =
							new Date().getTime();
						document.querySelector("#fileName").style.transform = "scale(1)";
					};
					reader.readAsDataURL(file);
				} else {
					alert("File should be image");
				}
			}

			function uploadForm() {
                //document.getElementById("loading").style.display = "flex";
                let btn = document.querySelector(".uploadForm .btn");
                console.log(btn)
                btn.value = "uploading...";
                btn.setAttribute("disabled", "");
				data.push(document.querySelector("#fileNameValue").value);
				let form = new FormData();
				form.append("data", JSON.stringify(data));
				form.append("content", content);
                console.log(data)
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
                            //document.getElementById("loading").style.display = "block";
                            openMenu(document.querySelector(".activeMenu"), 'database')
                        } else {
                            alert("error found! try again.")
                            data.pop();
                            btn.removeAttribute("disabled");
                            btn.value = "upload.";
                        }
                        console.log(response)
						//document.getElementById("loading").style.display = "none";
                        
					});
			}

            function dragOverHandler(ev) {
                //console.log("File(s) in drop zone");
                ev.preventDefault();
            }
    }
}

