// Burger menu
const burgerBtn = document.getElementById("burgerBtn");
const navMenu = document.getElementById("navMenu");
if (burgerBtn && navMenu){
  burgerBtn.addEventListener("click", () => navMenu.classList.toggle("open"));
}

// Year footer
const y = document.getElementById("y");
if (y) y.textContent = new Date().getFullYear();

// Logo modal (si image existe)
const logoModal = document.getElementById("logoModal");
const closeLogo = document.getElementById("closeLogo");

document.addEventListener("click", (e) => {
  const t = e.target;
  if (t && t.matches && t.matches("[data-open-logo]")){
    if (logoModal) logoModal.classList.add("open");
  }
  if (t === logoModal) logoModal.classList.remove("open");
});

if (closeLogo){
  closeLogo.addEventListener("click", () => logoModal.classList.remove("open"));
  }
