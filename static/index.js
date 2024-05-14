"use strict"

$(document).ready(function () {
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
            dataConsumo = []
            titlesConsumo = []
            let dataParsed = JSON.parse(data)

            for (let key in dataParsed) {
                dataConsumo.push(parseFloat(dataParsed[key]))
                titlesConsumo.push("")
            }
        })
        socket.on("valoriMediBatteria", data => {
            dataBatt = []
            titlesBatt = []
            let dataParsed = JSON.parse(data)

            for (let key in dataParsed) {
                dataBatt.push(parseFloat(dataParsed[key]))
                titlesBatt.push("")
            }
        })
        socket.on("valoriMedi", data => {
            dataChart = []
            titlesChart = []
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
                    text = `${parseFloat(data[key]) / 1000} kWh`
                    break

                case "Produzione":
                    title = "Produzione"
                    text = `${parseFloat(data[key]) / 1000} kWh`
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
