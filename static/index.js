"use strict"

$(document).ready(function () {
    let img = 'data:image/jpeg;base64,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'
    let _homeButton = $("#homeButton")
    let _settingsButton = $("#settingsButton")
    let _commandsButton = $("#commandsButton")
    let _saveButton = $("#saveButton")

    let _sectionData = $("#sectionData").show()
    let _commands = $("#commands").hide()

    let _switchOpen = $("#toggler-1").prop("disabled", true)
    let _orientamentoInput = $("#orientamentoInput")
    
    let socket

    try {
        socket = io("ws://localhost:3000", {transports: ["websocket"]})
        // ws://localhost:3000
        // wss://sunshutter.onrender.com/

        socket.on("message", msg => {
            console.log(msg)
        })
        socket.on("sunshutter", data => {
            Showdata(data)
        })
        socket.emit("messaged", "ciao")

    } catch (error) {
        console.log(error)
    }

    let isOpen = false
    let sunshutterId = null

    _saveButton.on("click", function () {
        let orientamento = parseFloat(_orientamentoInput.val())

        socket.emit("updateData",  { "Orientamento": orientamento, "Apertura": isOpen })
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

    function Showdata(data) {
        data = JSON.parse(data)

        _sectionData.html("")
        $("<img>").addClass("gridImage").prop("src", img).appendTo(_sectionData)

        for (let key in data) {
            let title
            let text

            if (key == "_id") {
                sunshutterId = data[key]
            }

            switch (key) {
                case "Apertura":
                    title = "Apertura"

                    if (data[key] == false) {
                        text = "Chiuso"
                        _switchOpen.prop("disabled", false)
                        isOpen = false
                    } else {
                        text = "Aperto"
                        _switchOpen.prop("disabled", false).trigger("click")
                        isOpen = true
                    }
                    break

                case "Consumo":
                    title = "Consumo"
                    text = `${data[key]} W`
                    break

                case "Produzione":
                    title = "Produzione"
                    text = `${data[key]} W`
                    break

                case "Orientamento":
                    title = "Orientamento"
                    text = `${data[key]} °`
                    _orientamentoInput.val(data[key])
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
    }
});
