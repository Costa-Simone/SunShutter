"use strict"

$(document).ready(function() {
    let _sectionData = $("#sectionData")
    let _homeButton = $("#homeButton")
    let _settingsButton = $("#settingsButton")
    let _commandsButton = $("#commandsButton")

    let _home = $("#home").show()
    let _commands = $("#commands").hide()

    let serverSocket = io.connect("http://localhost:3000")

    serverSocket.on('connect', function() {console.log("connessione ok")} )
    serverSocket.on("chat message", data => {console.log(data)})

    GetData()

    _homeButton.on("click", function() {
        _home.show()
        _commands.hide()

        _homeButton.addClass("active")
        _commandsButton.removeClass("active")
        _settingsButton.removeClass("active")
    })

    _commandsButton.on("click", function() {
        _home.hide()
        _commands.show()

        _homeButton.removeClass("active")
        _commandsButton.addClass("active")
        _settingsButton.removeClass("active")
    })

    _settingsButton.on("click", function() {
        _home.hide()
        _commands.hide()

        _homeButton.removeClass("active")
        _commandsButton.removeClass("active")
        _settingsButton.addClass("active")
    })
    
    function GetData() {
        let rq = inviaRichiesta("GET", "/api/sunshutter")

        rq.catch(errore)
        rq.then(response => {
            console.log(response)
            for(let key in response["data"][0]) {
                let title
                let text

                switch(key) {
                    case "Apertura":
                        title = "Apertura"

                        if(response["data"][0][key] == false) {
                            text = "Chiuso"
                        } else {
                            text = "Aperto"
                        }
                        break
                    
                    case "Consumo":
                        title = "Consumo"
                        text = `${response["data"][0][key]["$numberDecimal"]} W`
                        break

                    case "Produzione":
                        title = "Produzione"
                        text = `${response["data"][0][key]["$numberDecimal"]} W`
                        break

                    case "Orientamento":
                        title = "Orientamento"
                        text = `${response["data"][0][key]["$numberDecimal"]} °`
                        break

                    default:
                        break;
                }

                if(title != undefined && text != undefined) {
                    let divCard = $("<div>").addClass("card item").appendTo(_sectionData)
                    let divCardBody = $("<div>").addClass("card-body").appendTo(divCard)
                    $("<h5>").addClass("card-title").text(title).appendTo(divCardBody).appendTo(divCardBody)
                    $("<p>").addClass("card-text").text(text).appendTo(divCardBody)
                }
            }
        })
    }
});
