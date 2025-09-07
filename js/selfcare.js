document.addEventListener("DOMContentLoaded", () => {
  // Toggle Read More / Read Less
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
  // Subscribe button functionality
  const subscribeBtn = document.getElementById("subscribeBtn");
  const emailInput = document.getElementById("emailInput");
  const message = document.getElementById("subscribeMessage");

  subscribeBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    if (email === "") {
      message.textContent = "Please enter a valid email.";
      message.style.color = "red";
    } else {
      message.textContent = "Thank you for subscribing!";
      message.style.color = "green";
      emailInput.value = "";
    }
  });
});
