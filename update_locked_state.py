import re

filepath = "src/components/ProjectBento.astro"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update updateToggleButtons()
old_killmob_logic = """                if (action === "killmob") {
                  if (gameState.isMobKilled === 1) {
                    btn.style.display = "none";
                    btn.classList.remove("active");
                  } else {
                    btn.style.display = "flex"; // Show it when mob is alive
                    btn.classList.add("pulse-animation"); // Optional CSS class we will add later
                    btn.querySelector(".btn-hint").textContent = "Click to Kill";
                  }
                }"""

new_killmob_logic = """                if (action === "killmob") {
                  btn.style.display = "flex"; // Always visible now
                  if (gameState.isMobKilled === 1) {
                    btn.setAttribute("disabled", "true");
                    btn.classList.remove("active");
                    btn.classList.remove("pulse-animation");
                    btn.querySelector(".btn-hint").textContent = "LOCKED";
                  } else {
                    // Flash mob active! Unlocked!
                    btn.removeAttribute("disabled");
                    btn.classList.add("pulse-animation");
                    btn.querySelector(".btn-hint").textContent = "CLICK TO KILL";
                  }
                }"""
content = content.replace(old_killmob_logic, new_killmob_logic)


# 2. Update setButtonStates() to prevent overriding the killmob lock
old_set_buttons = """            function setButtonStates(enabled) {
              actionBtns.forEach(btn => {
                if (enabled) {
                  btn.removeAttribute("disabled");
                } else {
                  btn.setAttribute("disabled", "true");
                }
              });
            }"""

new_set_buttons = """            function setButtonStates(enabled) {
              actionBtns.forEach(btn => {
                if (enabled) {
                  // If we are enabling buttons, ensure Kill Mob stays disabled if the mob isn't spawned yet
                  if (btn.dataset.action === "killmob" && gameState.isMobKilled === 1) {
                    btn.setAttribute("disabled", "true");
                  } else {
                    btn.removeAttribute("disabled");
                  }
                } else {
                  btn.setAttribute("disabled", "true");
                }
              });
            }"""
content = content.replace(old_set_buttons, new_set_buttons)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated killmob locked-state logic successfully.")
