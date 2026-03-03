# STICQR – LOCK STATUS / MEASURED CONTROL HEIGHT

--------------------------------------------------
PROBLEM
--------------------------------------------------

Switching between "status" and "measured"
changes vertical height of the stock control zone.

This causes layout jumping.

--------------------------------------------------
GOAL
--------------------------------------------------

The stock control area must:

• Have fixed height
• Match height of:
  - Quantity text
  - Slider
  - Capacity row
• Remain constant between modes

--------------------------------------------------
STEP 1 — DEFINE FIXED HEIGHT
--------------------------------------------------

Measure approximate total height of:

Quantity (≈60px)
Slider (≈40px)
Spacing (≈20px)
Capacity row (≈50px)

Total ≈170–190px

Use 200px for safety.

--------------------------------------------------
STEP 2 — UPDATE STOCK ZONE WRAPPER
--------------------------------------------------

Find:

<div className="stock-zone">

Replace with:

<div className="stock-zone">
  <div className="stock-inner">

--------------------------------------------------
STEP 3 — ADD CSS
--------------------------------------------------

.stock-zone {
  height: 220px;              /* fixed height */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stock-inner {
  width: 100%;
  position: relative;
}

--------------------------------------------------
STEP 4 — REMOVE CONDITIONAL SPACING
--------------------------------------------------

REMOVE:

marginTop adjustments
extra spacer rows
conditional vertical gaps

Measured and Status must both live inside stock-zone.

--------------------------------------------------
STEP 5 — CENTER BOTH MODES
--------------------------------------------------

Ensure both:

mode === "measured"
mode === "status"

render inside stock-inner
and are vertically centered.

Use:

display: flex;
flex-direction: column;
align-items: center;
justify-content: center;

--------------------------------------------------
RESULT
--------------------------------------------------

Switching between:

Status ↔ Measured

Now:

• No height shift
• No layout jump
• No attribute movement
• No visual collapse
• Stable appliance feel

--------------------------------------------------
DONE
--------------------------------------------------