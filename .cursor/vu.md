# STICQR – FIX CENTER DOMINANCE (STRONG HIERARCHY)

Goal:
Center item must be visually dominant.
Other items must clearly fall away.

--------------------------------------------------
1. USE STRONGER FALL-OFF CURVE
--------------------------------------------------

Inside map():

const activeIndex = STATUS_ORDER.indexOf(statusState)
const distance = index - activeIndex
const absDistance = Math.min(Math.abs(distance), 3)

const scale = 1 - absDistance * 0.18
const opacity = 1 - absDistance * 0.45

const clampedScale = Math.max(0.6, scale)
const clampedOpacity = Math.max(0.15, opacity)

--------------------------------------------------
2. APPLY STYLE
--------------------------------------------------

style={{
  transform: `scale(${clampedScale})`,
  opacity: clampedOpacity,
  fontSize: distance === 0 ? "22px" : "16px",
  fontWeight: distance === 0 ? 600 : 400,
  letterSpacing: distance === 0 ? "-0.3px" : "0px",
  transition: "all 160ms cubic-bezier(.2,.8,.2,1)"
}}

--------------------------------------------------
3. REDUCE OVERLAY WASH
--------------------------------------------------

Change overlay gradient to be softer:

background: linear-gradient(
  to bottom,
  rgba(255,255,255,0.8),
  rgba(255,255,255,0.2),
  rgba(255,255,255,0)
)

Do NOT use opaque white.

--------------------------------------------------
4. CENTER LOCK LINES
--------------------------------------------------

Increase contrast slightly:

border-top: 1px solid rgba(0,0,0,0.25);
border-bottom: 1px solid rgba(0,0,0,0.25);

--------------------------------------------------
5. RESULT
--------------------------------------------------

Now the picker must:

- Clearly emphasize center
- Fade quickly outward
- Feel intentional
- Look premium