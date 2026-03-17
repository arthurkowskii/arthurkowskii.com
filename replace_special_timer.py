import re

filepath = "src/components/ProjectBento.astro"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add special timer variables
content = content.replace(
"""            let fmodPoller = null;""",
"""            let fmodPoller = null;
            let specialTimer = null;""")

# Add special countdown to gameState
content = content.replace(
"""              isSpecial: 0,   // 1 = special mode on, 0 = off
              isPlaying: false
            };""",
"""              isSpecial: 0,   // 1 = special mode on, 0 = off
              specialCountdown: 0,
              isPlaying: false
            };""")

# updateToggleButtons check for countdown
content = content.replace(
"""                if (action === "special") {
                  if (gameState.isSpecial === 1) {
                    btn.classList.add("active");
                    btn.querySelector(".btn-hint").textContent = "ON";
                  } else {
                    btn.classList.remove("active");
                    btn.querySelector(".btn-hint").textContent = "OFF";
                  }
                }""",
"""                if (action === "special") {
                  if (gameState.isSpecial === 1) {
                    btn.classList.add("active");
                    if (gameState.specialCountdown > 0) {
                      btn.querySelector(".btn-hint").textContent = `${gameState.specialCountdown}s`;
                    } else {
                      btn.querySelector(".btn-hint").textContent = "ON";
                    }
                  } else {
                    btn.classList.remove("active");
                    btn.querySelector(".btn-hint").textContent = "OFF";
                  }
                }""")

# Reset clear timer
content = content.replace(
"""              if (introTimer) {
                clearInterval(introTimer);
                introTimer = null;
              }
              stopFmodPolling();""",
"""              if (introTimer) {
                clearInterval(introTimer);
                introTimer = null;
              }
              if (specialTimer) {
                clearInterval(specialTimer);
                specialTimer = null;
              }
              stopFmodPolling();""")

content = content.replace(
"""                if (introTimer) {
                  clearInterval(introTimer);
                  introTimer = null;
                }
                stopFmodPolling();""",
"""                if (introTimer) {
                  clearInterval(introTimer);
                  introTimer = null;
                }
                if (specialTimer) {
                  clearInterval(specialTimer);
                  specialTimer = null;
                }
                stopFmodPolling();""")

# Poller update - if isSpecial is found turned on externally, we might want to start timer.
# But it's easier to just handle it in the button click, and if the polling sees it turned off, it clears it.
content = content.replace(
"""                  if (polledValueSpecial !== gameState.isSpecial) {
                    gameState.isSpecial = polledValueSpecial;
                    updateToggleButtons();""",
"""                  if (polledValueSpecial !== gameState.isSpecial) {
                    gameState.isSpecial = polledValueSpecial;
                    if (gameState.isSpecial === 0 && specialTimer) {
                      clearInterval(specialTimer);
                      specialTimer = null;
                      gameState.specialCountdown = 0;
                    }
                    updateToggleButtons();""")

# Button Click for special mode
content = content.replace(
"""                  case "special":
                    // Toggle isSpecial parameter between 0 and 1
                    gameState.isSpecial = gameState.isSpecial === 0 ? 1 : 0;
                    
                    // Update FMOD (both global and local on instances)
                    if (studioSystem && isInitialized) {
                      studioSystem.setParameterByName("isSpecial", gameState.isSpecial, true);
                      eventInstances.forEach((instance) => {
                        try {
                          instance.setParameterByName("isSpecial", gameState.isSpecial, true);
                        } catch {}
                      });
                    }
                    
                    // Update UI
                    updateToggleButtons();
                    
                    if (gameStatus) {
                      const state = gameState.isSpecial === 1 ? "ACTIVATED" : "DEACTIVATED";
                      gameStatus.textContent = `🔥 Special mode ${state}`;
                    }
                    break;""",
"""                  case "special":
                    // Toggle isSpecial parameter between 0 and 1
                    gameState.isSpecial = gameState.isSpecial === 0 ? 1 : 0;
                    
                    if (gameState.isSpecial === 1) {
                      // Start 30s countdown
                      gameState.specialCountdown = 30;
                      if (specialTimer) clearInterval(specialTimer);
                      specialTimer = setInterval(() => {
                        gameState.specialCountdown -= 1;
                        if (gameState.specialCountdown <= 0) {
                          clearInterval(specialTimer);
                          specialTimer = null;
                          gameState.isSpecial = 0;
                          
                          // Turn off in FMOD
                          if (studioSystem && isInitialized) {
                            studioSystem.setParameterByName("isSpecial", 0, true);
                            eventInstances.forEach((instance) => {
                              try { instance.setParameterByName("isSpecial", 0, true); } catch {}
                            });
                          }
                          updateToggleButtons();
                          if (gameStatus) gameStatus.textContent = "🔥 Special mode EXPIRED";
                        } else {
                          updateToggleButtons();
                        }
                      }, 1000);
                    } else {
                      // Turned off manually
                      if (specialTimer) {
                         clearInterval(specialTimer);
                         specialTimer = null;
                      }
                      gameState.specialCountdown = 0;
                    }
                    
                    // Update FMOD (both global and local on instances)
                    if (studioSystem && isInitialized) {
                      studioSystem.setParameterByName("isSpecial", gameState.isSpecial, true);
                      eventInstances.forEach((instance) => {
                        try {
                          instance.setParameterByName("isSpecial", gameState.isSpecial, true);
                        } catch {}
                      });
                    }
                    
                    // Update UI
                    updateToggleButtons();
                    
                    if (gameStatus) {
                      const state = gameState.isSpecial === 1 ? "ACTIVATED" : "DEACTIVATED";
                      gameStatus.textContent = `🔥 Special mode ${state}`;
                    }
                    break;""")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Replaced special timer logic successfully.")
