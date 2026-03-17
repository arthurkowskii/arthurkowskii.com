import re

filepath = "src/components/ProjectBento.astro"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

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
                  
                  // DEBUG DISPLAY
                  if (debugTick % 3 === 0 && gameStatus) {
                    try {
                        let finalStr = JSON.stringify(outfinal);
                        gameStatus.textContent = `[DEBUG] is_MobKilled: val=${outval.val} rawFinal=${finalStr}`;
                    } catch(e) {
                         gameStatus.textContent = `[DEBUG] is_MobKilled: val=${outval.val}`;
                    }
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
                  }
                }
              }, 200);
            }"""

content = re.sub(
    r'            let debugTick = 0;[\s\S]*?(?=\n\s*function stopFmodPolling)',
    new_polling,
    content,
    flags=re.DOTALL
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated polling debug logic to dump JSON")
