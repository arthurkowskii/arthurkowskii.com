import re

filepath = "src/components/ProjectBento.astro"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add introTimer variable
content = content.replace(
"""            const hiddenSliders = card.querySelectorAll(".fmod-hidden-params input");
            
            // Game state - simplified, no timers or automatic transitions""",
"""            const hiddenSliders = card.querySelectorAll(".fmod-hidden-params input");
            
            let introTimer = null;
            
            // Game state - simplified, no timers or automatic transitions""")

# Modify resetGame to clear timer
content = content.replace(
"""            function resetGame() {
              gameState = {""",
"""            function resetGame() {
              if (introTimer) {
                clearInterval(introTimer);
                introTimer = null;
              }
              gameState = {""")

# Modify playBtn
content = content.replace(
"""                  instance.start();
                  gameState.isPlaying = true;
                  
                  playBtn.setAttribute("disabled", "true");
                  if (stopBtn) stopBtn.removeAttribute("disabled");
                  if (resetBtn) resetBtn.removeAttribute("disabled");
                  
                  setButtonStates(true);
                  updateToggleButtons();
                  
                  if (gameStatus) gameStatus.textContent = "Audio playing - Use buttons to control parameters";
                  if (phaseLabel) phaseLabel.textContent = "ACTIVE";
                  if (phaseDesc) phaseDesc.textContent = "FMOD parameters responding to your actions";
                }""",
"""                  instance.start();
                  gameState.isPlaying = true;
                  
                  playBtn.setAttribute("disabled", "true");
                  if (stopBtn) stopBtn.removeAttribute("disabled");
                  if (resetBtn) resetBtn.removeAttribute("disabled");
                  
                  // Handle intro duration
                  const introDurationStr = card.dataset.fmodIntroDuration;
                  const introDuration = introDurationStr ? parseFloat(introDurationStr) : 0;
                  
                  if (introDuration > 0) {
                    setButtonStates(false);
                    if (phaseLabel) phaseLabel.textContent = "INTRO";
                    
                    let timeLeft = Math.ceil(introDuration);
                    if (gameStatus) gameStatus.textContent = `Intro playing... ${timeLeft}s remaining`;
                    if (phaseDesc) phaseDesc.textContent = "Listen to the buildup before the battle starts";
                    
                    if (introTimer) clearInterval(introTimer);
                    
                    introTimer = setInterval(() => {
                      timeLeft -= 1;
                      if (timeLeft > 0) {
                        if (gameStatus) gameStatus.textContent = `Intro playing... ${timeLeft}s remaining`;
                      } else {
                        clearInterval(introTimer);
                        introTimer = null;
                        
                        if (gameState.isPlaying) {
                          setButtonStates(true);
                          updateToggleButtons();
                          if (gameStatus) gameStatus.textContent = "Audio playing - Use buttons to control parameters";
                          if (phaseLabel) phaseLabel.textContent = "ACTIVE";
                          if (phaseDesc) phaseDesc.textContent = "FMOD parameters responding to your actions";
                        }
                      }
                    }, 1000);
                  } else {
                    setButtonStates(true);
                    updateToggleButtons();
                    if (gameStatus) gameStatus.textContent = "Audio playing - Use buttons to control parameters";
                    if (phaseLabel) phaseLabel.textContent = "ACTIVE";
                    if (phaseDesc) phaseDesc.textContent = "FMOD parameters responding to your actions";
                  }
                }""")

# Modify stopBtn
content = content.replace(
"""            // Stop button
            if (stopBtn) {
              stopBtn.addEventListener("click", () => {
                eventInstances.forEach((instance) => {""",
"""            // Stop button
            if (stopBtn) {
              stopBtn.addEventListener("click", () => {
                if (introTimer) {
                  clearInterval(introTimer);
                  introTimer = null;
                }
                eventInstances.forEach((instance) => {""")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Replaced intro logic successfully.")
