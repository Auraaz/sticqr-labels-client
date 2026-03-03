# STICQR – REPLACE IOS WHEEL WITH APPLIANCE-STYLE VERTICAL SELECTOR

Goal:
Remove scroll wheel entirely.
Replace with vertical mechanical selector.

States (top to bottom):
Full
Available
Low
Empty

--------------------------------------------------
1. REMOVE
--------------------------------------------------

Delete:
- wheel-container
- wheel-list
- handleWheelScroll
- handleWheelItemClick
- wheel refs
- wheel CSS
- scroll logic

--------------------------------------------------
2. RENDER STATIC STACK
--------------------------------------------------

Replace status view with:

<div className="status-stack">
  {STATUS_ORDER.map((state, index) => {
    const isActive = state === statusState

    return (
      <div
        key={state}
        className={`status-item ${isActive ? "active" : ""}`}
        onClick={() => handleStatusChange(state)}
      >
        {LabelForState(state)}
      </div>
    )
  })}
</div>

--------------------------------------------------
3. CSS – APPLIANCE STYLE
--------------------------------------------------

.status-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 220px;
}

.status-item {
  font-size: 18px;
  opacity: 0.5;
  transform: scale(0.85);
  transition: all 220ms cubic-bezier(.2,.8,.2,1);
  cursor: pointer;
}

.status-item.active {
  font-size: 26px;
  font-weight: 600;
  opacity: 1;
  transform: scale(1.15);
}

--------------------------------------------------
4. ADD GRADUAL DISTANCE EFFECT
--------------------------------------------------

Inside map():

const activeIndex = STATUS_ORDER.indexOf(statusState)
const distance = index - activeIndex
const absDistance = Math.abs(distance)

Apply dynamic style:

style={{
  transform: `scale(${1 - absDistance * 0.15})`,
  opacity: 1 - absDistance * 0.35,
  fontWeight: distance === 0 ? 600 : 400,
  fontSize: distance === 0 ? 26 : 18,
  transition: "all 220ms cubic-bezier(.2,.8,.2,1)"
}}

--------------------------------------------------
5. REMOVE OVERLAY LINES
--------------------------------------------------

No gradient.
No center bars.
Keep it clean.

--------------------------------------------------
6. RESULT
--------------------------------------------------

Behavior:

- Click "Low"
- It enlarges
- Others compress
- Smooth reposition
- No scrolling
- No jitter
- No physics

Feels mechanical.
Feels intentional.
Feels appliance-grade.