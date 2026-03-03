# STICQR – STOCK CONTROL LAYOUT CORRECTION PASS

This pass fixes layout corruption and duplicate rendering.

Current Problems:
- Status text unreadable
- Segmented control low contrast
- Measured shows duplicate unit/capacity widgets
- Slider misplaced
- Attribute bar missing
- Hierarchy collapsed

Do NOT change business logic.
Do NOT change threshold mapping.
Do NOT change state structure.
Do NOT change Clear behavior.

--------------------------------------------------
1. RESTORE HIGH-LEVEL LAYOUT TREE
--------------------------------------------------

Ensure this exact structure:

<HeaderRow />
<Title />
<StockControlZone />
<AttributeIconBar />
<AttributeInputZone />
<ThemeSelectorRow />

Attributes must NOT be inside measured branch.
Attributes must NOT be conditionally rendered by mode.

--------------------------------------------------
2. STOCK_CONTROL_ZONE STRUCTURE
--------------------------------------------------

StockControlZone must have fixed min-height.
Do NOT conditionally render the container.

Inside it:

{mode === "status" && <StatusControl />}
{mode === "measured" && <MeasuredControl />}

--------------------------------------------------
3. STATUS CONTROL FIX
--------------------------------------------------

StatusControl must render ONLY:

<SegmentedControl>
  Empty | Low | Available | Full
</SegmentedControl>

Fix contrast:
- Active background: dark solid
- Active text: white
- Inactive text: dark gray
- Background track: light gray

Remove faint grey-on-grey.
Increase font-weight to 500+.

No numeric elements.
No slider.
No capacity display.

--------------------------------------------------
4. MEASURED CONTROL FIX
--------------------------------------------------

MeasuredControl must render EXACTLY:

1. LargeValueDisplay
2. Subtext ("of X unit")
3. UnitDropdown (ONLY ONE)
4. Slider (ONLY ONE)

Remove:
- Duplicate unit selector
- Duplicate capacity row
- Any second capacity widget

Capacity control must appear only once.
Slider must be directly under value.

--------------------------------------------------
5. DUPLICATE ELEMENT CLEANUP
--------------------------------------------------

Search and remove:

- Any second <UnitSelector />
- Any second <CapacityControl />
- Any conditionally hidden slider remnants
- Any empty wrapper divs creating spacing issues

--------------------------------------------------
6. ATTRIBUTE BAR RESTORATION
--------------------------------------------------

Ensure AttributeIconBar is OUTSIDE StockControlZone.
Ensure it renders regardless of mode.

Do not place inside measured branch.

--------------------------------------------------
7. SPACING RESTORATION
--------------------------------------------------

Add vertical spacing:

Title → 32px
StockControlZone padding → 24px
Zone → Attributes gap → 24px
Attributes → Theme row → 32px

Ensure no collapsed margins.

--------------------------------------------------
8. REQUIRED OUTPUT
--------------------------------------------------

After fix provide:

1. Final layout JSX tree.
2. StatusControl JSX.
3. MeasuredControl JSX.
4. Confirmation no duplicate widgets remain.
5. Confirmation attributes render in both modes.
6. Screenshot confirmation layout hierarchy restored.
