//server config
const express = require("express")
const server = express()

//configurar para arquivos extras
server.use(express.static('public'))

//habilitar Body
server.use(express.urlencoded({extended: true}))

//banco
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'colocar senha aqui',
    host: 'localhost',
    port: 5432,
    database: 'Doe'

})

// configurar templete engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express: server,
    noCache: true,
})

//configurar aprensentacao da pagina
server.get("/", function(req, res){
    
    db.query("SELECT* FROM donors", function(err, result){
        if(err) return res.send("Erro de Banco de Dados")
        const donors = result.rows
        return res.render("index.html",{donors})
    })

    
})

server.post("/", function(req,res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "" ){
        return res.send("Todos os campos são Obrigatorios.")
    }

    const query = 'INSERT INTO donors("name", "email", "blood") VALUES($1, $2, $3)'

    const values = [name, email, blood]

    db.query(query, values, function(err){
        if (err) return res.send("Erro banco de dados")
        return res.redirect("/")
    })

    
})

server.listen(3000, function(){
    console.log("Iniciei o servidor")
})