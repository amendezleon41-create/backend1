require('dotenv').config()

const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// Importa el modelo YA DEFINIDO
const Note = require('./models/note')

// Middleware logger
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('-----------------------')
  next()
}

app.use(requestLogger)

// Rutas
app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

app.get('/api/notes/:id', async (request, response,next) => {
      Note.findById(request.params.id)
            .then(note=>{
              if(note){
                response.json(note)
              }else{
                response.status(404).end()
              }
            })
            .catch(error=>next(error))
})
app.post('/api/notes', async (request, response) => {
  const body = request.body
  if(body.content){
    const note = new Note({
      content: body.content,
      important: body.important
    })
    note.save().then(x=>{
      response.json(x)
    })
  }
  else{
    response.status(400).json({error: 'content is missing'})
  }
})
app.put('/api/notes/:id', async (request, response)=>{
  const body = request.body
  const note = {
    content: body.content,
    important: body.important
  }
  Note.findByIdAndUpdate(request.params.id, note, {new:true})
    .then(note2=>{
      response.json(note2)
    })
    .catch(error=>next(error))
})


app.delete('/api/notes/:id', async (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result=>{
        response.status(204).end()
    })
    .catch(error=>next(error)
    )
}) 

const badPath = (request,response,next)=>{
  response.status(404).send({error: 'Ruta desconocida'})
}
app.use(badPath)

const errorHandler = (error,request,response,next)=>{
  console.log('ERROR: ',error.message);
  if(error.name === "CastError"){
    return response.status(400).send({error: 'id not found'})
  }
  next(error)
}
app.use(errorHandler)

// Error 404 para rutas inexistentes
app.use((request, response) => {
  response.status(404).json({ error: 'Ruta desconocida' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
