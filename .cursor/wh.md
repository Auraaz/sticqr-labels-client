# STICQR – FIX NON-INTERACTIVE IOS WHEEL

Issue:
Wheel renders but cannot change value.

--------------------------------------------------
1. ENSURE SCROLL ENABLED
--------------------------------------------------
wheel-list must have:
- overflow-y: scroll
- scroll-snap-type: y mandatory

--------------------------------------------------
2. REMOVE POINTER BLOCKING
--------------------------------------------------
All overlays must have:
- pointer-events: none

--------------------------------------------------
3. ADD PADDING
--------------------------------------------------
wheel-list must include:
- padding-top: 57px
- padding-bottom: 57px

--------------------------------------------------
4. ADD CLICK-TO-CENTER
--------------------------------------------------
Clicking item must call scrollTo with smooth behavior.

--------------------------------------------------
5. ADD SCROLL END DETECTION
--------------------------------------------------
On scroll stop:
- detect closest centered item
- update activeIndex
- call handleStatusChange()

--------------------------------------------------
6. VERIFY
--------------------------------------------------
Wheel must:
- Scroll by drag
- Scroll by click
- Snap to center
- Update status
- Update measured via server