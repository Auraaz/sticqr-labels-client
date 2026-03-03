# STICQR – FIX IOS WHEEL SCROLL FEEDBACK LOOP

Problem:
Wheel jitter / wrong selection due to scroll → state → scroll loop.

Cause:
handleWheelScroll fires even when scroll was triggered programmatically.

Solution:
Introduce scroll lock flag to ignore programmatic scroll.

--------------------------------------------------
1. ADD REF
--------------------------------------------------

Add at top:

const isProgrammaticScroll = useRef(false)

--------------------------------------------------
2. MODIFY handleWheelItemClick
--------------------------------------------------

Before calling scrollTo:

isProgrammaticScroll.current = true

After 200ms:

setTimeout(() => {
  isProgrammaticScroll.current = false
}, 200)

--------------------------------------------------
3. MODIFY useEffect INITIAL SCROLL
--------------------------------------------------

Before scrollTo:

isProgrammaticScroll.current = true

After scroll:

setTimeout(() => {
  isProgrammaticScroll.current = false
}, 0)

--------------------------------------------------
4. MODIFY handleWheelScroll
--------------------------------------------------

At start of handler:

if (isProgrammaticScroll.current) return

Then perform index calculation normally.

--------------------------------------------------
5. DO NOT MODIFY CSS
--------------------------------------------------

Keep scroll-snap.
Keep padding.
Keep ITEM_HEIGHT = 45.

--------------------------------------------------
6. VERIFY
--------------------------------------------------

Wheel must:

- Scroll smoothly
- Snap without jitter
- Update status once
- Not fight back
- Feel stable and mechanical