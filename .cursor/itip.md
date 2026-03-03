# STICQR – IMPLEMENT TRUE IOS PICKER CLICK-TO-CENTER BEHAVIOR

Goal:
Wheel must behave like native iOS picker.

Clicking any item must:
- Animate it to center
- Snap it to selection
- Highlight it
- Trigger handleStatusChange()

Do NOT modify business logic.
Do NOT modify server logic.
This is UI behavior only.

--------------------------------------------------
1. WHEEL STRUCTURE
--------------------------------------------------

Each wheel-item must:

- Have ref or data-index
- Fixed height (e.g. 45px)
- scroll-snap-align: center

wheel-list must:

- overflow-y: scroll
- scroll-behavior: smooth
- scroll-snap-type: y mandatory

--------------------------------------------------
2. CLICK-TO-CENTER LOGIC
--------------------------------------------------

On click of wheel item:

function handleItemClick(index) {
  const container = wheelRef.current
  const itemHeight = 45
  const containerHeight = container.clientHeight

  const targetScroll =
    index * itemHeight
    - (containerHeight / 2)
    + (itemHeight / 2)

  container.scrollTo({
    top: targetScroll,
    behavior: "smooth"
  })
}

Do NOT call handleStatusChange here yet.

--------------------------------------------------
3. SNAP DETECTION
--------------------------------------------------

Add scroll listener with debounce (150ms).

On scroll end:

- Determine closest centered index
- Set activeIndex state
- Call handleStatusChange(statuses[activeIndex])

--------------------------------------------------
4. VISUAL ACTIVE STATE
--------------------------------------------------

wheel-item must conditionally apply:

if index === activeIndex:

- font-weight: 600+
- font-size slightly larger
- opacity: 1
- transform: scale(1.05)

Else:

- opacity: 0.4

--------------------------------------------------
5. CENTER HIGHLIGHT BAR
--------------------------------------------------

Add absolute div centered:

position: absolute
top: 50%
transform: translateY(-50%)
height: 45px
border-top and border-bottom lines

pointer-events: none

--------------------------------------------------
6. INITIALIZATION
--------------------------------------------------

On mount:

Scroll to index of current statusState.

Use scrollTo without smooth behavior.

--------------------------------------------------
7. VERIFY
--------------------------------------------------

Click "Full":
It animates to center.
Becomes bold.
Measured updates (via handleStatusChange).

Scroll manually:
Snaps.
Updates.

Must feel native.