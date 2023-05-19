const express = require('express')
const app = express()



app.get('/', (req, res)=>{
    res.send("All working")
})

app.get('/me', (req, res)=>{
    res.send("All working me directory")
})


app.listen(4000, ()=>{
    console.log("App is running on port 4000")
})
