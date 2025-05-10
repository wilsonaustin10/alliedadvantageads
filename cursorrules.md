# .cursorrules.txt

# ----------------------------------------------------------------------------

# Cursor Agent Control Rules

# Purpose: keep the agent focused, prevent duplicate files, avoid runaway loops,

# and **enable full project‑wide indexing** so the agent never misses context.

# Comment lines start with “#”.

# ----------------------------------------------------------------------------

## 1. PROMPT HYGIENE

system\_prompt: |
You are Cursor‑Agent operating under strict guard‑rails:
• Work incrementally; summarise your plan before executing.
• If uncertain, ask clarifying questions.
• NEVER create duplicate files—edit existing ones instead.
• Stop immediately if you detect repetitive output.

# Emit this token when any guard is triggered.

stop\_token: "🛑STOP🛑"

## 2. GENERAL AGENT BEHAVIOR

# Never create a new file if one with the same relative path already exists.

deduplicate\_files: true

# If a filename conflict arises, act according to this policy: ask | merge | abort

overwrite\_on\_conflict: ask

# Abort if the agent produces the exact same 20‑token sequence ≥ 3× in a single run.

anti\_pattern\_loop: true

# Limit the size and duration of any single operation.

max\_tokens: 2048
max\_steps: 50

## 3. PROJECT INDEXING

# Enable full‑project semantic indexing so the agent understands cross‑file dependencies.

full\_project\_indexing: true

# **Only** skip heavyweight or generated artifacts that provide no source value.

ignore\_dirs:

* .git             # VCS metadata
* node\_modules     # third‑party packages
* build            # compiled output
* dist             # distribution bundles
* coverage         # test coverage dumps
* logs             # runtime logs
* tmp              # temp files

# Binary/noise files to exclude from context.

ignore\_files:

* "\*.log"
* "\*.lock"
* "\*.png"
* "\*.jpg"
* "\*.jpeg"
* "\*.gif"
* "\*.svg"
* "\*.ico"
* "\*.pdf"
* "\*.mp4"
* "\*.zip"
* "*.tar*"
* "\*.db"

## 4. FILE‑CREATION POLICY

# Default action when asked to create a file that already exists.

file\_exists\_policy: prompt\_user     # prompt\_user | append | abort

# Require an explicit relative path + filename for any new file creation.

require\_path\_for\_new\_files: true

# Inject a banner comment at the top of every newly generated file.

enforce\_file\_banner: true

## 5. COMMIT & REFACTOR SAFETY

# Never attempt a repo‑wide refactor in a single operation.

limit\_refactor\_scope: "200 lines"

# Only stage files that changed since the last run.

auto\_stage\_changed\_only: true

# Always ask for confirmation before deleting any file.

confirm\_delete: true

## 6. LOGGING

enable\_logging: true
log\_level: info
log\_rotation: 7d
redact\_sensitive\_data: true

## 7. EXTENSIONS

# Add project‑specific rules below this line.

# END OF FILE
