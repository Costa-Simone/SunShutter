"use strict"

$(document).ready(function () {
    let _homeButton = $("#homeButton")
    let _settingsButton = $("#settingsButton")
    let _commandsButton = $("#commandsButton")
    let _saveButton = $("#saveButton")

    let _sectionData = $("#sectionData").show()
    let _commands = $("#commands").hide()

    let _switchOpen = $("#toggler-1").prop("disabled", true)
    let _orientamentoInput = $("#orientamentoInput")

    let serverSocket = io.connect("http://localhost:3000")

    let isOpen = false
    let sunshutterId = null

    serverSocket.on('connect', function () { console.log("connessione ok") })
    serverSocket.on("chat message", data => { console.log(data) })

    GetData()

    _saveButton.on("click", function () {
        let orientamento = parseFloat(_orientamentoInput.val())

        let rq = inviaRichiesta("PUT", "/api/sunshutter/" + sunshutterId, { "Orientamento": orientamento, "Apertura": isOpen })
        rq.catch(errore)
        rq.then(response => {
            alert("Modifica effettuata correttamente")
        })
    })

    _switchOpen.on("click", function () {
        isOpen = !isOpen
    })

    _homeButton.on("click", function () {
        _sectionData.show()
        _commands.hide()

        _homeButton.addClass("active")
        _commandsButton.removeClass("active")
        _settingsButton.removeClass("active")
    })

    _commandsButton.on("click", function () {
        _sectionData.hide()
        _commands.show()

        _homeButton.removeClass("active")
        _commandsButton.addClass("active")
        _settingsButton.removeClass("active")
    })

    _settingsButton.on("click", function () {
        _sectionData.hide()
        _commands.hide()

        _homeButton.removeClass("active")
        _commandsButton.removeClass("active")
        _settingsButton.addClass("active")
    })

    function GetData() {
        let rq = inviaRichiesta("GET", "/api/sunshutter")

        rq.catch(errore)
        rq.then(response => {
            console.log(response["data"][0])
            for (let key in response["data"][0]) {
                let title
                let text

                if (key == "_id") {
                    sunshutterId = response["data"][0][key]
                }

                switch (key) {
                    case "Apertura":
                        title = "Apertura"

                        if (response["data"][0][key] == false) {
                            text = "Chiuso"
                            isOpen = false
                        } else {
                            text = "Aperto"
                            _switchOpen.prop("disabled", false).trigger("click")
                            isOpen = true
                        }
                        break

                    case "Consumo":
                        title = "Consumo"
                        text = `${response["data"][0][key]} W`
                        break

                    case "Produzione":
                        title = "Produzione"
                        text = `${response["data"][0][key]} W`
                        break

                    case "Orientamento":
                        title = "Orientamento"
                        text = `${response["data"][0][key]} °`
                        _orientamentoInput.val(response["data"][0][key])
                        break

                    default:
                        break;
                }

                if (title != undefined && text != undefined) {
                    let divCard = $("<div>").addClass("card item").appendTo(_sectionData)
                    let divCardBody = $("<div>").addClass("card-body").appendTo(divCard)
                    $("<h5>").addClass("card-title").text(title).appendTo(divCardBody).appendTo(divCardBody)
                    $("<p>").addClass("card-text").text(text).appendTo(divCardBody)
                }
            }
        })
    }
});
