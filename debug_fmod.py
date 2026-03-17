import re

filepath = "src/components/ProjectBento.astro"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the startFmodPolling function to include on-screen debug text
new_polling = """            let debugTick = 0;
            function startFmodPolling(instance) {
              if (fmodPoller) clearInterval(fmodPoller);
              fmodPoller = setInterval(() => {
                if (!instance || !FMOD) return;
                
                let outval = {};
                let outfinal = {};
                let result = instance.getParameterByName("is_MobKilled", outval, outfinal);
                debugTick++;
                
                if (result === FMOD.OK) {
                  let polledValue = Math.round(outval.val);
                  
                  // DEBUG DISPLAY (every 5 ticks to avoid flicker, or just constantly)
                  if (debugTick % 5 === 0 && gameStatus) {
                    gameStatus.textContent = `[DEBUG] is_MobKilled: val=${outval.val.toFixed(2)} final=${outfinal.val ? outfinal.val.toFixed(2) : '?'}`;
                  }
                  
                  if (polledValue !== gameState.isMobKilled) {
                    gameState.isMobKilled = polledValue;
                    updateToggleButtons();
                  }
                } else if (debugTick % 5 === 0 && gameStatus) {
                  gameStatus.textContent = `[DEBUG ERR] getParameterByName returned FMOD error code: ${result}`;
                }
                
                let outvalSpecial = {};
                let resultSpecial = instance.getParameterByName("isSpecial", outvalSpecial);
                if (resultSpecial === FMOD.OK) {
                  let polledValueSpecial = Math.round(outvalSpecial.val);
                  if (polledValueSpecial !== gameState.isSpecial) {
                    gameState.isSpecial = polledValueSpecial;
                    if (gameState.isSpecial === 0 && specialTimer) {
                      clearInterval(specialTimer);
                      specialTimer = null;
                      gameState.specialCountdown = 0;
                    }
                    updateToggleButtons();
                    if (gameStatus && gameState.isPlaying) {
                      const state = gameState.isSpecial === 1 ? "ACTIVATED" : "DEACTIVATED";
                      gameStatus.textContent = `🔥 Special mode ${state}`;
                    }
                  }
                }
              }, 200);
            }"""

content = re.sub(
    r'function startFmodPolling\(instance\) \{.*?(?=\n\s*function stopFmodPolling)',
    new_polling,
    content,
    flags=re.DOTALL
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Added on-screen debug info to polling.")
