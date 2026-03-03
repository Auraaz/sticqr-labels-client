# STICQR – FIX DESTRUCTIVE MODE SWITCH BUG

Bug:
Switching Status → Measured overwrites measuredQuantity
even when status was not manually changed.

This must be corrected.

--------------------------------------------------
1. REMOVE MODE-BASED REASSIGNMENT
--------------------------------------------------

Search for any logic that:

- Updates measuredQuantity when mode changes
- Calls statusToQuantity inside mode toggle
- Derives measuredQuantity inside useEffect watching mode

Remove it.

Switching mode must NOT mutate data.

--------------------------------------------------
2. DERIVE STATUS ONLY WHEN ENTERING STATUS MODE
--------------------------------------------------

When switching Measured → Status:

Compute derivedStatus from measuredQuantity.
Set statusState = derivedStatus.

Do NOT modify measuredQuantity.

--------------------------------------------------
3. ONLY MODIFY MEASURED ON MANUAL STATUS CHANGE
--------------------------------------------------

When user clicks a different status segment:

Then:

measuredQuantity = statusToQuantity(newStatus)

This must be inside status change handler ONLY.

Not inside mode switch.
Not inside effects.

--------------------------------------------------
4. VERIFY CORRECT BEHAVIOR
--------------------------------------------------

Test scenario:

Measured = 39.29 kg

Switch → Status
Status shows "Available"

Switch → Measured
Still 39.29 kg

Now in Status mode:
User clicks "Low"

Switch → Measured
Now quantity reflects low threshold value

--------------------------------------------------
5. REQUIRED OUTPUT
--------------------------------------------------

Provide:

1. Mode toggle handler.
2. Status change handler.
3. Confirmation no measuredQuantity updates happen on mode switch.