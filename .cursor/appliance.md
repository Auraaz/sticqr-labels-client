# STICQR – FINAL 4-STATE VERTICAL SELECTOR

States (top → bottom):
Full
Available
Low
Empty

--------------------------------------------------
1. REMOVE WHEEL ENTIRELY
--------------------------------------------------

Delete:
- wheel-container
- wheel-list
- scroll logic
- padding math
- overlays

--------------------------------------------------
2. RENDER STACK
--------------------------------------------------

<div className="status-stack">
  {ORDER.map((state, index) => {
    const activeIndex = ORDER.indexOf(statusState)
    const distance = index - activeIndex
    const absDistance = Math.abs(distance)

    const scale = 1 - absDistance * 0.18
    const opacity = 1 - absDistance * 0.4

    return (
      <div
        key={state}
        onClick={() => handleStatusChange(state)}
        style={{
          transform: `scale(${Math.max(0.65, scale)})`,
          opacity: Math.max(0.2, opacity),
          fontSize: distance === 0 ? 28 : 18,
          fontWeight: distance === 0 ? 600 : 400,
          transition: "all 220ms cubic-bezier(.2,.8,.2,1)",
          cursor: "pointer"
        }}
      >
        {LabelForState(state)}
      </div>
    )
  })}
</div>

--------------------------------------------------
3. CSS CONTAINER
--------------------------------------------------

.status-stack {
  height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 18px;
}