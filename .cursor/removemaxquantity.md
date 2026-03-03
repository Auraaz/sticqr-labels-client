# STICQR – REMOVE MAX QUANTITY FROM STATUS MODE (CORRECTION PASS)

This is a UI semantic correction.

Status mode must NOT render:
- max quantity
- unit labels (pcs, kg, etc.)
- "of X"
- dropdowns related to units
- numeric context of any kind

Measured mode remains unchanged.

Do NOT modify threshold logic.
Do NOT modify mapping logic.
Do NOT modify Clear behavior.
Do NOT refactor state structure.
Do NOT modify attributes system.
Do NOT redesign layout.

--------------------------------------------------
1. STATUS MODE UI CLEANUP
--------------------------------------------------

When mode === "status":

REMOVE from render tree:

- "of {maxQuantity}"
- unit label (pcs, kg, etc.)
- unit dropdown selector
- any numeric formatting elements
- any quantity display
- any slider
- any measurement subtext

Status mode must render ONLY:

- The segmented control:
    [ Empty | Low | Available | Full ]

Nothing else inside STOCK_CONTROL_ZONE.

--------------------------------------------------
2. MEASURED MODE (NO CHANGES)
--------------------------------------------------

When mode === "measured":

Continue rendering:

- Large numeric value
- "of {maxQuantity}"
- unit label
- slider

No changes here.

--------------------------------------------------
3. CONDITIONAL RENDER FIX
--------------------------------------------------

Ensure conditional rendering logic is strict:

If mode === "status":
    Do not mount measured components.
    Do not leave hidden numeric elements in DOM.
    Do not reserve space for numeric elements.

If mode === "measured":
    Do not mount status segmented control.

No overlapping render states allowed.

--------------------------------------------------
4. LAYOUT CONSISTENCY
--------------------------------------------------

STOCK_CONTROL_ZONE height must remain constant.

Status mode must vertically center its segmented control
so container does not appear visually collapsed.

Do NOT allow layout shift when toggling modes.

--------------------------------------------------
5. CLEANUP
--------------------------------------------------

Remove any now-unused:
- unit dropdown handlers in status branch
- quantity formatting utilities referenced in status
- conditional fragments that render empty wrappers

Ensure:
- No console warnings
- No unused variables
- No dead JSX fragments

--------------------------------------------------
6. REQUIRED OUTPUT
--------------------------------------------------

After implementation provide:

1. Confirmation that status mode renders no numeric context.
2. Confirmation that maxQuantity is only used in measured mode.
3. Updated conditional render snippet.
4. Confirmation no layout shift occurs on toggle.