const admin = require('firebase-admin')
const functions = require('firebase-functions')
const router = require('express').Router()

admin.initializeApp(functions.config().firebase)

const db = admin.firestore()
const getLove = postId => db.collection('love').doc(postId)

// ==> Routers <==
router.get('/', async (req, res) => {
  const { postId } = req.query
  if (!postId) {
    return res.status(400).send({ message: 'Query "postId" required!' })
  }
  const doc = await getLove(postId).get()
  if (!doc.exists) {
    return res.status(404).send({ message: 'Data is not exists!' })
  }
  const { loves } = doc.data()
  return res.send({ postId, count: loves })
})

router.post('/', async (req, res) => {
  const { postId, title } = req.body
  if (!postId && !title) {
    return res
      .status(400)
      .send({ message: 'Field "postId" & "title" are required!' })
  }

  const loveRef = getLove(postId)
  const increment = admin.firestore.FieldValue.increment(1)
  try {
    const doc = await loveRef.get()
    if (doc.exists) {
      await loveRef.update({ loves: increment })
    } else {
      await loveRef.set({ title, loves: 1 })
    }
    return res.send({ message: 'Success!' })
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

module.exports = router
