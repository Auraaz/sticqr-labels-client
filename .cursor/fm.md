# STICQR – FINAL MODE / STATUS / MEASURED STATE CONTRACT

This is a behavioral correction pass.

Problem:
measuredQuantity is being overwritten when switching modes,
even if user did not manually change status.

This must be fixed permanently.

DO NOT change layout.
DO NOT change threshold definitions.
DO NOT change UI styling.
DO NOT change Clear behavior.
DO NOT refactor component structure.
ONLY fix state mutation logic.

--------------------------------------------------
STATE RULES (AUTHORITATIVE)
--------------------------------------------------

There are only THREE valid events that may modify measuredQuantity:

1. Slider change (Measured mode)
2. Manual Status selection change
3. Clear reset

Mode switching must NEVER modify measuredQuantity.

--------------------------------------------------
1. REMOVE DESTRUCTIVE MODE EFFECTS
--------------------------------------------------

Search and remove:

- Any useEffect watching `mode` that updates measuredQuantity
- Any logic inside mode toggle that calls statusToQuantity
- Any derived logic that recalculates measuredQuantity automatically

Mode switch must NOT update measuredQuantity.

--------------------------------------------------
2. CORRECT MODE SWITCH HANDLER
--------------------------------------------------

Mode switch logic must be:

function handleModeSwitch(nextMode) {
  setMode(nextMode)

  if (nextMode === "status") {
    const derivedStatus = quantityToStatus(measuredQuantity, maxQuantity)
    setStatusState(derivedStatus)
  }

  // DO NOT modify measuredQuantity here
}

Switching to measured must NOT alter measuredQuantity.

--------------------------------------------------
3. STATUS CHANGE HANDLER (ONLY PLACE FOR MAPPING)
--------------------------------------------------

Measured value should update ONLY when user manually selects a new status.

function handleStatusChange(newStatus) {
  setStatusState(newStatus)

  const mappedValue = statusToQuantity(newStatus, maxQuantity)
  setMeasuredQuantity(mappedValue)
}

This must NOT run on mode switch.
This must run ONLY on explicit user click.

--------------------------------------------------
4. SLIDER CHANGE HANDLER
--------------------------------------------------

function handleSliderChange(newValue) {
  setMeasuredQuantity(newValue)
}

No additional logic here.

--------------------------------------------------
5. CLEAR HANDLER (UNCHANGED)
--------------------------------------------------

Clear must:

- setMode("status")
- setStatusState("empty")
- setMeasuredQuantity(0)
- reset attributes

--------------------------------------------------
6. VERIFY BEHAVIOR
--------------------------------------------------

Test scenario:

Start:
Measured = 39.29

Switch → Status
Status shows "Available"

Switch → Measured
Value remains 39.29

Now in Status:
User clicks "Low"

Switch → Measured
Value now reflects mapped Low threshold

Switch → Status again
Derived from current measured

No unintended resets.

--------------------------------------------------
7. PROHIBITED PATTERNS
--------------------------------------------------

Remove any code that:

- Syncs measuredQuantity from statusState automatically
- Syncs statusState from measuredQuantity automatically via effect
- Runs mapping inside useEffect without explicit user action
- Recalculates measuredQuantity when mode changes

--------------------------------------------------
8. REQUIRED OUTPUT
--------------------------------------------------

Provide:

1. handleModeSwitch implementation
2. handleStatusChange implementation
3. Confirmation no useEffect mutates measuredQuantity
4. Confirmation measuredQuantity changes only in 3 valid events