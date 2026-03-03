# STICQR – SMART URL INPUT (AUTO HTTPS)

--------------------------------------------------
GOAL
--------------------------------------------------

When creating a URL attribute:

• Input should auto-fill with: https://
• Cursor should be placed at end
• If user pastes "example.com", auto-prepend https://
• Prevent double protocols
• Validate properly

--------------------------------------------------
STEP 1 — AUTO PREFILL ON TYPE SELECT
--------------------------------------------------

Inside startCreating(type):

REPLACE:

setTempValue("")

WITH:

if (type === "url") {
  setTempValue("https://")
} else {
  setTempValue("")
}

--------------------------------------------------
STEP 2 — SMART ON CHANGE HANDLER
--------------------------------------------------

Replace URL input block with:

<input
  type="url"
  value={tempValue}
  onChange={(e) => {
    let value = e.target.value.trim()

    // Prevent double protocol
    if (value.startsWith("https://https://")) {
      value = value.replace("https://https://", "https://")
    }

    // If user types without protocol and no protocol exists
    if (
      !value.startsWith("http://") &&
      !value.startsWith("https://") &&
      value.length > 0
    ) {
      value = "https://" + value
    }

    setTempValue(value)
  }}
  className="sheet-input"
/>

--------------------------------------------------
STEP 3 — VALIDATOR UPDATE
--------------------------------------------------

Update URL validator:

url: (v) => {
  try {
    const normalized =
      v.startsWith("http://") || v.startsWith("https://")
        ? v
        : "https://" + v

    new URL(normalized)
    return true
  } catch {
    return false
  }
}

--------------------------------------------------
STEP 4 — CLEAN SAVE VALUE
--------------------------------------------------

When saving attribute:

value: tempValue.replace(/^https?:\/\//, (match) =>
  match === "http://" ? "https://" : match
)

(Optional: enforce https only)

--------------------------------------------------
RESULT
--------------------------------------------------

User experience becomes:

Tap URL icon →
Input shows: https://
User pastes example.com →
Becomes: https://example.com
User pastes https://example.com →
No duplication
Validation works
Save enables correctly

--------------------------------------------------
DONE
--------------------------------------------------