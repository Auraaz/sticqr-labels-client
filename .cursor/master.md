# STICQR – 4-STATE INTELLIGENT STOCK SYSTEM REFACTOR

This refactor implements a unified dual-mode stock system:

Modes:
- Status (4 discrete states)
- Measured (numeric slider)

States:
- Empty      (< 5%)
- Low        (5%–25%)
- Available  (25%–75%)
- Full       (> 75%)

This is a behavior + layout correction pass.
Do NOT redesign styling.
Do NOT refactor routes.
Do NOT modify theme system.
Do NOT modify attributes logic.

--------------------------------------------------
1. FIXED STOCK CONTROL CONTAINER
--------------------------------------------------

Create a fixed-height container called STOCK_CONTROL_ZONE.

Rules:
- Measured and Status render inside this container.
- Container height must NOT change between modes.
- No layout shift.
- No vertical resizing.
- Use crossfade transition (200ms max).
- Replace content inside container, not the container itself.

--------------------------------------------------
2. STATE MODEL (AUTHORITATIVE)
--------------------------------------------------

Editor state must be:

{
  mode: "status" | "measured",

  statusState: "empty" | "low" | "available" | "full",

  measuredQuantity: number,

  maxQuantity: number
}

measuredQuantity must always be numeric (0 allowed).
No null logic anymore.

--------------------------------------------------
3. THRESHOLD DEFINITIONS
--------------------------------------------------

Use strict percentage mapping:

If percent < 0.05 → "empty"
If percent < 0.25 → "low"
If percent < 0.75 → "available"
Else → "full"

Percent = measuredQuantity / maxQuantity

These thresholds must be centralized in one utility file.
Do NOT duplicate logic.

--------------------------------------------------
4. MEASURED → STATUS MAPPING
--------------------------------------------------

When switching from Measured → Status:

Derive statusState using threshold rules above.

Example:
If 43% → "available"
If 2% → "empty"
If 90% → "full"

Never default to empty unless threshold matches.

--------------------------------------------------
5. STATUS → MEASURED MAPPING
--------------------------------------------------

When switching from Status → Measured:

Assign measuredQuantity based on MINIMUM value of that band:

"empty"      → 0
"low"        → 0.10 * maxQuantity
"available"  → 0.50 * maxQuantity
"full"       → 1.00 * maxQuantity

This ensures visual consistency.
Do NOT leave previous numeric value when status changed manually.

--------------------------------------------------
6. STATUS UI (IOS STYLE)
--------------------------------------------------

Replace radio buttons with segmented control style:

[ Empty | Low | Available | Full ]

- Single selection only.
- Smooth sliding indicator.
- Same footprint as slider.
- Same typography hierarchy as numeric display.
- Lives inside STOCK_CONTROL_ZONE.

--------------------------------------------------
7. MEASURED UI
--------------------------------------------------

Measured mode renders:

- Large numeric display
- Subtext (e.g., "of 5 kg")
- Slider

All inside STOCK_CONTROL_ZONE.

No size difference from Status mode.
No layout jump.

--------------------------------------------------
8. MODE TOGGLE POSITIONING
--------------------------------------------------

Move Mode Toggle to top right of header:

Clear                        Status | Measured

- Same vertical alignment.
- No stacking.
- No wrapping.
- Must not push layout down.

--------------------------------------------------
9. CLEAR BEHAVIOR
--------------------------------------------------

Clear must reset:

- mode → "status"
- statusState → "empty"
- measuredQuantity → 0
- attributes → []
- validation errors → cleared

Clear must NOT reset:
- theme
- maxQuantity
- layout
- global state

Disable Clear if:
- statusState === "empty"
- measuredQuantity === 0
- attributes.length === 0

--------------------------------------------------
10. DISPLAY RULES
--------------------------------------------------

Measured Mode:
- Always show numeric value.
- 0 must display as 0 (not Empty text).

Status Mode:
- Only show selected status label.
- Do NOT show numeric value.

--------------------------------------------------
11. SAFETY RULES
--------------------------------------------------

- No console warnings.
- No duplicated threshold logic.
- No state mutation.
- No effect loops syncing state redundantly.
- Mapping must happen only on mode switch.

--------------------------------------------------
12. REQUIRED OUTPUT
--------------------------------------------------

After implementation provide:

1. Threshold utility implementation.
2. Mode switch handler logic.
3. Clear handler logic.
4. Confirmation:
   - No layout resizing.
   - Status and Measured share identical container height.
   - Bidirectional mapping works correctly.
5. List of removed legacy logic.