function initializeMenu() {
  const menuButton = document.querySelector("#menuToggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  if (!menuButton || !mobileMenu) return;

  const menuIcons = menuButton.querySelectorAll("svg");

  menuButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent click from propagating
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", !isExpanded);
    mobileMenu.classList.toggle("hidden");

    menuIcons.forEach(icon => icon.classList.toggle("hidden"));
  });

  document.addEventListener("click", (event) => {
    if (!menuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
      mobileMenu.classList.add("hidden");
      menuButton.setAttribute("aria-expanded", "false");
      menuIcons[0].classList.remove("hidden");
      menuIcons[1].classList.add("hidden");
    }
  });

  // Close menu on link click (for mobile UX)
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuButton.setAttribute("aria-expanded", "false");
      menuIcons[0].classList.remove("hidden");
      menuIcons[1].classList.add("hidden");
    });
  });
}
