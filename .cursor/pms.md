# STICQR – PERSIST MODE STATE ON SERVER

Issue:
Mode resets to measured on refresh.

Mode must be persisted per container on server.

--------------------------------------------------
1. UPDATE CONTAINER MODEL
--------------------------------------------------

Ensure container schema includes:

mode: "status" | "measured"

Default value for new containers: "status"

--------------------------------------------------
2. UPDATE CONTAINER FETCH
--------------------------------------------------

On page load:

Fetch container from server.
Initialize UI from container.mode.

Remove any hardcoded default mode in frontend.

--------------------------------------------------
3. UPDATE MODE SWITCH HANDLER
--------------------------------------------------

On mode toggle:

Call updateContainer({ mode: nextMode })

Do NOT rely on local state only.
Wait for server response.
Update UI from returned container.

--------------------------------------------------
4. REMOVE CLIENT DEFAULT MODE
--------------------------------------------------

Replace:

const [mode, setMode] = useState("measured")

With:

const [mode, setMode] = useState(null)

After fetch:
setMode(container.mode)

--------------------------------------------------
5. VERIFY
--------------------------------------------------

Scenario:

Switch to Status.
Refresh page.
Still Status.

Switch to Measured.
Refresh page.
Still Measured.

Each container remembers its own mode.