# STICQR – ENFORCE HTTPS ONLY FOR URL ATTRIBUTES

--------------------------------------------------
GOAL
--------------------------------------------------

• URL input auto-prefills with https://
• http:// is NOT allowed
• If user pastes http:// → auto-convert to https://
• If user pastes domain only → auto-prepend https://
• Save only valid https URLs

--------------------------------------------------
STEP 1 — PREFILL WITH HTTPS
--------------------------------------------------

In startCreating(type):

REPLACE:

setTempValue("")

WITH:

if (type === "url") {
  setTempValue("https://")
} else {
  setTempValue("")
}

--------------------------------------------------
STEP 2 — STRICT URL INPUT HANDLER
--------------------------------------------------

Replace URL input onChange with:

onChange={(e) => {
  let value = e.target.value.trim()

  // Convert http:// to https://
  if (value.startsWith("http://")) {
    value = value.replace("http://", "https://")
  }

  // If no protocol and not empty, prepend https://
  if (
    value.length > 0 &&
    !value.startsWith("https://")
  ) {
    value = "https://" + value.replace(/^https?:\/\//, "")
  }

  setTempValue(value)
}}

--------------------------------------------------
STEP 3 — STRICT VALIDATOR
--------------------------------------------------

Replace url validator with:

url: (v) => {
  try {
    if (!v.startsWith("https://")) return false
    new URL(v)
    return true
  } catch {
    return false
  }
}

--------------------------------------------------
STEP 4 — OPTIONAL SAFETY ON SAVE
--------------------------------------------------

Before saving:

const cleanUrl = tempValue.startsWith("https://")
  ? tempValue
  : "https://" + tempValue.replace(/^https?:\/\//, "")

Use cleanUrl in newAttr.

--------------------------------------------------
RESULT
--------------------------------------------------

User types:
example.com
→ https://example.com

User pastes:
http://example.com
→ automatically becomes
https://example.com

User pastes:
https://example.com
→ unchanged

Save only enabled if:
Valid https URL

--------------------------------------------------
DONE
--------------------------------------------------