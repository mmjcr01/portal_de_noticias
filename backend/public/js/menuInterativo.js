const menuBtn = document.querySelector("#menu-btn");
const searchBtn = document.querySelector("#search-btn");
const menuDropdown = document.querySelector(".menu-dropdown");
const searchBar = document.querySelector(".search-bar");

// Alterna o menu
menuBtn.addEventListener("click", (e) => {
  e.preventDefault();
  menuDropdown.classList.toggle("hidden");
  searchBar.classList.add("hidden"); // Fecha o campo de busca se estiver aberto
});

// Alterna o campo de busca
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchBar.classList.toggle("hidden");
  menuDropdown.classList.add("hidden"); // Fecha o menu se estiver aberto
});

// Fecha tudo se clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest("#menu-btn") && !e.target.closest(".menu-dropdown")) {
    menuDropdown.classList.add("hidden");
  }
  if (!e.target.closest("#search-btn") && !e.target.closest(".search-bar")) {
    searchBar.classList.add("hidden");
  }
});
