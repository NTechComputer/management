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
    // content showing
    let sheetId = "1VRTUEZawCxjwC0j4g33NCSZ72mT2AJMbzOKm-xeBJNg";
    let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=debit-list`;
    fetch(url).then(res => res.text()).then(response => {
        let data = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
        // console.log(data)
        fetch("./contents/debit-credit.html").then(res => res.text()).then(response => {
            document.getElementById("content").innerHTML = response;
            document.title = "Debit";
            document.querySelector(".title").innerText = "Daily Debit";
            
            for(let row = 0; row < data.length; row++){
                let items = document.createElement("div");
                items.setAttribute("class", "items");
                items.setAttribute("item", row);
                let amount = data[row].c[1]?data[row].c[1].v : 0;
                items.setAttribute("onclick", "addItem(this, " + Number(amount) + ")");
                items.innerText = data[row].c[0].v;
                document.querySelector(".left").appendChild(items)
            }

            let loading = document.getElementById("loading");
            loading.style.display = "none";
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))

    function addItem(item, price){
        document.querySelector(".error").innerText = "";
        if(document.getElementById("item-"+item.getAttribute("item"))){
            let tr = document.getElementById("item-"+item.getAttribute("item"));
            tr.querySelector(".amount").innerText = Number(tr.querySelector(".amount").innerText) + 1;
            tr.querySelector(".price").innerText = Number(tr.querySelector(".price").innerText) + price;
        }
        else{
            let tr = document.createElement("tr");
            let itemNameTd = document.createElement("td");
            let amountTd = document.createElement("td");
            let takeTd = document.createElement("td");
            let span = document.createElement("span");

            itemNameTd.setAttribute("class", "item-name");
            itemNameTd.innerText = item.innerText;
            tr.appendChild(itemNameTd);

            amountTd.setAttribute("class", "amount");
            amountTd.innerText = 1;
            tr.appendChild(amountTd);

            takeTd.setAttribute("class", "price");
            takeTd.innerText = price;
            tr.appendChild(takeTd);

            span.setAttribute("class", "tooltiptext");
            span.innerText = "Price : " + price;
            tr.appendChild(span);

            tr.setAttribute("id", "item-" + item.getAttribute("item"));
            tr.setAttribute("onclick", "removeItem(this)");
            tr.setAttribute("class", "tooltip");
            tr.setAttribute("price", price);
            document.querySelector(".items-footer").parentNode.insertBefore(tr, document.querySelector(".items-footer"));
        }
        document.querySelector(".items-footer .price").innerText = Number(document.querySelector(".items-footer .price").innerText) + price;
        if(document.querySelector(".discountTr")){
            document.querySelector(".items-footer .price").innerText = Number(document.querySelector(".items-footer .price").innerText) + Number(document.querySelector(".discountTr").getAttribute("preValue"));
            document.querySelector(".form-input").value = "";
            document.querySelector(".discountTr").remove();
        }
    }

    function removeItem(tr){
        let price = Number(tr.getAttribute("price"));
        if(Number(tr.querySelector(".amount").innerText) != 1){
            tr.querySelector(".amount").innerText = Number(tr.querySelector(".amount").innerText) - 1;
            tr.querySelector(".price").innerText = Number(tr.querySelector(".price").innerText) - price;
        }
        else{
            tr.remove();
        }
        document.querySelector(".items-footer .price").innerText = Number(document.querySelector(".items-footer .price").innerText) - price;      
    }

    function discount(value){
        if(document.querySelector(".discountTr")){
            let tr =document.querySelector(".discountTr");
            tr.querySelector(".price").innerText = Number(value);
            let preValue = Number(document.querySelector(".discountTr").getAttribute("preValue"));
            document.querySelector(".discountTr").removeAttribute("preValue")
            document.querySelector(".discountTr").setAttribute("preValue", value);
            let absValue = preValue //Math.abs(preValue - Number(value));
            document.querySelector(".items-footer .price").innerText = Number(document.querySelector(".items-footer .price").innerText) + absValue;
            document.querySelector(".items-footer .price").innerText = Number(document.querySelector(".items-footer .price").innerText) - Number(value);
        }
        else{
            let tr = document.createElement("tr");
            let itemNameTd = document.createElement("td");
            let amountTd = document.createElement("td");
            let takeTd = document.createElement("td");
            let span = document.createElement("span");

            itemNameTd.setAttribute("class", "item-name");
            itemNameTd.innerText = "Discount";
            tr.appendChild(itemNameTd);

            amountTd.setAttribute("class", "amount");
            // amountTd.innerText = value;
            tr.appendChild(amountTd);

            takeTd.setAttribute("class", "price");
            takeTd.innerText = value;
            tr.appendChild(takeTd);
            tr.setAttribute("class", "discountTr");
            tr.setAttribute("preValue", value)
            document.querySelector(".items-footer").parentNode.insertBefore(tr, document.querySelector(".items-footer"));
            document.querySelector(".items-footer .price").innerText = Number(document.querySelector(".items-footer .price").innerText) - Number(value);
        }
    }

    function debitCreditSubmit(){
        let total = 0;
        let data = [];
        let table = document.querySelectorAll("table tr");
        let length = table.length - 3;
         if(length/*document.querySelector(".discountTr")*/){
            for(let tr = 1; tr <= length; tr++){
                let item = [
                    new Date().toString(),
                    table[tr].querySelector(".item-name").innerText,
                    table[tr].querySelector(".amount").innerText,
                    table[tr].getAttribute("price"),
                    table[tr].querySelector(".price").innerText,
                    total = total + Number(table[tr].querySelector(".price").innerText),
                    JSON.parse(localStorage.userInfo).username
                ]
                data.push(item);
            }
            
            let loading2 = document.getElementById("loading2");
            let btn = document.querySelector(".btn");

            btn.style.display = "none";
            loading2.style.display = "inline";
            document.querySelector(".hidden").style.display = "inline";
            document.querySelector(".error").innerText = "";

            let form = new FormData();
            form.append("action", "debit");
            form.append("branch", JSON.parse(localStorage.userInfo).branch);
            form.append("data", JSON.stringify(data));
            if(document.querySelector(".form-input").value != 0){
                form.append("discount", JSON.stringify([[new Date().toString(), "Discount", "-", "-", document.querySelector(".form-input").value, document.querySelector(".form-input").value, JSON.parse(localStorage.userInfo).username]]));
            }
            
            let url = "https://script.google.com/macros/s/AKfycbzUY22DxVclwNwVbfwAvFarg3HyozbWAcChqOOW5T9c4L9ESLI/exec";
            fetch(url, {
                method: "POST",
                mode: "cors",
                header: {
                    "Content-Type" : "application/json",
                    "Access-Control-Allow-Origin" : "*"
                },
                body: form
            }).then(res => res.text()).then(response => {
                console.log(response)
                response = JSON.parse(response);
                if(response.result == "success"){
                    let tableItem = document.querySelectorAll("table tr");
                    for(let i = 1; i < tableItem.length - 1; i++){
                        tableItem[i].remove();
                    }
                    loading2.style.display = "none";
                    btn.style.display = "inline";
                    document.querySelector(".hidden").style.display = "none";
                    document.querySelector(".form-input").value = "";
                    document.querySelector(".items-footer .price").innerText = "000";
                }
                else{
                    document.querySelector(".hidden").style.display = "none";
                    loading2.style.display = "none";
                    btn.style.display = "inline";
                    document.querySelector(".error").innerText = "Error! Please try again."
                }
            }).catch(err => {console.log(err)})

        }
        else{
            document.querySelector(".error").innerText = "No item found!";
        }
    }
}
