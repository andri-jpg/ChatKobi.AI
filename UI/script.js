function toggleThemes() {
  var themePanel = document.getElementById("themePanel");
  if (themePanel.style.display === "none") {
    themePanel.style.display = "flex";
  } else {
    themePanel.style.display = "none";
  }
}
var c = 1;
const input = document.querySelector('input');
const vol = document.querySelector('.fa-volume-up');
vol.addEventListener('click', function() {
  c++;
  vol.classList.toggle("off");
});

function send() {
  if (input.value != ""&&input.value!=" ") {
    const message = document.getElementById('messages');
    const send = document.createElement('p');
    const recv = send.cloneNode(true);
    send.innerText = input.value;
    x = send.innerText;
    eel.handleinput(x);
    send.className = "sender";
    message.appendChild(send);
    recv.innerText = response;
    recv.className = "receiver";
    message.appendChild(recv);
    if (c % 2 == 1) { 
      new Audio('send.ogg').play();
    }
  }
}

eel.expose(bot_resp);
function bot_resp(response) {
    const message = document.getElementById('messages');
    const send = document.createElement('p');
    const recv = send.cloneNode(true);
    const recNode = document.querySelectorAll('.receiver');
    recv.innerText = response;
    recv.className = "receiver";
    message.appendChild(recv);
    if (c % 2 == 1) { 
      new Audio('send.ogg').play();
    }
    message.scrollTop = recNode[recNode.length-1].offsetTop - 10;
    setTimeout(function() { input.value = '' }, 100);
  }

document.getElementById('send').addEventListener('click', send);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { send() } })

// Themes

var a = 1;
document.querySelector('h1').onclick = function() {

  if (a == 1) {
    a = 0;
    document.querySelector('h1').style.color = "white";
    document.getElementById('themes').style.display = "flex";
  }
  else {
    a = 1;
    document.querySelector('h1').style.color = "transparent";
    document.getElementById('themes').style.display = "none";
  }
}


var theme = document.getElementsByClassName('theme');


if (localStorage.getItem('scheme')) {
  themeChange(localStorage.getItem('scheme'), localStorage.getItem('scheme2'));
}

window.onload = function() {
  document.getElementById('messages').style.display =
    document.getElementById('header').style.display =
    document.getElementById('type').style.display = "flex";
  document.getElementById('loader').style.display = "none";
}
