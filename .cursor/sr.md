# STICQR – STOCK CONTROL STRUCTURAL CONTAINMENT FIX

Measured layout is structurally broken.
Capacity and attribute components are incorrectly inside StockControlZone.

This pass restores correct containment.

Do NOT change logic.
Do NOT change thresholds.
Do NOT change state model.
Do NOT change Clear behavior.

--------------------------------------------------
1. REBUILD PAGE TREE
--------------------------------------------------

Final layout must be:

<HeaderRow />
<Title />

<StockControlZone>
   {mode === "status" && <StatusControl />}
   {mode === "measured" && <MeasuredControl />}
</StockControlZone>

<CapacityControl />          // OUTSIDE zone
<AttributeIconBar />         // OUTSIDE zone
<AttributeInputZone />       // OUTSIDE zone

<ThemeSelectorRow />

--------------------------------------------------
2. REMOVE CAPACITY FROM STOCK ZONE
--------------------------------------------------

Search for CapacityControl.
Ensure it is NOT inside StockControlZone.

Capacity must render below StockControlZone.

--------------------------------------------------
3. REMOVE DUPLICATE UNIT SELECTOR
--------------------------------------------------

MeasuredControl must contain ONLY ONE unit selector.

If capacity has its own unit selector:
Keep capacity unit.
Remove the extra one under value display.

Final rule:
Unit selector appears ONCE per logical function.

--------------------------------------------------
4. STOCK_CONTROL_ZONE CONTENT RULES
--------------------------------------------------

MeasuredControl must contain ONLY:

- LargeValueDisplay
- Subtext ("of X unit")
- Slider

Nothing else.

No capacity widget.
No attribute widget.
No extra dropdown.

--------------------------------------------------
5. ATTRIBUTE POSITION FIX
--------------------------------------------------

AttributeInputZone must be rendered after CapacityControl.

Ensure it is not nested inside MeasuredControl.

--------------------------------------------------
6. FIX VERTICAL SPACING
--------------------------------------------------

Apply spacing:

Title → 32px
StockControlZone → 24px padding
StockZone → Capacity gap → 24px
Capacity → Attributes gap → 24px

Ensure no collapsed margins.

--------------------------------------------------
7. VERIFY FINAL STRUCTURE
--------------------------------------------------

After fix:

Measured mode must show:

50.00 kg
of 100.00 kg
[ slider ]

Then below that:

Capacity control (single instance)

Then below that:

Attribute bar

No duplication.
No stacking overlap.
No floating elements.

--------------------------------------------------
8. REQUIRED OUTPUT
--------------------------------------------------

Provide:

1. Final JSX tree.
2. MeasuredControl JSX.
3. Confirmation CapacityControl is outside zone.
4. Confirmation AttributeInputZone is outside zone.
5. Confirmation no duplicate unit selectors remain.