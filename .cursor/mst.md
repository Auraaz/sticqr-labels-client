# STICQR – SERVER-AUTHORITATIVE STOCK STATE

All stock state must be persisted on server.

Remove any client-only source of truth.

--------------------------------------------------
1. ENSURE CONTAINER MODEL STORES:
--------------------------------------------------

mode
statusState
measuredQuantity
maxQuantity

--------------------------------------------------
2. REMOVE CLIENT-DERIVED MODE DEFAULTS
--------------------------------------------------

Do NOT initialize mode in useState with hardcoded value.

Instead:

Fetch container from server.
Initialize UI from server response.

--------------------------------------------------
3. MODE SWITCH HANDLER
--------------------------------------------------

On mode switch:

Frontend:
call updateContainer({ mode: nextMode })

Server:
if nextMode === "status":
   derive statusState from measuredQuantity

Save and return updated container.

Do NOT modify measuredQuantity here.

--------------------------------------------------
4. STATUS CHANGE HANDLER
--------------------------------------------------

Frontend:
call updateContainer({ statusState: newStatus })

Server:
measuredQuantity = statusToQuantity(newStatus, maxQuantity)
save both statusState and measuredQuantity

Return updated container.

--------------------------------------------------
5. SLIDER CHANGE HANDLER
--------------------------------------------------

Frontend:
call updateContainer({ measuredQuantity: newValue })

Server:
update measuredQuantity only

Return updated container.

--------------------------------------------------
6. REMOVE CLIENT EFFECTS
--------------------------------------------------

Remove:
- Any useEffect syncing measuredQuantity
- Any mode-based recalculation
- Any derived state logic

Server must be single source of truth.

--------------------------------------------------
7. VERIFY
--------------------------------------------------

Refresh page:
Mode must remain correct.
Status must remain correct.
Measured must remain correct.

No localStorage.
No client-only fallback.