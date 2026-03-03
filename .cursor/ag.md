# STICQR – ATTRIBUTE GRID STRUCTURE CORRECTION

Issue:
Attribute 2x2 grid container (white rounded bar) renders,
but attribute cards (e.g. "web") are not inside it.

Cards appear floating or partially hidden.

This is a JSX nesting correction.

Do NOT change styling.
Do NOT change logic.
Do NOT change state.
Do NOT change stock control.

--------------------------------------------------
1. LOCATE ATTRIBUTE GRID CONTAINER
--------------------------------------------------

Find component rendering white rounded 2x2 layout.
Likely named:

AttributeGrid
AttributeLayout
AttributeContainer

--------------------------------------------------
2. ENSURE PROPER NESTING
--------------------------------------------------

All attribute cards must render INSIDE the grid container.

Correct structure:

<AttributeSection>
   <AttributeGrid>
      {attributes.map(attr => (
         <AttributeCard key={attr.id} />
      ))}
   </AttributeGrid>
</AttributeSection>

There must be NO attribute cards rendered outside grid.

--------------------------------------------------
3. REMOVE ABSOLUTE POSITIONING
--------------------------------------------------

Ensure AttributeCard is NOT:

position: absolute;

Grid must use:

display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 12px;

Cards must flow naturally.

--------------------------------------------------
4. REMOVE FLOATING SINGLE CARD LOGIC
--------------------------------------------------

If there is conditional rendering like:

{selectedAttribute && <AttributeCard />}

outside grid, remove it.

All attribute cards must come from the same map.

--------------------------------------------------
5. VERIFY VISUALLY
--------------------------------------------------

After fix:

- White rounded grid container visible
- Attribute cards inside grid
- No overlapping
- No floating chip
- No clipping
- Proper 2×2 alignment

--------------------------------------------------
6. REQUIRED OUTPUT
--------------------------------------------------

Provide:

1. Final JSX for AttributeSection.
2. Confirmation no AttributeCard renders outside grid.
3. Confirmation no absolute positioning used.