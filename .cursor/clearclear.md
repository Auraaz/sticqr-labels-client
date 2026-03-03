# STICQR – CLEAR BUTTON LOGIC CORRECTION

--------------------------------------------------
PROBLEM
--------------------------------------------------

Clear is currently dimmed when:

statusState === EMPTY
measuredQuantity === 0
no attributes

This is incorrect because:

• EMPTY is a valid stock state
• Clear is independent of stock level
• Clear should reset the container
• Stock selection must NOT control Clear availability

--------------------------------------------------
GOAL
--------------------------------------------------

Clear should be disabled ONLY when the container
is already fully reset on the server.

Clear must not depend on:
- statusState
- local measuredQuantity
- UI mode

It must depend ONLY on server container state.

--------------------------------------------------
STEP 1 — REMOVE OLD LOGIC
--------------------------------------------------

DELETE:

const isEditorDefault =
  statusState === STOCK_STATES.EMPTY &&
  measuredQuantity === 0 &&
  (container?.attributes?.length || 0) === 0

--------------------------------------------------
STEP 2 — REPLACE WITH SERVER-TRUTH LOGIC
--------------------------------------------------

ADD:

const isContainerReset =
  !container?.content_name &&
  container?.current_quantity === 0 &&
  (container?.attributes?.length || 0) === 0

--------------------------------------------------
STEP 3 — UPDATE CLEAR BUTTON
--------------------------------------------------

REPLACE:

disabled={isEditorDefault}

WITH:

disabled={isContainerReset}

AND

style={{
  opacity: isContainerReset ? 0.3 : undefined,
  cursor: isContainerReset ? "default" : "pointer"
}}

--------------------------------------------------
ALTERNATIVE (RECOMMENDED – CLEANER PRODUCT DESIGN)
--------------------------------------------------

Remove disabled state entirely.

DELETE:

disabled={...}
opacity logic

Let Clear always be clickable.

Reason:
• Reset is idempotent
• Appliance-style UX does not punish valid selections
• EMPTY is a real state, not “nothing”

--------------------------------------------------
FINAL RESULT
--------------------------------------------------

Clear now:

• Does not dim when status = EMPTY
• Does not depend on UI state
• Reflects only actual container data
• Behaves consistently
• Matches appliance-grade product logic

--------------------------------------------------
DONE
--------------------------------------------------