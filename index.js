const express = require("express") 
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))

const requestLogger = (request,response,next) =>{
    console.log('Method:',request.method);
    console.log('Path:',request.path);
    console.log('Body:',request.body);
    console.log('-----------------------');
    next();
}
app.use(requestLogger)
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute onlu JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET & POST are the most important methods of HTTP Protocols",
        important: true
    }
]

/*app.get('/',(request,response) => {
    response.send('<h1> API REST FROM Notes</h1>')
})*/

app.get('/api/notes',(request,response) =>{
    response.json(notes)
})

app.get('/api/notes/:id', (request,response) =>{

    const id =Number(request.params.id)
  
    const note = notes.find(x => x.id === id)

    if(note){
        response.json(note)
    } else{
        response.status(404).end()
    }
    response.json(note)
})

app.delete('/api/notes/:id', (request,response) => {
    const id =Number(request.params.id)
    notes = notes.filter(x=> x.id !== id) //Solo estamos simulando el borrado

    response.status(204).end()
})

app.post ('/api/notes', (request,response) => {
    const note = request.body 
    if(note.content){
        note.id = notes.length+1
        notes = notes.concat(note)
        response.json(note)
    }else{
        response.status(400).json({error: 'content is missing'})
    }
})
const badPath = (request,response, next) =>{
    response.status(404).send({error:'Ruta desconocida'})
}
app.use(badPath)

//Para el proveedor le damos la opcion de que elija el puerto
const PORT = process.env.PORT || 3001
 app.listen(PORT, () =>{
    console.log(`Server running in port ${PORT}`);
 } )