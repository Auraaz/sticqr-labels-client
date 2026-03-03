import { useEffect, useState, useRef, useMemo } from "react"
import { Routes, Route, useParams } from "react-router-dom"
import axios from "axios"
import {
  Globe,
  Phone,
  Mail,
  Calendar,
  Hash,
  Type
} from "lucide-react"
import { getStatusFromRatio, getRatioForStatus, getStatusIndex, STOCK_STATES } from "./stockThresholds"
import "./App.css"
import "./styles/sticker-core.css"
import "./styles/sticker-themes.css"
import "./styles/sticker-components.css"

function useIsHandheld() {
  const [isHandheld, setIsHandheld] = useState(true)

  useEffect(() => {
    const uaCheck = /Mobi|Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    )

    const widthCheck = window.matchMedia("(max-width: 900px)").matches

    setIsHandheld(uaCheck && widthCheck)
  }, [])

  return isHandheld
}

function HandheldOnlyScreen() {
  return (
    <div className="handheld-block">
      <div className="handheld-card">
        <h1>SticQR</h1>
        <p>
          SticQR is designed for handheld devices.
        </p>
        <p>
          Please open this link on your phone.
        </p>
      </div>
    </div>
  )
}

function ContainerPage() {
  const { id } = useParams()
  const [container, setContainer] = useState(null)

  const [skin, setSkin] = useState("light")
  const [loadError, setLoadError] = useState(null)

  // Hybrid stock editor state (status + measured)
  const [mode, setMode] = useState(null) // "status" | "measured"
  const [statusState, setStatusState] = useState(STOCK_STATES.EMPTY) // "empty" | "low" | "available" | "full"
  const [measuredQuantity, setMeasuredQuantity] = useState(0) // always numeric, 0 allowed
  const [maxQuantity, setMaxQuantity] = useState(0)

  const [showClearModal, setShowClearModal] = useState(false)
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null)
  const [typeSelectorIndex, setTypeSelectorIndex] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [actionTarget, setActionTarget] = useState(null)
  const [dragIndex, setDragIndex] = useState(null)

  // attributes live on the container object; no separate customAttributes state
  const [creatingAttribute, setCreatingAttribute] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [tempValue, setTempValue] = useState("")
  const [tempLabel, setTempLabel] = useState("")
  const [openAttributeIndex, setOpenAttributeIndex] = useState(null)
  const [isSavingAttribute, setIsSavingAttribute] = useState(false)

  const [editingMax, setEditingMax] = useState(false)
  const [maxInputValue, setMaxInputValue] = useState("")

  // Fetch container
  useEffect(() => {
    if (!id) {
      setLoadError("Invalid label URL.")
      return
    }

    let cancelled = false

    ;(async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/container/${id}`)
        if (cancelled) return

        setContainer(res.data)
        setSkin(res.data.skin || "light")
        initializeEditorStateFromContainer(res.data)
        setMode(res.data.mode || "status")
        setLoadError(null)
      } catch (err) {
        if (cancelled) return
        setLoadError("Container not found or unavailable right now.")
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        handleCancel()
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  useEffect(() => {
    const handleClickOutside = () => {
      setEditingIndex(null)
    }

    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  // Apply server-driven theme to <html data-theme="...">
  useEffect(() => {
    if (!container) return
    const theme = container.theme || container.skin || "tomato"
    document.documentElement.dataset.theme = theme
  }, [container])

  // Legacy name/max/unit save helpers removed in hybrid refactor

  const initializeEditorStateFromContainer = (data) => {
    if (!data) {
      setMode("status")
      setStatusState(STOCK_STATES.EMPTY)
      setMeasuredQuantity(0)
      setMaxQuantity(0)
      return
    }

    const safeMax =
      typeof data.max_capacity === "number" && !Number.isNaN(data.max_capacity)
        ? data.max_capacity
        : 0
    const safeCurrent =
      typeof data.current_quantity === "number" && !Number.isNaN(data.current_quantity)
        ? data.current_quantity
        : 0

    setMaxQuantity(safeMax)
    setMeasuredQuantity(safeCurrent)

    if (safeMax > 0) {
      const ratio = safeCurrent / safeMax
      setStatusState(getStatusFromRatio(ratio))
      setMode("measured")
    } else {
      setStatusState(STOCK_STATES.EMPTY)
      setMode("status")
    }
  }

  const handleModeChange = (nextMode) => {
    if (nextMode === mode) return
    if (nextMode !== "status" && nextMode !== "measured") return

    if (mode === "measured" && nextMode === "status") {
      const ratio = measuredQuantity / maxQuantity
      setStatusState(getStatusFromRatio(ratio))
      nextMode = "status"
    }

    if (!container) {
      setMode(nextMode)
      return
    }

    setMode(nextMode)

    axios.patch(`http://localhost:4000/api/container/${id}`, {
      mode: nextMode
    }).then((res) => {
      setContainer(res.data)
      if (typeof res.data.mode === "string") {
        setMode(res.data.mode)
      }
    }).catch(() => {
      // on failure, keep local mode; no further action
    })
  }

  // Slider change
  const handleSlider = async (value) => {
    if (!container || !container.max_capacity) return

    let numericValue = Math.min(value, container.max_capacity)

    if (!isContinuous) {
      numericValue = Math.round(numericValue)
    }

    try {
      const res = await axios.patch(
        `http://localhost:4000/api/container/${id}`,
        { current_quantity: numericValue }
      )

      setContainer(res.data)
      setMeasuredQuantity(res.data.current_quantity)
    } catch {
      alert("Couldn't update quantity. Please try again.")
    }
  }
  const handleAttributeAction = (attr) => {
    if (["url", "phone", "email"].includes(attr.type)) {
      setActionTarget(attr)
    }
  }

  const startCreating = (type) => {
    setSelectedType(type)
    if (type === "url") {
      setTempValue("https://")
    } else {
      setTempValue("")
    }
    setTempLabel("")
    setCreatingAttribute(true)
  }

  const handleCancel = () => {
    setCreatingAttribute(false)
    setSelectedType(null)
    setTempValue("")
    setTempLabel("")
  }
  const handleAddAttribute = async (newAttr) => {
    if (!container) return
    if ((container.attributes?.length || 0) >= 4) return

    const updated = [...(container.attributes || []), newAttr]

    try {
      const res = await axios.patch(
        `http://localhost:4000/api/container/${container.id}`,
        { attributes: updated }
      )

      setContainer(res.data)
    } catch {
      alert("Couldn't add this field. Please try again.")
    }
  }

  const handleDelete = async (index) => {
    if (!container) return

    const updated = (container.attributes || []).filter((_, i) => i !== index)

    try {
      const res = await axios.patch(
        `http://localhost:4000/api/container/${container.id}`,
        { attributes: updated }
      )

      setContainer(res.data)
    } catch {
      alert("Couldn't remove this field. Please try again.")
    }
  }

  const handleAction = (attr) => {
    if (attr.type === "url") window.open(attr.value, "_blank")
    if (attr.type === "phone") window.location.href = `tel:${attr.value}`
    if (attr.type === "email") window.location.href = `mailto:${attr.value}`
  }

  const getTitleForType = (type) => {
    switch (type) {
      case "date": return "Select date"
      case "phone": return "Enter phone"
      case "url": return "Enter link"
      case "email": return "Enter email"
      case "number": return "Enter number"
      case "text": return "Enter text"
      default: return ""
    }
  }

  const renderTypeSpecificInput = () => {
    switch (selectedType) {
      case "date":
        return (
          <input
            type="date"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="sheet-input"
          />
        )
      case "phone":
        return (
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="sheet-input"
            placeholder="+91 98765 43210"
          />
        )
      case "url":
        return (
          <input
            type="url"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="sheet-input"
            placeholder="https://"
            onFocus={() => {
              if (!tempValue) setTempValue("https://")
            }}
          />
        )
      case "email":
        return (
          <input
            type="email"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="sheet-input"
            placeholder="name@domain.com"
          />
        )
      case "number":
        return (
          <input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="sheet-input"
          />
        )
      default:
        return (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="sheet-input"
          />
        )
    }
  }

  const handleOverlayClick = () => {
    if (tempValue || tempLabel) {
      setShowDiscardConfirm(true)
    } else {
      setShowCreateModal(false)
    }
  }

  const continuousUnits = ["kg", "g", "L", "ml"]
  const discreteUnits = ["pcs", "pieces", "units", "bottles", "packets"]
  const attributeTypes = ["text", "number", "date", "phone", "url", "email"]

  const isContinuous = continuousUnits.includes(container?.unit || "")
  const isDiscrete = discreteUnits.includes(container?.unit || "")

  const themes = [
    { name: "tomato", ink: "#C92A2A" },
    { name: "graphite", ink: "#2B2E34" },
    { name: "beige", ink: "#8C5E3C" },
    { name: "glass", ink: "#1C7ED6" }
  ]

  const typeIcons = {
    url: <Globe className="icon" size={18} strokeWidth={1.5} />,
    phone: <Phone className="icon" size={18} strokeWidth={1.5} />,
    email: <Mail className="icon" size={18} strokeWidth={1.5} />,
    date: <Calendar className="icon" size={18} strokeWidth={1.5} />,
    number: <Hash className="icon" size={18} strokeWidth={1.5} />,
    text: <Type className="icon" size={18} strokeWidth={1.5} />
  }

  const MAX_CUSTOM = 4
  const MAX_ATTRIBUTES = MAX_CUSTOM

  const isFull = (container?.attributes || []).length >= MAX_ATTRIBUTES

  const validators = {
    text: (v) => v.trim().length > 0,
    number: (v) => !isNaN(v),
    date: (v) => !isNaN(Date.parse(v)),
    phone: (v) => {
      const digits = v.replace(/\D/g, "")
      return digits.length >= 7 && digits.length <= 15
    },
    url: (v) => {
      try {
        if (!v.startsWith("https://")) return false
        new URL(v)
        return true
      } catch {
        return false
      }
    },
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  const formatDefaultLabel = (value, type) => {
    switch (type) {
      case "url":
        try {
          const url = new URL(value)
          return url.hostname
        } catch {
          return value
        }
      case "date":
        try {
          const date = new Date(value)
          return date.toLocaleDateString()
        } catch {
          return value
        }
      default:
        return value
    }
  }

  function formatDateParts(value) {
    if (!value) return null

    const date = new Date(value)
    if (isNaN(date)) return null

    return {
      day: date.getDate(),
      month: date.toLocaleString("default", { month: "long" }),
      year: date.getFullYear()
    }
  }

  const formatValue = (value) => {
    if (!value && value !== 0) return 0
    return isContinuous
      ? Number(value).toFixed(2)
      : Math.round(value)
  }

  const STATUS_ORDER = [
    STOCK_STATES.FULL,
    STOCK_STATES.AVAILABLE,
    STOCK_STATES.LOW,
    STOCK_STATES.EMPTY
  ]

  const activeStatusIndex = STATUS_ORDER.indexOf(statusState)

  const handleStatusChange = async (newStatus) => {
    if (!container) return
    if (newStatus === statusState) return

    setStatusState(newStatus)

    try {
      const res = await axios.patch(
        `http://localhost:4000/api/container/${id}`,
        { statusState: newStatus }
      )
      setContainer(res.data)
      if (typeof res.data.current_quantity === "number") {
        setMeasuredQuantity(res.data.current_quantity)
      }
      if (typeof res.data.max_capacity === "number") {
        setMaxQuantity(res.data.max_capacity)
      }
    } catch {
      alert("Couldn't update status. Please try again.")
    }
  }

  const isRawValueValid = selectedType
    ? (validators[selectedType] || (() => true))(tempValue)
    : false

  const isLabelValid = tempLabel.trim().length > 0
  const canSaveAttribute = isRawValueValid && isLabelValid && !isSavingAttribute

  const finalPreviewLabel = useMemo(() => {
    const trimmed = tempLabel.trim()
    if (trimmed) return trimmed
    if (!isRawValueValid || !selectedType) return ""
    return formatDefaultLabel(tempValue, selectedType)
  }, [tempLabel, tempValue, selectedType, isRawValueValid])

  function AttributeCard({ attr, index, isOpen, setOpenIndex, onDelete }) {
    const [translateX, setTranslateX] = useState(0)
    const startX = useRef(0)
    const dragging = useRef(false)

    const isLeftColumn = index % 2 === 0
    const isRightColumn = !isLeftColumn

    const handleTouchStart = (e) => {
      startX.current = e.touches[0].clientX
      dragging.current = true
    }

    const handleTouchMove = (e) => {
      if (!dragging.current) return
      const delta = e.touches[0].clientX - startX.current
      // LEFT COLUMN → allow negative drag only
      if (isLeftColumn && delta < 0) {
        setTranslateX(Math.max(delta, -60))
      }

      // RIGHT COLUMN → allow positive drag only
      if (isRightColumn && delta > 0) {
        setTranslateX(Math.min(delta, 60))
      }
    }

    const handleTouchEnd = () => {
      dragging.current = false

      if (isLeftColumn && translateX < -40) {
        setOpenIndex(index)
        setTranslateX(-60)
      } else if (isRightColumn && translateX > 40) {
        setOpenIndex(index)
        setTranslateX(60)
      } else {
        setTranslateX(0)
        setOpenIndex(null)
      }
    }

    useEffect(() => {
      if (!isOpen) {
        setTranslateX(0)
      }
    }, [isOpen])

    const handleCardClick = (e) => {
      e.stopPropagation()
    }

    return (
      <div
        className="attribute-item"
        onClick={handleCardClick}
      >
        <div
          className="attribute-remove-layer"
          style={{
            justifyContent: isLeftColumn ? "flex-end" : "flex-start",
            paddingRight: isLeftColumn ? 16 : undefined,
            paddingLeft: isRightColumn ? 16 : undefined
          }}
        >
          <button
            type="button"
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(index)
            }}
          >
            Remove
          </button>
        </div>

        <div
          className="attribute-tile"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: dragging.current ? "none" : undefined
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="attr-label">{attr.label}</div>

          {["url", "phone", "email"].includes(attr.type) ? (
            <button
              className="attr-action"
              onClick={() => handleAction(attr)}
            >
              {typeIcons[attr.type]}
            </button>
          ) : attr.type === "date" ? (
            (() => {
              const parts = formatDateParts(attr.value)
              if (!parts) return <div className="attr-value">{attr.value}</div>

              return (
                <div className="date-tile">
                  <div className="date-day">
                    {parts.day}
                  </div>
                  <div className="date-meta">
                    <div className="date-month">{parts.month}</div>
                    <div className="date-year">{parts.year}</div>
                  </div>
                </div>
              )
            })()
          ) : (
            <div className="attr-value">{attr.value}</div>
          )}
        </div>
      </div>
    )
  }

  if (!container && !loadError) {
    return <div style={{ padding: 20 }}>Loading...</div>
  }

  if (!container && loadError) {
    return (
      <div style={{ padding: 20 }}>
        {loadError}
      </div>
    )
  }

  return (
    <div className="app">
      <div className="page">
        <div className="container-wrapper">
          <div
            className="container-card"
            onClick={() => setOpenAttributeIndex(null)}
          >
        {/* Clear + Mode toggle */}
        <div
          className="top-controls"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <button
            className="clear-btn clear-button"
            onClick={async (e) => {
              e.stopPropagation()
              const res = await axios.patch(
                `http://localhost:4000/api/container/${id}`,
                {
                  content_name: null,
                  current_quantity: 0,
                  attributes: []
                }
              )

              setContainer(res.data)
              setMode("status")
              setStatusState(STOCK_STATES.EMPTY)
              setMeasuredQuantity(0)
              setOpenAttributeIndex(null)
              setEditingMax(false)
              setMaxInputValue("")
              setShowClearModal(false)
              setCreatingAttribute(false)
              setSelectedType(null)
              setTempValue("")
              setTempLabel("")
              setIsSavingAttribute(false)
            }}
          >
            ↺ Clear
          </button>

        <div
          style={{
            display: "inline-flex",
            borderRadius: 999,
            padding: 2,
            gap: 4
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleModeChange("status")
            }}
            style={{
              borderRadius: 999,
              padding: "4px 10px",
              fontSize: 12,
              cursor: "pointer",
                border: "2px solid var(--ink)",
                background: mode === "status" ? "var(--ink)" : "transparent",
                color: mode === "status" ? "var(--paper)" : "var(--ink)",
              opacity: mode === "status" ? 1 : 0.7
            }}
          >
              Status
            </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleModeChange("measured")
            }}
            style={{
              borderRadius: 999,
              padding: "4px 10px",
              fontSize: 12,
              cursor: "pointer",
                border: "2px solid var(--ink)",
                background: mode === "measured" ? "var(--ink)" : "transparent",
                color: mode === "measured" ? "var(--vinyl)" : "var(--ink)",
              opacity: mode === "measured" ? 1 : 0.7
            }}
          >
              Measured
            </button>
          </div>
        </div>

        {/* Contents title */}
        <div>
          <input
            className="name-input container-title"
            value={container.content_name || ""}
            placeholder="Contents?"
            onClick={(e) => e.stopPropagation()}
            onChange={async (e) => {
              const value = e.target.value
              setContainer({ ...container, content_name: value })
              await axios.patch(
                `http://localhost:4000/api/container/${id}`,
                { content_name: value }
              )
            }}
          />
        </div>

        {/* STOCK CONTROL ZONE (stable stage) */}
        <div className="stock-stage">
          <div
            className={`stock-status ${mode === "status" ? "" : "hidden"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="status-stack">
              {STATUS_ORDER.map((state, index) => {
                const activeIndex = STATUS_ORDER.indexOf(statusState)
                const distance = index - activeIndex
                const absDistance = Math.min(Math.abs(distance), 3)

                const scale = 1 - absDistance * 0.18
                const opacity = 1 - absDistance * 0.4

                const clampedScale = Math.max(0.65, scale)
                const clampedOpacity = Math.max(0.2, opacity)

                return (
                  <div
                    key={state}
                    className="status-item"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStatusChange(state)
                    }}
                    style={{
                      transform: "none",
                      opacity: clampedOpacity,
                      fontSize: distance === 0 ? 42 : 18,
                      fontWeight: distance === 0 ? 700 : 400,
                      transition: "all 220ms cubic-bezier(.2,.8,.2,1)",
                      cursor: "pointer"
                    }}
                  >
                    {state === STOCK_STATES.FULL && "Full"}
                    {state === STOCK_STATES.AVAILABLE && "Available"}
                    {state === STOCK_STATES.LOW && "Low"}
                    {state === STOCK_STATES.EMPTY && "Empty"}
                  </div>
                )
              })}
            </div>
          </div>

          <div
            className={`stock-measured ${mode === "measured" ? "" : "hidden"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const maxCapacity = Number(container?.max_capacity) || 0
              const quantity = Number(measuredQuantity) || 0
              const progress =
                maxCapacity > 0
                  ? Math.min((quantity / maxCapacity) * 100, 100)
                  : 0

              return (
                <>
            <h2 className="quantity quantity-value">
              {formatValue(measuredQuantity)} {container.unit}
            </h2>

            <div
              className="capacity-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  whiteSpace: "nowrap"
                }}
              >
                Capacity
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <input
                  className="max-input"
                  type="number"
                  value={editingMax ? maxInputValue : container.max_capacity || 0}
                  step={isContinuous ? "0.01" : "1"}
                  inputMode={isContinuous ? "decimal" : "numeric"}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={() => {
                    setEditingMax(true)
                    setMaxInputValue(container.max_capacity || "")
                  }}
                  onChange={(e) => {
                    let value = e.target.value
                    if (isDiscrete) value = value.replace(".", "")
                    setMaxInputValue(value)
                  }}
                  onBlur={async () => {
                    setEditingMax(false)
                    let numeric = parseFloat(maxInputValue)
                    if (isNaN(numeric) || numeric < 0) numeric = 0
                    if (isDiscrete) numeric = Math.round(numeric)
                    const res = await axios.patch(
                      `http://localhost:4000/api/container/${id}`,
                      { max_capacity: numeric }
                    )
                    setContainer(res.data)
                  }}
                  style={{
                    width: `${Math.max(
                      48,
                      String(
                        editingMax ? maxInputValue || "" : container.max_capacity || ""
                      ).length * 10
                    )}px`,
                    fontSize: 16,
                    borderRadius: 14,
                    border: "2px solid var(--ink)",
                    outline: "none",
                    textAlign: "center",
                    background: "var(--vinyl)",
                    padding: "6px 8px",
                    color: "var(--ink)"
                  }}
                />

                <select
                  className="unit-select"
                  value={container.unit || ""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={async (e) => {
                    const newUnit = e.target.value
                    const res = await axios.patch(
                      `http://localhost:4000/api/container/${id}`,
                      { unit: newUnit }
                    )
                    setContainer(res.data)
                  }}
                >
                  <option value="">Select</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="L">L</option>
                  <option value="ml">ml</option>
                  <option value="pcs">pcs</option>
                </select>
              </div>
            </div>

            <input
              className="slider"
              type="range"
              min="0"
              max={maxCapacity}
              step={isContinuous ? 0.01 : 1}
              value={quantity}
              disabled={!maxCapacity || !container.unit}
              onChange={(e) => handleSlider(Number(e.target.value))}
              style={{
                "--progress": `${progress}%`
              }}
            />
                </>
              )
            })()}
          </div>
        </div>

        {/* Attributes section: selector, grid, and creation panel */}
        <div className="attributes-section" onClick={(e) => e.stopPropagation()}>
          <div className="attribute-grid">
            <div className="type-selector-row">
              {Object.entries(typeIcons).map(([type, icon]) => (
                <button
                  key={type}
                  className="type-small-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    startCreating(type)
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>

            {creatingAttribute && (
              <div className="attribute-create-panel">
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <input
                    type="text"
                    value={tempLabel}
                    onChange={(e) => setTempLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !canSaveAttribute) {
                        e.preventDefault()
                      }
                    }}
                    placeholder="Display name"
                    className={(!isLabelValid ? "invalid" : "")}
                  />
                  {finalPreviewLabel && (
                    <div style={{ fontSize: 11, paddingLeft: 4 }}>
                      Preview: {finalPreviewLabel}
                    </div>
                  )}
                </div>

                {selectedType === "url" ? (
                  <input
                    type="url"
                    value={tempValue}
                    onChange={(e) => {
                      let value = e.target.value.trim()

                      if (value.startsWith("http://")) {
                        value = value.replace("http://", "https://")
                      }

                      if (value.length > 0 && !value.startsWith("https://")) {
                        value = "https://" + value.replace(/^https?:\/\//, "")
                      }

                      setTempValue(value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !canSaveAttribute) {
                        e.preventDefault()
                      }
                    }}
                    placeholder="Enter URL"
                    className={tempValue && !isRawValueValid ? "invalid" : ""}
                  />
                ) : selectedType === "date" ? (
                  <div className="date-input-wrapper">
                    <input
                      type="date"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !canSaveAttribute) {
                          e.preventDefault()
                        }
                      }}
                      className={tempValue && !isRawValueValid ? "invalid" : ""}
                    />
                    <span className="date-icon">
                      <Calendar width={18} height={18} />
                    </span>
                  </div>
                ) : (
                  <input
                    type={
                      selectedType === "email" ? "email" :
                      selectedType === "phone" ? "tel" :
                      selectedType === "number" ? "number" :
                      "text"
                    }
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !canSaveAttribute) {
                        e.preventDefault()
                      }
                    }}
                    placeholder={
                      selectedType === "email" ? "Enter email" :
                      selectedType === "phone" ? "Enter phone number" :
                      selectedType === "number" ? "Enter number" :
                      "Enter value"
                    }
                    className={tempValue && !isRawValueValid ? "invalid" : ""}
                  />
                )}

                <div className="create-actions">
                  <button
                    type="button"
                    className="create-cancel"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="create-accept"
                    disabled={!canSaveAttribute || isSavingAttribute}
                    onClick={async () => {
                      if (!canSaveAttribute || isSavingAttribute) return

                      setIsSavingAttribute(true)
                      try {
                        const cleanUrl = selectedType === "url"
                          ? (tempValue.startsWith("https://")
                              ? tempValue
                              : "https://" + tempValue.replace(/^https?:\/\//, ""))
                          : tempValue

                        const newAttr = {
                          label: tempLabel.trim(),
                          value: cleanUrl.trim(),
                          type: selectedType,
                          isCustom: true
                        }

                        await handleAddAttribute(newAttr)
                        handleCancel()
                      } finally {
                        setIsSavingAttribute(false)
                      }
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="attribute-panel">
              {!creatingAttribute && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    height: "100%",
                    alignContent: "start"
                  }}
                >
                  {container?.attributes?.map((attr, index) => (
                    <AttributeCard
                      key={index}
                      attr={attr}
                      index={index}
                      isOpen={openAttributeIndex === index}
                      setOpenIndex={setOpenAttributeIndex}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 17 – Theme selector (now absolute footer) */}
      </div>

      <div className="theme-selector">
        {themes.map(theme => (
          <div
            key={theme.name}
            className={`theme-dot ${skin === theme.name ? "active" : ""}`}
            onClick={async () => {
              const res = await axios.patch(
                `http://localhost:4000/api/container/${id}`,
                { skin: theme.name }
              )
              setContainer(res.data)
              setSkin(theme.name)
            }}
            style={{ background: theme.ink }}
          />
        ))}
      </div>

      </div>

      {/* existing modals / overlays (clear, action, creation) stay as they are below */}
      {showClearModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
            boxSizing: "border-box",
            overflowY: "auto"
          }}
          onClick={() => setShowClearModal(false)}
        >
          <div
            style={{
              background: "var(--vinyl)",
              padding: 24,
              borderRadius: 20,
              width: "100%",
              maxWidth: 340,
              maxHeight: "min(420px, 100vh - 80px)",
              boxSizing: "border-box",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 12 }}>Clear this container?</h3>

            <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 20 }}>
              This will erase content name, quantity and all attributes, but keep capacity and theme.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: 12,
                  border: "2px solid var(--ink)",
                  background: "transparent",
                  color: "var(--ink)"
                }}
                onClick={() => setShowClearModal(false)}
              >
                Cancel
              </button>

              <button
                style={{
                  background: "var(--ink)",
                  color: "var(--paper)",
                  padding: "8px 16px",
                  borderRadius: 12,
                  border: "2px solid var(--ink)"
                }}
                onClick={async () => {
                  const res = await axios.patch(
                    `http://localhost:4000/api/container/${id}`,
                    {
                      content_name: null,
                      current_quantity: 0,
                      attributes: []
                    }
                  )

                  setContainer(res.data)
                  setMode("status")
                  setStatusState(STOCK_STATES.EMPTY)
                  setMeasuredQuantity(0)
                  setShowClearModal(false)
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
      {actionTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
            boxSizing: "border-box",
            overflowY: "auto"
          }}
          onClick={() => setActionTarget(null)}
        >
          <div
            style={{
              background: "var(--vinyl)",
              padding: 24,
              borderRadius: 20,
              width: "100%",
              maxWidth: 340,
              maxHeight: "min(420px, 100vh - 80px)",
              boxSizing: "border-box",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 12 }}>
              {actionTarget.type === "url" && "Open link?"}
              {actionTarget.type === "phone" && "Call number?"}
              {actionTarget.type === "email" && "Send email?"}
            </h3>

            <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 20 }}>
              {actionTarget.value}
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: 12,
                  border: "2px solid var(--ink)",
                  background: "transparent",
                  color: "var(--ink)"
                }}
                onClick={() => setActionTarget(null)}
              >
                Cancel
              </button>

              <button
                style={{
                  background: "var(--ink)",
                  color: "var(--paper)",
                  padding: "8px 16px",
                  borderRadius: 12,
                  border: "2px solid var(--ink)"
                }}
                onClick={() => {
                  handleAction(actionTarget)
                  setActionTarget(null)
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default function App() {
  const isHandheld = useIsHandheld()

  if (!isHandheld) {
    return <HandheldOnlyScreen />
  }

  return (
    <Routes>
      <Route path="/c/:id" element={<ContainerPage />} />
    </Routes>
  )
}