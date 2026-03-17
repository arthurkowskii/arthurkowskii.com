import re

filepath = "src/components/ProjectBento.astro"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Modify updateToggleButtons to hide the killmob button when is_mobKilled === 1
content = content.replace(
"""                if (action === "killmob") {
                  if (gameState.isMobKilled === 1) {
                    btn.classList.add("active");
                    btn.querySelector(".btn-hint").textContent = "Killed";
                  } else {
                    btn.classList.remove("active");
                    btn.querySelector(".btn-hint").textContent = "Alive";
                  }
                }""",
"""                if (action === "killmob") {
                  if (gameState.isMobKilled === 1) {
                    btn.style.display = "none";
                    btn.classList.remove("active");
                  } else {
                    btn.style.display = "flex"; // Show it when mob is alive
                    btn.classList.add("pulse-animation"); // Optional CSS class we will add later
                    btn.querySelector(".btn-hint").textContent = "Click to Kill";
                  }
                }""")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated killmob logic successfully.")
