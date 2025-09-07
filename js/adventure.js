document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".read-more-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // safer selector: find the .extra-info inside the same .card-content
      const card = btn.closest(".card-content") || btn.parentElement;
      const info = card.querySelector(".extra-info");
      if (!info) return;

      const isVisible = info.style.display === "block" || info.classList.contains("show");

      // Option A: toggle using style property
      if (isVisible) {
        info.style.display = "none";
        btn.textContent = "Read More";
        info.classList.remove("show");
      } else {
        info.style.display = "block";
        btn.textContent = "Read Less";
        info.classList.add("show");
      }
    });
  });
});
