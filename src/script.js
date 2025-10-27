"use strict";
const btn = document.getElementById("btn");
const bg = document.getElementById("hover-bg");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
const themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
const rippleButtons = document.querySelectorAll(".ripple-btn");
const filterAllBtn = document.getElementById("filter-all");
const filterActiveBtn = document.getElementById("filter-active");
const filterInactiveBtn = document.getElementById("filter-inactive");
function getExtensionCards() {
  return document.querySelectorAll(".extension-card");
}
function updateThemeIcons() {
  if (document.documentElement.classList.contains("dark")) {
    themeToggleDarkIcon.classList.remove("hidden");
    themeToggleLightIcon.classList.add("hidden");
  } else {
    themeToggleDarkIcon.classList.add("hidden");
    themeToggleLightIcon.classList.remove("hidden");
  }
}
function initTheme() {
  const storedTheme = localStorage.getItem("color-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  updateThemeIcons();
}
themeToggleBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    "color-theme",
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  updateThemeIcons();
});
initTheme();
btn.addEventListener("mouseenter", (e) => {
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  bg.style.transformOrigin = `${x}px ${y}px`;
  bg.classList.add("scale-100");
});
btn.addEventListener("mouseleave", () => bg.classList.remove("scale-100"));
rippleButtons.forEach((btn) => {
  const bg = btn.querySelector("span");
  btn.addEventListener("mouseenter", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    bg.style.transformOrigin = `${x}px ${y}px`;
    bg.classList.add("scale-100");
  });
  btn.addEventListener("mouseleave", () => bg.classList.remove("scale-100"));
});
filterAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getExtensionCards().forEach((card) => (card.style.display = "block"));
});
filterActiveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getExtensionCards().forEach((card) => {
    const checkbox = card.querySelector("input[type='checkbox']");
    card.style.display = checkbox.checked ? "block" : "none";
  });
});
filterInactiveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getExtensionCards().forEach((card) => {
    const checkbox = card.querySelector("input[type='checkbox']");
    card.style.display = !checkbox.checked ? "block" : "none";
  });
});
function saveCardsData() {
  const cardsData = [];
  getExtensionCards().forEach((card) => {
    const id = card.dataset.id;
    const checkbox = card.querySelector("input[type='checkbox']");
    cardsData.push({
      id,
      active: checkbox.checked,
    });
  });
  localStorage.setItem("cardsData", JSON.stringify(cardsData));
}
function loadCardsData() {
  const stored = JSON.parse(localStorage.getItem("cardsData")) || [];
  stored.forEach((savedCard) => {
    const card = document.querySelector(
      `.extension-card[data-id="${savedCard.id}"]`
    );
    if (card) {
      const checkbox = card.querySelector("input[type='checkbox']");
      checkbox.checked = savedCard.active;
    }
  });
  const removed = JSON.parse(localStorage.getItem("removedCards")) || [];
  removed.forEach((id) => {
    const card = document.querySelector(`.extension-card[data-id="${id}"]`);
    if (card) card.remove();
  });
}
function initRemoveButtons() {
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".extension-card");
      const id = card.dataset.id;
      const removed = JSON.parse(localStorage.getItem("removedCards")) || [];
      if (!removed.includes(id)) removed.push(id);
      localStorage.setItem("removedCards", JSON.stringify(removed));

      card.remove();
      saveCardsData();
    });
  });
}
function initCheckboxListeners() {
  getExtensionCards().forEach((card) => {
    const checkbox = card.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", saveCardsData);
  });
}
loadCardsData();
initRemoveButtons();
initCheckboxListeners();
