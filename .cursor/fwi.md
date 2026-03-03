# STICQR – FIX STATUS WHEEL INTERACTION

Issue:
Wheel renders but cannot change selection.

--------------------------------------------------
1. ENSURE SCROLL ENABLED
--------------------------------------------------

wheel-list must have:

overflow-y: scroll;
scroll-snap-type: y mandatory;

wheel-container must have:

overflow: hidden;

--------------------------------------------------
2. REMOVE POINTER BLOCKING
--------------------------------------------------

All overlay layers (top fade, bottom fade, center highlight)
must have:

pointer-events: none;

They must NOT block scrolling.

--------------------------------------------------
3. ADD PADDING FOR CENTER SNAP
--------------------------------------------------

wheel-list must include:

padding-top: (containerHeight / 2 - itemHeight / 2)
padding-bottom: same value

This allows first and last item to center.

--------------------------------------------------
4. ADD SCROLL SNAP ALIGN
--------------------------------------------------

wheel-item must have:

scroll-snap-align: center;

--------------------------------------------------
5. ADD SCROLL END HANDLER
--------------------------------------------------

On scroll end:

- Detect centered item
- Determine index
- Call handleStatusChange(statuses[index])

Debounce 150ms.

--------------------------------------------------
6. VERIFY
--------------------------------------------------

Wheel must:
- Scroll vertically
- Snap to center
- Update statusState
- Trigger server update
- Update measuredQuantity