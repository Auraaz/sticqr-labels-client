# FIX STATUS → MEASURED MAPPING ON SERVER

Bug:
Changing status does not update measuredQuantity.

--------------------------------------------------
1. UPDATE SERVER UPDATE HANDLER
--------------------------------------------------

Inside container update endpoint:

If request includes statusState:

- Update container.statusState
- Compute new measuredQuantity using statusToQuantity()
- Persist both

--------------------------------------------------
2. DO NOT REQUIRE MODE CHECK
--------------------------------------------------

Mapping must happen regardless of current mode.

--------------------------------------------------
3. VERIFY
--------------------------------------------------

Test:

Status: Low
Measured becomes 10% of max

Status: Available
Measured becomes 50% of max

Status: Full
Measured becomes 100% of max