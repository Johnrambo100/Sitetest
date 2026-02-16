document.getElementById("y").textContent=new Date().getFullYear();

const burger=document.getElementById("burgerBtn");
const menu=document.getElementById("navMenu");

if(burger){
  burger.onclick=()=>menu.classList.toggle("show");
}
