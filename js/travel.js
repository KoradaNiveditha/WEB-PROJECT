// Sample interactivity for Travel Page
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      alert("Discover more about this destination soon!");
    });
  });
});
