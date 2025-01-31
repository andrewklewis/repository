document.addEventListener("DOMContentLoaded", () => {
  const navPlaceholder = document.getElementById("nav-placeholder");

  if (navPlaceholder) {
    fetch("nav.html")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then(data => {
        navPlaceholder.innerHTML = data;
        initializeMenu(); // Ensure the mobile menu works
      })
      .catch(error => console.error("Error loading navigation:", error));
  }
});
