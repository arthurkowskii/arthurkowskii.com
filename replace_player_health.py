import re

filepath = "src/components/ProjectBento.astro"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# I will replace specific patterns

# 1. Remove playerHealth constants
content = content.replace(
"""            const playerHealthFill = card.querySelector(".fmod-player-card .health-fill");
            const playerHealthValue = card.querySelector(".fmod-player-card .health-value-display");""", "")

content = content.replace(
"""            const playerHealthBarLegacy = card.querySelector(".fmod-player .health-fill");
            const playerHealthValueLegacy = card.querySelector(".fmod-player .health-value");""", "")

# 2. Game state
content = content.replace(
"""            let gameState = {
              bossHealth: 100,
              playerHealth: 100,
              isMobKilled: 1, // 1 = mob killed/no mob, 0 = mob alive""",
"""            let gameState = {
              bossHealth: 100,
              isMobKilled: 1, // 1 = mob killed/no mob, 0 = mob alive""")

# 3. updateHealthBars
content = content.replace(
"""            function updateHealthBars() {
              const bossPercent = `${gameState.bossHealth}%`;
              const playerPercent = `${gameState.playerHealth}%`;
              
              // Update new card displays
              if (bossHealthFill) bossHealthFill.style.width = bossPercent;
              if (bossHealthValue) bossHealthValue.textContent = bossPercent;
              if (playerHealthFill) playerHealthFill.style.width = playerPercent;
              if (playerHealthValue) playerHealthValue.textContent = playerPercent;
              
              // Update legacy displays (if they exist)
              if (bossHealthBarLegacy) bossHealthBarLegacy.style.width = bossPercent;
              if (bossHealthValueLegacy) bossHealthValueLegacy.textContent = bossPercent;
              if (playerHealthBarLegacy) playerHealthBarLegacy.style.width = playerPercent;
              if (playerHealthValueLegacy) playerHealthValueLegacy.textContent = playerPercent;""",
"""            function updateHealthBars() {
              const bossPercent = `${gameState.bossHealth}%`;
              
              // Update new card displays
              if (bossHealthFill) bossHealthFill.style.width = bossPercent;
              if (bossHealthValue) bossHealthValue.textContent = bossPercent;
              
              // Update legacy displays (if they exist)
              if (bossHealthBarLegacy) bossHealthBarLegacy.style.width = bossPercent;
              if (bossHealthValueLegacy) bossHealthValueLegacy.textContent = bossPercent;""")

content = content.replace(
"""              // Update FMOD parameters (both global and local on instances)
              if (studioSystem && isInitialized) {
                studioSystem.setParameterByName("BOSS_HEALTH", gameState.bossHealth, true);
                studioSystem.setParameterByName("PLAYER_HEALTH", gameState.playerHealth, true);
                eventInstances.forEach((instance) => {
                  try {
                    instance.setParameterByName("BOSS_HEALTH", gameState.bossHealth, true);
                    instance.setParameterByName("PLAYER_HEALTH", gameState.playerHealth, true);
                  } catch {}
                });
              }""",
"""              // Update FMOD parameters (both global and local on instances)
              if (studioSystem && isInitialized) {
                studioSystem.setParameterByName("BOSS_HEALTH", gameState.bossHealth, true);
                eventInstances.forEach((instance) => {
                  try {
                    instance.setParameterByName("BOSS_HEALTH", gameState.bossHealth, true);
                  } catch {}
                });
              }""")

content = content.replace(
"""              // Update hidden sliders
              hiddenSliders.forEach(slider => {
                const name = slider.dataset.paramName;
                if (name === "BOSS_HEALTH") slider.value = gameState.bossHealth;
                if (name === "PLAYER_HEALTH") slider.value = gameState.playerHealth;
              });""",
"""              // Update hidden sliders
              hiddenSliders.forEach(slider => {
                const name = slider.dataset.paramName;
                if (name === "BOSS_HEALTH") slider.value = gameState.bossHealth;
              });""")

# 4. resetGame
content = content.replace(
"""            function resetGame() {
              gameState = {
                bossHealth: 100,
                playerHealth: 100,
                isMobKilled: 1,""",
"""            function resetGame() {
              gameState = {
                bossHealth: 100,
                isMobKilled: 1,""")

content = content.replace(
"""              // Reset FMOD parameters (both global and local on instances)
              if (studioSystem && isInitialized) {
                studioSystem.setParameterByName("BOSS_HEALTH", 100, true);
                studioSystem.setParameterByName("PLAYER_HEALTH", 100, true);
                studioSystem.setParameterByName("is_mobKilled", 1, true);
                studioSystem.setParameterByName("isSpecial", 0, true);
                eventInstances.forEach((instance) => {
                  try {
                    instance.setParameterByName("BOSS_HEALTH", 100, true);
                    instance.setParameterByName("PLAYER_HEALTH", 100, true);
                    instance.setParameterByName("is_mobKilled", 1, true);
                    instance.setParameterByName("isSpecial", 0, true);
                  } catch {}
                });
              }""",
"""              // Reset FMOD parameters (both global and local on instances)
              if (studioSystem && isInitialized) {
                studioSystem.setParameterByName("BOSS_HEALTH", 100, true);
                studioSystem.setParameterByName("is_mobKilled", 1, true);
                studioSystem.setParameterByName("isSpecial", 0, true);
                eventInstances.forEach((instance) => {
                  try {
                    instance.setParameterByName("BOSS_HEALTH", 100, true);
                    instance.setParameterByName("is_mobKilled", 1, true);
                    instance.setParameterByName("isSpecial", 0, true);
                  } catch {}
                });
              }""")

# 5. playBtn
content = content.replace(
"""                  // Set initial parameters on both system and instance
                  studioSystem.setParameterByName("BOSS_HEALTH", 100, true);
                  studioSystem.setParameterByName("PLAYER_HEALTH", 100, true);
                  studioSystem.setParameterByName("is_mobKilled", 1, true);
                  studioSystem.setParameterByName("isSpecial", 0, true);
                  
                  // Also set on instance for local parameters
                  try {
                    instance.setParameterByName("BOSS_HEALTH", 100, true);
                    instance.setParameterByName("PLAYER_HEALTH", 100, true);
                    instance.setParameterByName("is_mobKilled", 1, true);
                    instance.setParameterByName("isSpecial", 0, true);
                  } catch {}""",
"""                  // Set initial parameters on both system and instance
                  studioSystem.setParameterByName("BOSS_HEALTH", 100, true);
                  studioSystem.setParameterByName("is_mobKilled", 1, true);
                  studioSystem.setParameterByName("isSpecial", 0, true);
                  
                  // Also set on instance for local parameters
                  try {
                    instance.setParameterByName("BOSS_HEALTH", 100, true);
                    instance.setParameterByName("is_mobKilled", 1, true);
                    instance.setParameterByName("isSpecial", 0, true);
                  } catch {}""")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Replaced content successfully.")
