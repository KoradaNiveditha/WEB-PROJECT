document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".read-more-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const info = btn.previousElementSibling;
      if (info.style.display === "none" || info.style.display === "") {
        info.style.display = "block";
        btn.textContent = "Read Less";
      } else {
        info.style.display = "none";
        btn.textContent = "Read More";
      }
    });
  });
});
