# STICQR – CONVERT STATUS WHEEL TO TRUE IOS PICKER MIMIC

Current wheel looks masked and foggy.
Convert it to real iOS-style picker.

Do NOT modify logic.
Do NOT modify server.
Visual & interaction refinement only.

--------------------------------------------------
1. WHEEL CONTAINER
--------------------------------------------------

.wheel-container:
- height: 160px
- position: relative
- overflow: hidden
- background: transparent

Remove any large white panel backgrounds.

--------------------------------------------------
2. WHEEL LIST
--------------------------------------------------

.wheel-list:
- overflow-y: scroll
- scroll-snap-type: y mandatory
- scrollbar hidden
- padding-top: 57px
- padding-bottom: 57px
- scroll-behavior: smooth

Item height must be exactly 45px.

--------------------------------------------------
3. WHEEL ITEM
--------------------------------------------------

.wheel-item:
- height: 45px
- display: flex
- align-items: center
- justify-content: center
- font-size: 17px
- font-weight: 400
- opacity: 0.4
- transition: transform 120ms ease, opacity 120ms ease

Active item:
- font-weight: 600
- font-size: 19px
- opacity: 1
- transform: scale(1.05)

Adjacent items:
- opacity: 0.65

--------------------------------------------------
4. REMOVE FILLED CENTER RECTANGLE
--------------------------------------------------

Do NOT use white background for center area.

Instead add thin selection lines:

.center-highlight:
- position: absolute
- top: 50%
- left: 0
- right: 0
- height: 45px
- transform: translateY(-50%)
- border-top: 1px solid rgba(0,0,0,0.15)
- border-bottom: 1px solid rgba(0,0,0,0.15)
- pointer-events: none

--------------------------------------------------
5. SOFT GRADIENT FADES
--------------------------------------------------

Add subtle fades:

.wheel-overlay-top:
- position: absolute
- top: 0
- height: 40px
- background: linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0))

.wheel-overlay-bottom:
- position: absolute
- bottom: 0
- height: 40px
- background: linear-gradient(to top, rgba(255,255,255,0.85), rgba(255,255,255,0))

Both must:
- pointer-events: none

Fade must be subtle, not heavy white mask.

--------------------------------------------------
6. CLICK-TO-CENTER
--------------------------------------------------

On wheel-item click:
- scroll to center smoothly
- snap
- detect centered index
- call handleStatusChange()

--------------------------------------------------
7. INITIAL POSITION
--------------------------------------------------

On mount or entering Status mode:
- Scroll to current statusState index without animation.

--------------------------------------------------
8. FINAL RESULT CHECK
--------------------------------------------------

Wheel must feel:

- Lightweight
- Mechanical
- Snappy
- Crisp
- No heavy background
- No fog

Selected item must look locked into place.

--------------------------------------------------
9. DO NOT
--------------------------------------------------

- Do not add blur
- Do not add big rounded panel
- Do not reduce contrast excessively
- Do not block pointer events