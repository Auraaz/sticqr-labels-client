# STICQR – MEASURED LAYOUT REORDER + REMOVE REDUNDANT SUBTEXT

This is a measured-mode layout correction.

Do NOT change threshold logic.
Do NOT change state model.
Do NOT change stock mapping rules.

--------------------------------------------------
1. REMOVE SUBTEXT
--------------------------------------------------

Remove:

"of {maxQuantity} {unit}"

Measured mode must NOT display this line anymore.

--------------------------------------------------
2. REORDER COMPONENTS
--------------------------------------------------

MeasuredControl must render in this order:

1. LargeValueDisplay
2. CapacityControl (Capacity 100 kg dropdown)
3. Slider

CapacityControl must sit directly under LargeValueDisplay.

--------------------------------------------------
3. VERIFY FINAL STRUCTURE
--------------------------------------------------

Measured mode must visually appear as:

50.00 kg
Capacity   100   kg ▼
[ slider ]

No duplicate unit selector.
No "of 100 kg".
No extra capacity row.

--------------------------------------------------
4. REQUIRED OUTPUT
--------------------------------------------------

Provide updated MeasuredControl JSX.
Confirm subtext removed.
Confirm capacity appears directly under value.