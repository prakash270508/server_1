const express = require('express')
const app = express()



app.get('/', (req, res)=>{
    res.send("All working")
})

app.get('/', (req, res)=>{
    res.send("All working")
})


app.listen(4000, ()=>{
    console.log("App is running on port 4000")
})
