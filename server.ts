import _http from "http";
import _url from "url";
import _fs from "fs";
import _express from "express"
import _dotenv from "dotenv"

// lettura porte e variabili di ambiente
_dotenv.config({path: "./.env"})

// variabili di mongo
import { MongoClient, ObjectId } from "mongodb"
const DBNAME:string = process.env.DBNAME
const connectionString:string = process.env.connectionStringAtlas
const app = _express()

// creazione ed avvio del server
const server = _http.createServer(app)
const PORT:number = parseInt(process.env.PORT) ;
let paginaErrore;

server.listen(PORT, () => {
    // init()

    console.log(`Il Server è in ascolto sulla porta ${PORT}`);
});

function init() {
    _fs.readFile("./static/error.html", (err, data) => {
        if(err) {
            paginaErrore = "<h1>Pagina non trovata</h1>"
        } else {
            paginaErrore = data.toString();
        }
    })
}

//////////////////////////////////////////////////////////////////
// Websocket connection
//////////////////////////////////////////////////////////////////

const io = require("socket.io")(server, {
    cors: {
        origins: "*:*"
    }
})

io.on("connection", socket => {
    console.log(socket.handshake.address)
    // io.emit("messaged", "ciao client")
    socket.on("disconnect", () => console.log("Client disconnected"))
    socket.on("messaged", args => {
        console.log(args)
        io.emit("messaged", "ciao client")
    })

    socket.on("updateArduino", args => {
        console.log(args)
    })
    
    socket.on("updateData", async args => {
        const client = new MongoClient(connectionString);
        await client.connect();
        let collection = client.db(DBNAME).collection("sunshutter");
        let rq = collection.updateOne({_id: new ObjectId("65ddc2db73e183cb7a162a62")}, {$set: args})
        rq.then(data => {
            GetData()
        })
        rq.catch(error => {
            console.log(error)
        })
        rq.finally(() => client.close());
    })

    GetData()

    async function GetData() {
        const client = new MongoClient(connectionString);
        await client.connect();
        let collection = client.db(DBNAME).collection("sunshutter");
        let rq = collection.find().toArray()
    
        let aus = await rq
    
        rq.finally(() => client.close());
    
        io.emit("sunshutter", JSON.stringify(aus[0]))
    }
})

//////////////////////////////////////////////////////////////////
// Route Middelware
//////////////////////////////////////////////////////////////////

// 1. Request log
app.use("/", (req: any, res: any, next: any) => {
    console.log(`Richiesta ricevuta: ${req.method}: ${req.originalUrl}`)
    next()
})

// 2. Route statiche
app.use("/", _express.static("./static"))

// 3. Lettura parametri body
app.use("/", _express.json({limit: "50mb"})) // bodyParse

app.use("/", _express.urlencoded({limit: "50mb", extended: true}))

app.use("/", (req, res, next) => {
    if(Object.keys(req["query"]).length > 0) {
        console.log(`      ${JSON.stringify(req["query"])}`)
    }

    if(Object.keys(req["body"]).length > 0) {
        console.log(`      ${JSON.stringify(req["body"])}`)
    }

    next()
})

//////////////////////////////////////////////////////////////////
// Route finali risposta client
//////////////////////////////////////////////////////////////////

app.get("/api/richiesta1", async (req, res, next) => {
    let unicornName = req["query"]["nome"]

    const client = new MongoClient(connectionString);
    await client.connect();
    let collection = client.db(DBNAME).collection("unicorns");
    let rq = collection.findOne({name: unicornName})

    rq.then((data) => {
        res.send(data)
    });

    rq.catch((err) => {
        res.status(500)
        res.send(`Errore esecuzione query: ${err}`)
    })

    rq.finally(() => client.close());
})

app.get("/api/getCollections", async (req, res, next) => {
    const client = new MongoClient(connectionString);
    await client.connect();
    
    let db = client.db(DBNAME)
    let rq = db.listCollections().toArray()

    rq.then((data) => {
        res.send(data)
    });

    rq.catch((err) => {
        res.status(500)
        res.send(`Errore lettura delle collezioni: ${err}`)
    })

    rq.finally(() => client.close());
})

app.get("/api/:collection", async (req, res, next) => {
    let collectionName = req["params"]["collection"]
    let filter = req["query"]

    const client = new MongoClient(connectionString);
    await client.connect();
    
    let db = client.db(DBNAME)
    let rq = db.collection(collectionName).find(filter).toArray()

    rq.then((data) => {
        res.send(data)
    });

    rq.catch((err) => {
        res.status(500)
        res.send(`Errore lettura delle collezioni: ${err}`)
    })
    
    rq.finally(() => client.close());
})

app.get("/api/:collection/:id", async (req, res, next) => {
    let collectionName = req["params"]["collection"]
    let id = new ObjectId(req["params"]["id"])
    let objId

    if(ObjectId.isValid(id)) {
        objId = new ObjectId(id)
    } else {
        objId = id as unknown as ObjectId
    }

    const client = new MongoClient(connectionString);
    await client.connect();
    
    let db = client.db(DBNAME)
    let rq = db.collection(collectionName).findOne({_id: id})

    rq.then((data) => {
        res.send(data)
    });

    rq.catch((err) => {
        res.status(500)
        res.send(`Errore lettura delle collezioni: ${err}`)
    })
    
    rq.finally(() => client.close());
})

app.post("/api/:collection", async (req, res, next) => {
    let collectionName = req["params"]["collection"]
    let newRecord = req["body"]

    const client = new MongoClient(connectionString);
    await client.connect();
    
    let db = client.db(DBNAME)
    let rq = db.collection(collectionName).insertOne(newRecord)
    
    rq.then((data) => {
        res.send(data)
    });

    rq.catch((err) => {
        res.status(500)
        res.send(`Errore lettura delle collezioni: ${err}`)
    })
    
    rq.finally(() => client.close());
})

app.delete("/api/:collection/:id", async (req, res, next) => {
    let collectionName = req["params"]["collection"]
    let id = new ObjectId(req["params"]["id"])
    let objId

    if(ObjectId.isValid(id)) {
        objId = new ObjectId(id)
    } else {
        objId = id as unknown as ObjectId
    }

    const client = new MongoClient(connectionString);
    await client.connect();
    
    let db = client.db(DBNAME)
    let rq = db.collection(collectionName).deleteOne({_id: id})

    rq.then((data) => {
        res.send(data)
    });

    rq.catch((err) => {
        res.status(500)
        res.send(`Errore lettura delle collezioni: ${err}`)
    })
    
    rq.finally(() => client.close());
})

/**
 * Chiama il metodo PATCH con l'obbligo di specificare dentro il body la ACTION da eseguire
 * 
 * @remarks
 * Utilizzando questo metodo la PATCH risulta più flessibile
 * 
 * @param id - id del record
 * @body i nuovi valori da aggiornare, ad esempio: {$inc: {amount: 1}}
 * @returns Un JSON di conferma dell'aggiornamento
 */
app.patch("/api/:collection/:id", async (req, res, next) => {
    let collectionName = req["params"]["collection"]
    let id = new ObjectId(req["params"]["id"])
    let objId

    if(ObjectId.isValid(id)) {
        objId = new ObjectId(id)
    } else {
        objId = id as unknown as ObjectId
    }

    let action = req["body"]

    const client = new MongoClient(connectionString);
    await client.connect();
    
    let db = client.db(DBNAME)
    let rq = db.collection(collectionName).updateOne({_id: id}, action)

    rq.then((data) => {
        res.send(data)
    });

    rq.catch((err) => {
        res.status(500)
        res.send(`Errore lettura delle collezioni: ${err}`)
    })
    
    rq.finally(() => client.close());
})

app.patch("/api/:collection", async (req, res, next) => {
    let collectionName = req["params"]["collection"]
    let filters = req["body"]["filters"]
    let action = req["body"]["action"]

    const client = new MongoClient(connectionString);
    await client.connect();
    
    let db = client.db(DBNAME)
    let rq = db.collection(collectionName).updateMany(filters, action)

    rq.then((data) => {
        res.send(data)
    });

    rq.catch((err) => {
        res.status(500)
        res.send(`Errore lettura delle collezioni: ${err}`)
    })
    
    rq.finally(() => client.close());
})

/**
 * Chiama il metodo PUT aggiornando il record invece che sostituirlo
 * 
 * @remarks
 * Utilizzando questo metodo la PUT esegue direttamente il SET del valore ricevuto
 * 
 * @param id - id del record
 * @body i nuovi valori da aggiornare
 * @returns Un JSON di conferma dell'aggiornamento
 */
app.put("/api/:collection/:id", async (req, res, next) => {
    let collectionName = req["params"]["collection"]
    let id = new ObjectId(req["params"]["id"])
    let objId

    if(ObjectId.isValid(id)) {
        objId = new ObjectId(id)
    } else {
        objId = id as unknown as ObjectId
    }

    let newValues = req["body"]

    const client = new MongoClient(connectionString);
    await client.connect();
    
    let db = client.db(DBNAME)
    let rq = db.collection(collectionName).updateOne({_id: id}, {$set: newValues})

    rq.then((data) => {
        res.send(data)
    });

    rq.catch((err) => {
        res.status(500)
        res.send(`Errore lettura delle collezioni: ${err}`)
    })
    
    rq.finally(() => client.close());
})

//////////////////////////////////////////////////////////////////
// Default Route
//////////////////////////////////////////////////////////////////

app.use("/", (req, res, next) => {
    res.status(404)

    if(req.originalUrl.startsWith("/api/")) {
        res.send({error: "API non implementata"})
    } else {
        res.send(paginaErrore)
    }
})

app.use("/", (err, req, res, next) => {
    console.log("******** SERVER ERROR ********", err.stack)

    res.status(500).send(err.message)
})
