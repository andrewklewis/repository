document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("themeToggle");
  const body = document.body;

  // Select elements for theme changes
  const gradientBgElements = document.querySelectorAll(".bg-gradient-to-r.from-slate-900, .via-slate-800, .to-slate-900");
  const solidBgElements = document.querySelectorAll(".bg-gray-900, .bg-gray-800, nav"); // Includes mobile menu & nav
  const textElements = document.querySelectorAll(".text-white, .mode-text, nav a"); // Includes nav links
  const iconElements = document.querySelectorAll("svg.icon-white");
  const mobileMenu = document.querySelector("#mobile-menu"); // Ensure mobile menu changes
  const linkElements = document.querySelectorAll("a"); // Includes all links

  // Elements for toggling Light/Dark text visibility
  const darkText = document.getElementById("darkText");
  const lightText = document.getElementById("lightText");

  // Load saved theme preference
  if (localStorage.getItem("theme") === "light") {
    enableLightMode();
    toggleButton.checked = true; // Ensure the toggle switch is set correctly
  }

  // Event listener for theme toggle
  toggleButton.addEventListener("change", () => {
    if (body.classList.contains("light-mode")) {
      enableDarkMode();
    } else {
      enableLightMode();
    }
  });

  function enableLightMode() {
    console.log("🌞 Switching to Light Mode");
    body.classList.add("light-mode");
    localStorage.setItem("theme", "light");

    // Apply styles for light mode
    gradientBgElements.forEach(el => el.classList.add("light-gradient-bg"));
    solidBgElements.forEach(el => el.classList.add("light-solid-bg"));
    textElements.forEach(el => el.classList.add("light-text"));
    iconElements.forEach(el => el.classList.add("light-icon"));
    linkElements.forEach(el => el.classList.add("light-link"));

    // Apply light mode to the mobile menu
    if (mobileMenu) {
      mobileMenu.classList.remove("bg-gray-800");
      mobileMenu.classList.add("bg-white");
      console.log("📱 Mobile menu updated for Light Mode: bg-white applied");
    }

    // Toggle text visibility
    darkText.classList.add("hidden");
    lightText.classList.remove("hidden");
  }

  function enableDarkMode() {
    console.log("🌙 Switching to Dark Mode");
    body.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");

    // Remove light mode styles
    gradientBgElements.forEach(el => el.classList.remove("light-gradient-bg"));
    solidBgElements.forEach(el => el.classList.remove("light-solid-bg"));
    textElements.forEach(el => el.classList.remove("light-text"));
    iconElements.forEach(el => el.classList.remove("light-icon"));
    linkElements.forEach(el => el.classList.remove("light-link"));

    // Apply dark mode to the mobile menu
    if (mobileMenu) {
      mobileMenu.classList.remove("bg-white");
      mobileMenu.classList.add("bg-gray-800");
      console.log("📱 Mobile menu updated for Dark Mode: bg-gray-800 applied");
    }

    // Toggle text visibility
    darkText.classList.remove("hidden");
    lightText.classList.add("hidden");
  }
});
