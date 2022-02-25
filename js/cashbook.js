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
    let sheetId = "12u3ecrf5kSaPrQlvnVYNaYnk8RU3PriwtW7t6AskLNw";
    let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${JSON.parse(localStorage.userInfo).branch}`;
    fetch(url).then(res => res.text()).then(response => {
        let months = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
        // montly debit
        sheetId = months[new Date().getMonth()].c[1].v;
        url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=monthly-debit`;
        fetch(url).then(res => res.text()).then(response => {
            let debitData = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
                // monthly credit
                console.log(debitData)
                url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=monthly-credit`;
                fetch(url).then(res => res.text()).then(response => {
                    let creditData = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
                        console.log(creditData)
                        // cashbook
                        fetch("./contents/cashbook.html?t="  + new Date().getTime()).then(res => res.text()).then(response => {
                            document.getElementById("content").innerHTML = response;
                            document.title = "Cashbook";
                            
                            for(let row = 0; row < months.length; row++){
                                let items = document.createElement("option");
                                items.innerText = months[row].c[0].v;
                                items.setAttribute("value", months[row].c[1].v)
                                document.querySelector("#monthsList").appendChild(items)
                            }
                            document.querySelector("#monthsList").value = sheetId;

                            let compare = 1;
                            let debitDataLength = debitData.length;
                            let creditDataLength = creditData.length;
                            compare = debitDataLength > creditDataLength ? debitDataLength : creditDataLength;
                            
                            let items = document.createElement("option");
                            items.innerText = "Day";
                            items.setAttribute("value", 0);
                            document.querySelector("#daysList").appendChild(items)
                            for(let row = 1; row <= compare; row++){
                                let items = document.createElement("option");
                                items.innerText = row;
                                items.setAttribute("value", row);
                                document.querySelector("#daysList").appendChild(items)
                            }

                            let totalDebit = createDebitCredit(debitData, "debit");
                            let totalCredit = createDebitCredit(creditData, "credit")
                            document.querySelector(".totalAmount").innerText = `Total : (${totalDebit} - ${totalCredit}) = ${Number(totalDebit) - Number(totalCredit)}`

                            let loading = document.getElementById("loading");
                            loading.style.display = "none";
                        }).catch(err => console.log(err))
                }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))



    function createDebitCredit(data, type){
        let table = document.querySelector(`.${type} .items`);
        table.innerHTML = "";

        let total = 0;
        let tr0 = document.createElement("tr");
        let th1 = document.createElement("th");
        let th2 = document.createElement("th");
        let th3 = document.createElement("th");
        let th4 = document.createElement("th");
        let th5 = document.createElement("th");
        let th6 = document.createElement("th");

        tr0.setAttribute("class", "item-header")

        th1.setAttribute("class", "cashbookDate");
        th1.innerText = "Date";

        th2.setAttribute("class", "cashbookSource");
        th2.innerText = "Source";

        th3.setAttribute("class", "cashbookAmount");
        th3.innerText = "Amount";

        th4.setAttribute("class", "cashbookAmount");
        th4.innerText = "৳";

        th5.setAttribute("class", "cashbookAmount");
        th5.innerText = "Total";

        th6.setAttribute("class", "cashbookAmount");
        th6.innerText = "Gatherer";

        tr0.appendChild(th1);
        tr0.appendChild(th2);
        tr0.appendChild(th3);
        tr0.appendChild(th4);
        tr0.appendChild(th5);
        tr0.appendChild(th6);
        table.appendChild(tr0);
        
        for(let row = 0; row < data.length; row++){
            let tr = document.createElement("tr");
            tr.setAttribute("class", "tooltip");
            let span = document.createElement("span");
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");
            let td3 = document.createElement("td");
            let td4 = document.createElement("td");
            let td5 = document.createElement("td");
            let td6 = document.createElement("td");

            td1.setAttribute("class", "cashbookDate");
            td1.innerText = data[row].c[0].v.substr(4, 11).replace(/ /g, ", ").replace(",","");

            td2.setAttribute("class", "cashbookSource");
            td2.innerText = data[row].c[1].v;

            td3.setAttribute("class", "cashbookAmount");
            td4.setAttribute("class", "cashbookAmount");
            td5.setAttribute("class", "cashbookAmount");
            td6.setAttribute("class", "cashbookAmount");

            td3.innerText = data[row].c[2]? data[row].c[2].v : "";
            td4.innerText = data[row].c[3]? data[row].c[3].v : "";
            td5.innerText = data[row].c[4].v;
            td6.innerText = data[row].c[5].v;

            span.setAttribute("class", "tooltiptext");
            span.innerText = "Modified : " + getTime(data[row].c[0].v);
            tr.appendChild(span);

            if(data[0].c.length == 7){
                data[row].c[0].v = getTime(data[row].c[0].v);
                span.innerText = "Price : " + data[row].c[3]? data[row].c[3].v : "";;
                td4.innerText = data[row].c[4].v;
                td5.innerText = data[row].c[5].v;
                td6.innerText = data[row].c[6].v;
            }

            total = td5.innerText;

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);
            table.appendChild(tr);
        }

        tr0 = document.createElement("tr");
        th1 = document.createElement("th");
        th2 = document.createElement("th");
        th3 = document.createElement("th");
        th4 = document.createElement("th");
        th5 = document.createElement("th");
        th6 = document.createElement("th");

        tr0.setAttribute("class", "item-footer")

        th1.setAttribute("class", "cashbookDate");
        th2.setAttribute("class", "cashbookSource");
        th3.setAttribute("class", "cashbookAmount");
        th4.setAttribute("class", "cashbookAmount");
        th4.innerText = "Total";

        th5.setAttribute("class", "cashbookAmount");
        th5.innerText = total;
        
        th6.setAttribute("class", "cashbookAmount");

        tr0.appendChild(th1);
        tr0.appendChild(th2);
        tr0.appendChild(th3);
        tr0.appendChild(th4);
        tr0.appendChild(th5);
        tr0.appendChild(th6);
        table.appendChild(tr0);

        return total;
    }

    function getTime(time){
        // console.log(time)
        time = new Date(time);
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let suffix = " AM";
        if(hours > 12){
            hours = hours - 12;
            suffix = " PM";
            if(hours == 24 && minutes == 0) suffix = " AM";
        }
        if(hours == 12 && minutes == 0) suffix = " PM";
        return hours + ":" + minutes + suffix;
    }

    function monthChange(value){
        document.getElementById("content").style.display = "none";
        document.getElementById("loading").style.display = "inline";
        // montly debit
        let sheetId = document.querySelector("#monthsList").value;
        let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=monthly-debit`;
        fetch(url).then(res => res.text()).then(response => {
            let debitData = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
                // monthly credit
                console.log(debitData)
                url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=monthly-credit`;
                fetch(url).then(res => res.text()).then(response => {
                    let creditData = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
                        console.log(creditData)
                        let compare = 1;
                        let debitDataLength = debitData.length;
                        let creditDataLength = creditData.length;
                        compare = debitDataLength > creditDataLength ? debitDataLength : creditDataLength;
                        document.querySelector("#daysList").innerHTML = "";
                        let items = document.createElement("option");
                        items.innerText = "Day";
                        items.setAttribute("value", 0);
                        document.querySelector("#daysList").appendChild(items)
                        for(let row = 1; row <= compare; row++){
                            let items = document.createElement("option");
                            items.innerText = row;
                            items.setAttribute("value", row);
                            document.querySelector("#daysList").appendChild(items)
                        }
    
                        let totalDebit = createDebitCredit(debitData, "debit");
                        let totalCredit = createDebitCredit(creditData, "credit")
                        document.querySelector(".totalAmount").innerText = `Total : (${totalDebit} - ${totalCredit}) = ${Number(totalDebit) - Number(totalCredit)}`;
                        
                        document.getElementById("content").style.display = "block";
                        document.getElementById("loading").style.display = "none";
                }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }

    function dayChange(value){
        document.getElementById("content").style.display = "none";
        document.getElementById("loading").style.display = "inline";
        // montly debit
        let sheetId = document.querySelector("#monthsList").value;
        let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=debit-${value.value}`;
        fetch(url).then(res => res.text()).then(response => {
            let debitData = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
                // monthly credit
                console.log(debitData)
                url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=credit-${value.value}`;
                fetch(url).then(res => res.text()).then(response => {
                    let creditData = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
                        console.log(creditData)
                        
                        if(JSON.stringify(debitData) == JSON.stringify(creditData)) monthChange();
                        else{
                            let totalDebit = createDebitCredit(debitData, "debit");
                            let totalCredit = createDebitCredit(creditData, "credit")
                            document.querySelector(".totalAmount").innerText = `Total : (${totalDebit} - ${totalCredit}) = ${Number(totalDebit) - Number(totalCredit)}`;
                            
                            document.getElementById("content").style.display = "block";
                            document.getElementById("loading").style.display = "none";
                        }
                }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }
}