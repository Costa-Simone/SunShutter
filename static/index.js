"use strict"

$(document).ready(function () {
    let img = 'data:image/jpeg;base64,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'
    let _homeButton = $("#homeButton")
    let _commandsButton = $("#commandsButton")
    let _saveButton = $("#saveButton")

    let _sectionData = $("#sectionData").show()
    let _commands = $("#commands").hide()
    let _charts = $("#charts").hide()

    let _switchOpen = $("#toggler-1").prop("disabled", true)
    let _orientamentoInput = $("#orientamentoInput")
    let _modeList = $("#modeList")
    let _commandsWrapper = $("#commandsWrapper")

    let socket
    let isFirst = true

    let dataChart = []
    let titlesChart = []
    let colorChart = []
    let dataConsumo = []
    let titlesConsumo = []
    let dataBatt = []
    let titlesBatt = []

    _modeList.val(1)
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
        socket.on("valoriMediConsumo", data => {
            let dataParsed = JSON.parse(data)

            for (let key in dataParsed) {
                dataConsumo.push(parseFloat(dataParsed[key]))
                titlesConsumo.push("")
            }
        })
        socket.on("valoriMediBatteria", data => {
            let dataParsed = JSON.parse(data)

            for (let key in dataParsed) {
                dataBatt.push(parseFloat(dataParsed[key]))
                titlesBatt.push("")
            }
        })
        socket.on("valoriMedi", data => {
            let dataParsed = JSON.parse(data)

            for (let key in dataParsed) {
                let data = new Date(parseFloat(key))
                dataChart.push(parseFloat(dataParsed[key]))
                titlesChart.push(data.toLocaleDateString())
            }
        })
        socket.on("valoreProduzione", data => {
            $("#ricavatoOdierno").text((parseFloat(data) / 1000 * 0.0792).toFixed(3) + " €")
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
        _charts.hide()
    })

    $("#chartsButton").on("click", function () {
        _sectionData.hide()
        _commands.hide()
        _charts.show()
        ShowMediaChart()
    })

    _commandsButton.on("click", function () {
        _sectionData.hide()
        _commands.show()
        _charts.hide()
    })

    function ShowMediaChart() {
        let chart = new Chart($("#mediaValori"), {
            data: {
                labels: titlesConsumo,
                datasets: [
                    {
                        label: "Produzione",
                        type: 'line',
                        data: dataChart,
                        borderColor: "rgba(255, 0, 0, 1)",
                    },
                    {
                        label: "Consumo",
                        type: "line",
                        data: dataConsumo,
                        borderColor: "rgba(0, 255, 0, 1)"
                    },
                    {
                        label: "Batteria",
                        type: "line",
                        data: dataBatt,
                        borderColor: "rgba(0, 0, 255, 1)"
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true
                    },
                    legend: {
                        display: true
                    },
                },
                maintainAspectRatio: false,
                scales: {
                  y: {
                    stacked: true,
                    grid: {
                      display: true,
                      color: "rgba(255,99,132,0.2)"
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
            }
        })
    }

    function ShowMediaProduzioneChart() {
        Swal.fire({
            title: "Media produzione giornaliera",
            html: "<canvas id='canvasProduzione'></canvas>",
            didOpen: () => {
                const chart = new Chart($("#canvasProduzione"), {
                    type: 'bar',
                    data: {
                        labels: titlesChart,
                        datasets: [{
                            data: dataChart,
                            backgroundColor: "rgb(184, 134, 11)",
                        }]
                    },
                    options: {
                        plugins: {
                            title: {
                                display: false
                            },
                            legend: {
                                display: false
                            }
                        }
                    }
                })
            }
        });
    }

    function Showdata(data) {
        data = JSON.parse(data)

        $("#grid").html("")

        for (let key in data) {
            let title
            let text

            if (key == "_id") {
                sunshutterId = data[key]
            }

            switch (key) {
                case "Apertura":
                    title = "Stato persiana"

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
                    text = `${data[key]} Wh`
                    break

                case "Produzione":
                    title = "Produzione"
                    text = `${data[key]} Wh`
                    break

                case "Orientamento":
                    title = "Inclinazione del pannello"
                    text = `${data[key]}°`
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

                switch (key) {
                    case "Consumo":
                        divClone.find("i").removeClass("fa-lock").addClass("fa-bolt")
                        divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-orange-dark")
                        break

                    case "Produzione":
                        divClone.find("i").removeClass("fa-lock").addClass("fa-sun")
                        divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-orange")
                        break

                    case "Orientamento":
                        divClone.find("i").removeClass("fa-lock").addClass("fa-retweet")
                        divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-blue-dark")
                        break
                }

                divClone.appendTo($("#grid")).show()
            }
        }

        for (let i = 0; i < 2; i++) {
            let title
            let text
            let divClone = $("#cardooo").clone()

            if (i == 0) {
                title = "Ricavo giornaliero"
                text = (parseFloat(data["Produzione"]) * 0.2).toFixed(2) + " €"
                divClone.find("i").removeClass("fa-lock").addClass("fa-money-bill")
                divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-green-dark")
                divClone.on("click", () => {
                    ShowMediaProduzioneChart()
                })
                divClone.addClass("pointer")
            } else {
                title = "Batteria"
                text = parseInt(data["Batteria"] * 100 / 3000).toString() + " %"
                divClone.find("i").removeClass("fa-lock").addClass("fa-battery-full")
                divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-cyan")
            }

            divClone.find("h5").text(title)

            if (title == "Ricavo giornaliero") {
                divClone.find("h2").text(text).prop("id", "ricavatoOdierno")
            } else {
                divClone.find("h2").text(text)
            }

            divClone.appendTo($("#grid")).show()
        }
    }
});

function generaNumero(a, b) { //estremo superiore escluso
    let ris = Math.floor((b - a) * Math.random()) + a;

    return ris;
}
