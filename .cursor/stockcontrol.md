# STICQR – STOCK CONTROL RENDER RECOVERY PASS

This is a recovery pass to fix rendering regressions.

Current issues:
- Status mode renders no dial or labels.
- Measured mode lost slider, value display, unit selector.
- Attribute selection row disappeared.
- Conditional rendering likely unmounted shared elements.

This task restores correct render structure.

DO NOT modify threshold logic.
DO NOT modify mapping logic.
DO NOT modify Clear behavior.
DO NOT refactor state shape.
DO NOT redesign styling.

--------------------------------------------------
1. RESTORE STOCK_CONTROL_ZONE STRUCTURE
--------------------------------------------------

Ensure STOCK_CONTROL_ZONE exists and is ALWAYS mounted.

Structure must be:

<StockControlZone>
   {mode === "status" && <StatusControl />}
   {mode === "measured" && <MeasuredControl />}
</StockControlZone>

Do NOT conditionally render the container itself.
Only swap internal content.

--------------------------------------------------
2. STATUS MODE – IMPLEMENT IOS-STYLE DIAL
--------------------------------------------------

StatusControl must render:

- A segmented control (NOT native radio inputs)
- Options:
    Empty | Low | Available | Full
- Single selection
- Sliding indicator (iOS-style)
- Text labels visible at all times
- No numeric context
- No unit selector
- No slider

Ensure:
- statusState drives selected segment.
- Clicking segment updates statusState.
- Component is mounted correctly when mode === "status".

--------------------------------------------------
3. MEASURED MODE – FULL RESTORE
--------------------------------------------------

MeasuredControl must render:

1. Current numeric value display
   Example:
   72 kg

2. Subtext:
   of 100 kg

3. Unit selector dropdown

4. Slider component

All must be inside STOCK_CONTROL_ZONE.

Do NOT hide slider accidentally.
Do NOT hide value display.
Do NOT conditionally remove based on status.

--------------------------------------------------
4. ATTRIBUTE ROW RESTORATION
--------------------------------------------------

Attribute icon row and input area must render OUTSIDE StockControlZone.

Ensure:

<StockControlZone />
<AttributeIconRow />
<AttributeGrid />

Do NOT wrap attributes inside measured branch.
Do NOT conditionally render attributes based on mode.

Attributes must render in BOTH modes.

--------------------------------------------------
5. CONDITIONAL RENDER FIX
--------------------------------------------------

Common mistake to fix:

Avoid:

{mode === "status" ? <StatusControl /> : <MeasuredControl />}

If that structure accidentally wraps extra UI.

Instead:

Keep shared layout static.
Swap only control content.

--------------------------------------------------
6. VERIFY THESE VISUALLY
--------------------------------------------------

After fix:

STATUS MODE:
- Shows segmented dial
- No numeric
- No slider
- Attributes visible

MEASURED MODE:
- Shows numeric value
- Shows "of X unit"
- Shows unit dropdown
- Shows slider
- Attributes visible

No blank zones.
No layout jump.
No disappearing UI.

--------------------------------------------------
7. REQUIRED OUTPUT
--------------------------------------------------

After implementation provide:

1. StockControlZone JSX structure.
2. StatusControl JSX.
3. MeasuredControl JSX.
4. Confirmation attribute row is independent of mode.
5. Confirmation no shared elements are conditionally unmounted.