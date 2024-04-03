"use strict"

$(document).ready(function () {
    let img = 'data:image/jpeg;base64,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'
    let _homeButton = $("#homeButton")
    let _commandsButton = $("#commandsButton")
    let _saveButton = $("#saveButton")

    let _sectionData = $("#sectionData").show()
    let _commands = $("#commands").hide()

    let _switchOpen = $("#toggler-1").prop("disabled", true)
    let _orientamentoInput = $("#orientamentoInput")
    let _modeList = $("#modeList")
    let _commandsWrapper = $("#commandsWrapper")

    let socket
    let isFirst = true

    _modeList.val(1)
    _commandsWrapper.hide()
    $("#cardooo").hide()

    try {
        socket = io("ws://localhost:3000", { transports: ["websocket"] })
        // ws://84.33.125.234:3000
        // ws://localhost:3000

        socket.on("message", msg => {
            console.log(msg)
        })
        socket.on("sunshutter", data => {
            Showdata(data)
        })
    } catch (error) {
        console.log(error)
    }

    let isOpen = false
    let sunshutterId = null

    _modeList.on("change", function () {
        if (_modeList.val() == 1) {
            _commandsWrapper.hide()
        } else {
            _commandsWrapper.show()
        }
    })
    _saveButton.on("click", function () {
        if (_modeList.val() == 1) {
            socket.emit("updateData", { "Mode": "a" })
        } else {
            let orientamento = parseFloat(_orientamentoInput.val())

            socket.emit("updateData", { "Orientamento": orientamento, "Apertura": isOpen, "Mode": "m" })

            _sectionData.show()
            _commands.hide()
            _homeButton.addClass("active")
            _commandsButton.removeClass("active")
        }
    })

    _switchOpen.on("click", function () {
        isOpen = !isOpen
    })

    _homeButton.on("click", function () {
        _sectionData.show()
        _commands.hide()

        _homeButton.addClass("active")
        _commandsButton.removeClass("active")
    })

    _commandsButton.on("click", function () {
        _sectionData.hide()
        _commands.show()

        _homeButton.removeClass("active")
        _commandsButton.addClass("active")
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

                        if (isFirst) {
                            isFirst = false
                            _switchOpen.prop("disabled", false).trigger("click")
                        }
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

                case "Mode":
                    if (data[key] == "a") {
                        _modeList.val(1)
                        _commandsWrapper.hide()
                    } else {
                        _modeList.val(2)
                        _commandsWrapper.show()
                    }
                    break

                default:
                    break;
            }

            if (title != undefined && text != undefined) {
                let divClone = $("#cardooo").clone()
                divClone.find("h5").text(title)
                divClone.find("h2").text(text)

                switch (title) {
                    case "Consumo":
                        divClone.find("i").removeClass("fa-lock").addClass("fa-bolt")
                        divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-orange-dark")
                        break

                    case "Produzione":
                        divClone.find("i").removeClass("fa-lock").addClass("fa-sun")
                        divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-green-dark")
                        break

                    case "Orientamento":
                        divClone.find("i").removeClass("fa-lock").addClass("fa-retweet")
                        divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-blue-dark")
                        break
                }

                divClone.appendTo(_sectionData).show()
            }
        }
    }
});
