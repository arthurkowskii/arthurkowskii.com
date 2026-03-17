import re

filepath = "src/components/ProjectBento.astro"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

new_polling = """            let fmodPoller = null;
            function startFmodPolling(instance) {
              if (fmodPoller) clearInterval(fmodPoller);
              fmodPoller = setInterval(() => {
                if (!instance || !FMOD) return;
                
                let outval = {};
                let outfinal = {};
                let result = instance.getParameterByName("is_MobKilled", outval, outfinal);
                
                if (result === FMOD.OK) {
                  // Use the final target value, which correctly reads '0' when FMOD initiates the flash mob phase
                  let polledValue = Math.round(outfinal.val !== undefined ? outfinal.val : outval.val);
                  
                  if (polledValue !== gameState.isMobKilled) {
                    gameState.isMobKilled = polledValue;
                    updateToggleButtons();
                  }
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
print("Updated polling to use outfinal.val directly without debug text.")
