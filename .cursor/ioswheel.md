# STICQR – IMPLEMENT IOS-STYLE VERTICAL PICKER WHEEL FOR STATUS

Replace segmented control in Status mode with a vertical iOS-style picker wheel.

This is a UI implementation task.
Do NOT modify business logic.
Do NOT modify threshold logic.
Do NOT modify server mapping rules.
Only implement wheel UI and connect to handleStatusChange.

--------------------------------------------------
1. STATUS VALUES
--------------------------------------------------

Wheel items (in this exact order):

[
  "full",
  "available",
  "low",
  "empty"
]

--------------------------------------------------
2. STRUCTURE
--------------------------------------------------

StatusControl must render:

<div class="wheel-container">
  <div class="wheel-overlay-top" />
  <div class="wheel-list">
    <div class="wheel-item">Full</div>
    <div class="wheel-item">Available</div>
    <div class="wheel-item">Low</div>
    <div class="wheel-item">Empty</div>
  </div>
  <div class="wheel-overlay-bottom" />
</div>

--------------------------------------------------
3. VISUAL DESIGN
--------------------------------------------------

Wheel container:
- Fixed height (~180px)
- Overflow hidden
- position: relative

Wheel list:
- flex-direction: column
- scroll-snap-type: y mandatory
- overflow-y: scroll
- hide scrollbar

Wheel item:
- height: 45px
- display: flex
- align-items: center
- justify-content: center
- scroll-snap-align: center
- transition: transform 150ms ease

Active item:
- font-size larger
- font-weight 600+
- opacity 1
- scale 1.05

Inactive:
- opacity 0.4–0.6

--------------------------------------------------
4. CENTER SELECTION INDICATOR
--------------------------------------------------

Add a horizontal highlight bar centered in container:

position: absolute
top: 50%
transform: translateY(-50%)
height: 45px
border-top + border-bottom subtle lines

This mimics iOS picker highlight.

--------------------------------------------------
5. SNAP LOGIC
--------------------------------------------------

On scroll end:

- Detect nearest item to center
- Snap scroll position
- Determine selected status
- Call handleStatusChange(selectedStatus)

Debounce scroll events (150ms).

--------------------------------------------------
6. INITIAL POSITION
--------------------------------------------------

When entering Status mode:

- Scroll wheel to current statusState
- Center correct item

--------------------------------------------------
7. STATUS CHANGE BEHAVIOR
--------------------------------------------------

On snap complete:

Call:

handleStatusChange(newStatus)

This triggers server update.
Do NOT modify measuredQuantity in UI.

--------------------------------------------------
8. SAFETY
--------------------------------------------------

Wheel must:
- Not affect measured directly
- Not mutate state outside handler
- Not break layout height

--------------------------------------------------
9. VERIFY
--------------------------------------------------

Test:

Measured = 39kg
Switch → Status
Wheel centers on derived status

Scroll wheel to Low
Measured updates on server

Switch → Measured
Measured reflects Low threshold

--------------------------------------------------
10. REQUIRED OUTPUT
--------------------------------------------------

Provide:

1. StatusControl component code.
2. Scroll snap implementation.
3. Snap detection logic.
4. Confirmation mapping only triggered on snap.