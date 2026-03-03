# STICQR – FIX IOS PICKER INDEX CALCULATION (PADDING OFFSET BUG)

Problem:
Wheel scrolls visually but status does not change.
Index detection is incorrect because padding is not accounted for.

The wheel-list has:
- padding-top: 57px
- padding-bottom: 57px
- ITEM_HEIGHT: 45px

But scroll index math ignores padding.

This causes incorrect index calculation.

--------------------------------------------------
1. DO NOT CHANGE CSS
--------------------------------------------------

Keep:

padding-top: 57px;
padding-bottom: 57px;
ITEM_HEIGHT = 45

--------------------------------------------------
2. REPLACE handleWheelScroll
--------------------------------------------------

Replace entire handleWheelScroll function with:

--------------------------------------------------

const handleWheelScroll = () => {
  if (wheelScrollTimeoutRef.current) {
    clearTimeout(wheelScrollTimeoutRef.current)
  }

  wheelScrollTimeoutRef.current = setTimeout(() => {
    const list = wheelListRef.current
    if (!list) return

    const ITEM_HEIGHT = 45
    const PADDING = 57

    const scrollCenter =
      list.scrollTop + list.clientHeight / 2

    const rawIndex =
      (scrollCenter - PADDING - ITEM_HEIGHT / 2) / ITEM_HEIGHT

    const index = Math.max(
      0,
      Math.min(
        STATUS_ORDER.length - 1,
        Math.round(rawIndex)
      )
    )

    const selected = STATUS_ORDER[index]

    if (selected && selected !== statusState) {
      handleStatusChange(selected)
    }
  }, 120)
}

--------------------------------------------------
3. DO NOT MODIFY handleWheelItemClick
--------------------------------------------------

Click-to-center logic remains unchanged.

--------------------------------------------------
4. DO NOT MODIFY INITIAL SCROLL EFFECT
--------------------------------------------------

This remains valid:

list.scrollTo({
  top: index * ITEM_HEIGHT,
  behavior: "auto"
})

Padding already visually centers items.

--------------------------------------------------
5. VERIFY BEHAVIOR
--------------------------------------------------

Expected behavior:

- Drag wheel → snaps → status updates
- Click item → scrolls to center → updates
- Status change → server patch runs
- Measured updates from server
- No incorrect or frozen selection

--------------------------------------------------
6. DO NOT
--------------------------------------------------

- Do NOT remove padding
- Do NOT change ITEM_HEIGHT
- Do NOT remove scroll-snap
- Do NOT modify server mapping logic