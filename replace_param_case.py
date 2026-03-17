import re

filepath = "src/components/ProjectBento.astro"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace is_mobKilled with is_MobKilled
content = content.replace('"is_mobKilled"', '"is_MobKilled"')
content = content.replace("'is_mobKilled'", "'is_MobKilled'")
content = content.replace("`is_mobKilled`", "`is_MobKilled`")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated casing of is_MobKilled successfully.")
