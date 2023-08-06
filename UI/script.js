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
    const recNode = document.querySelectorAll('.receiver');
    send.innerText = input.value;
    send.className = "sender";
    message.appendChild(send);
    fetch('dataset.json')
      .then(res => res.json())
      .then(data => {
        const foundIndex = data.findIndex(d => d.s.toLowerCase() === input.value.toLowerCase());
        recv.innerText = foundIndex > -1 ? data[foundIndex].r : "maaf, saya masih dalam tahap pengembangan";
      });
    recv.className = "receiver";
    message.appendChild(recv);
    if (c % 2 == 1) { 
      new Audio('send.ogg').play();
    }
    message.scrollTop = recNode[recNode.length-1].offsetTop - 10;
    setTimeout(function() { input.value = '' }, 100);
  }
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


function themeChange(theme, theme2) {
  document.querySelector(':root').style.setProperty('--primary', theme);
  document.querySelector(':root').style.setProperty('--secondary', theme2);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", theme)
  localStorage.setItem('scheme', theme);
  localStorage.setItem('scheme2', theme2);
}


theme[0].onclick = function() {
  themeChange('orange', 'darkorange');
}
theme[1].onclick = function() {
  themeChange('lightskyblue', 'deepskyblue');
}
theme[2].onclick = function() {
  themeChange('mediumseagreen', 'seagreen');
}
theme[3].onclick = function() {
  themeChange('mediumpurple', 'rebeccapurple');
}
theme[4].onclick = function() {
  themeChange('black', 'black');
}

theme[5].onclick = function() {
  themeChange('#076', '#054');
  localStorage.clear();
}

window.onload = function() {
  document.getElementById('messages').style.display =
    document.getElementById('header').style.display =
    document.getElementById('type').style.display = "flex";
  document.getElementById('loader').style.display = "none";
}
