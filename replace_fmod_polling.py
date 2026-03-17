import re

filepath = "src/components/ProjectBento.astro"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add fmodPoller
content = content.replace(
"""            let introTimer = null;""",
"""            let introTimer = null;
            let fmodPoller = null;

            function startFmodPolling(instance) {
              if (fmodPoller) clearInterval(fmodPoller);
              fmodPoller = setInterval(() => {
                if (!instance || !FMOD) return;
                let outval = {};
                let result = instance.getParameterByName("is_mobKilled", outval);
                if (result === FMOD.OK) {
                  let polledValue = Math.round(outval.val);
                  if (polledValue !== gameState.isMobKilled) {
                    gameState.isMobKilled = polledValue;
                    updateToggleButtons();
                    if (gameStatus && gameState.isPlaying) {
                      const state = gameState.isMobKilled === 1 ? "killed" : "respawned";
                      gameStatus.textContent = `💀 Mob ${state}`;
                    }
                  }
                }
                
                let outvalSpecial = {};
                let resultSpecial = instance.getParameterByName("isSpecial", outvalSpecial);
                if (resultSpecial === FMOD.OK) {
                  let polledValueSpecial = Math.round(outvalSpecial.val);
                  if (polledValueSpecial !== gameState.isSpecial) {
                    gameState.isSpecial = polledValueSpecial;
                    updateToggleButtons();
                    if (gameStatus && gameState.isPlaying) {
                      const state = gameState.isSpecial === 1 ? "ACTIVATED" : "DEACTIVATED";
                      gameStatus.textContent = `🔥 Special mode ${state}`;
                    }
                  }
                }
              }, 200);
            }

            function stopFmodPolling() {
              if (fmodPoller) clearInterval(fmodPoller);
              fmodPoller = null;
            }""")

content = content.replace(
"""              if (introTimer) {
                clearInterval(introTimer);
                introTimer = null;
              }
              gameState = {""",
"""              if (introTimer) {
                clearInterval(introTimer);
                introTimer = null;
              }
              stopFmodPolling();
              gameState = {""")

content = content.replace(
"""                if (introTimer) {
                  clearInterval(introTimer);
                  introTimer = null;
                }
                eventInstances.forEach((instance) => {""",
"""                if (introTimer) {
                  clearInterval(introTimer);
                  introTimer = null;
                }
                stopFmodPolling();
                eventInstances.forEach((instance) => {""")

# Modify where active state begins
content = content.replace(
"""                        if (gameState.isPlaying) {
                          setButtonStates(true);
                          updateToggleButtons();
                          if (gameStatus) gameStatus.textContent = "Audio playing - Use buttons to control parameters";
                          if (phaseLabel) phaseLabel.textContent = "ACTIVE";
                          if (phaseDesc) phaseDesc.textContent = "FMOD parameters responding to your actions";
                        }
                      }
                    }, 1000);""",
"""                        if (gameState.isPlaying) {
                          setButtonStates(true);
                          updateToggleButtons();
                          if (gameStatus) gameStatus.textContent = "Audio playing - Use buttons to control parameters";
                          if (phaseLabel) phaseLabel.textContent = "ACTIVE";
                          if (phaseDesc) phaseDesc.textContent = "FMOD parameters responding to your actions";
                          startFmodPolling(instance);
                        }
                      }
                    }, 1000);""")

content = content.replace(
"""                  } else {
                    setButtonStates(true);
                    updateToggleButtons();
                    if (gameStatus) gameStatus.textContent = "Audio playing - Use buttons to control parameters";
                    if (phaseLabel) phaseLabel.textContent = "ACTIVE";
                    if (phaseDesc) phaseDesc.textContent = "FMOD parameters responding to your actions";
                  }
                }""",
"""                  } else {
                    setButtonStates(true);
                    updateToggleButtons();
                    if (gameStatus) gameStatus.textContent = "Audio playing - Use buttons to control parameters";
                    if (phaseLabel) phaseLabel.textContent = "ACTIVE";
                    if (phaseDesc) phaseDesc.textContent = "FMOD parameters responding to your actions";
                    startFmodPolling(instance);
                  }
                }""")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Replaced fmod polling successfully.")
