require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const { nanoid } = require('nanoid')

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// GET container by id
app.get('/api/container/:id', async (req, res) => {
  const { id } = req.params

  const container = await prisma.container.findUnique({
    where: { id }
  })

  if (!container) {
    return res.status(404).json({ error: 'Not found' })
  }

  res.json(container)
})
// ✅ TEST ROUTE (add this temporarily)
app.get('/test', (req, res) => {
  res.send('Working')
})

// ✅ CREATE CONTAINER
app.post('/api/container', async (req, res) => {
  const id = nanoid(10)

  const container = await prisma.container.create({
    data: { id }
  })

  res.json(container)
})

const STATUS_RATIOS = {
  empty: 0,
  low: 0.10,
  available: 0.50,
  full: 1.0
}

// Update container
app.patch('/api/container/:id', async (req, res) => {
  const { id } = req.params

  try {
    const existing = await prisma.container.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ error: "Container not found" })
    }

    const data = { ...req.body }

    if (Object.prototype.hasOwnProperty.call(data, 'statusState')) {
      const status = data.statusState

      const maxCapacity =
        typeof data.max_capacity === 'number'
          ? data.max_capacity
          : existing.max_capacity

      const ratio = STATUS_RATIOS[status] ?? 0
      const mappedQuantity = maxCapacity * ratio

      data.current_quantity = mappedQuantity
    }

    const updated = await prisma.container.update({
      where: { id },
      data
    })

    res.json(updated)
  } catch (err) {
    res.status(404).json({ error: "Container not found" })
  }
})

app.listen(4000, () => console.log('Server running on 4000'))