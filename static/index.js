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

    let consumoOrario = []

    _modeList.val(1)
    $("#divBase").hide()

    _orientamentoInput.on("input", () => {
        let value = _orientamentoInput.val()

        if (value < 0) {
            _orientamentoInput.val(0)
        } else if (value > 165) {
            _orientamentoInput.val(165)
        }
    })

    try {
        socket = io("ws://localhost:3000", { transports: ["websocket"] })
        // ws://84.33.125.234:3000
        // ws://localhost:3000

        socket.emit("JOIN-ROOM", "sunshutter")

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
            $("#ricavatoOdierno").text((parseFloat(data["produzione"]) / 1000 * 0.0792).toFixed(3) + " €")
            consumoOrario = data["consumoOrario"]
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
            socket.emit("updateData", { "Mode": "a", "Orientamento": orientamento })
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

        if (isOpen) {
            $("#containerOrientamento").show()
        } else {
            // $("#containerOrientamento").hide()
            _orientamentoInput.val(0)
        }
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
        // ShowMediaChart()
        ShowConsumoCharts()
        ShowProduzioneCharts()
        ShowBatteriaCharts()
    })

    _commandsButton.on("click", function () {
        _sectionData.hide()
        _commands.show()
        _charts.hide()
    })

    // generatore grafico media produzione giornaliera tramite SweetAlert
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

    // generatore card pagina home
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
                        // $("#containerOrientamento").hide()
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

                    if (isOpen) {
                        _orientamentoInput.val(data[key])
                    } else {
                        _orientamentoInput.val(0)
                    }

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

            // generatore card Consumo, Produzione e Orientamento
            if (title != undefined && text != undefined) {
                let divClone = $("#divBase").clone()
                divClone.find("h5").text(title)
                divClone.find("h2").text(text)

                switch (key) {
                    case "Consumo":
                        divClone.find("i").removeClass("fa-lock").addClass("fa-bolt")
                        divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-orange-dark")
                        divClone.addClass("pointer")

                        divClone.on("click", () => {
                            $("#chartsButton").trigger("click")
                        })
                        break

                    case "Produzione":
                        divClone.find("i").removeClass("fa-lock").addClass("fa-sun")
                        divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-orange")
                        divClone.addClass("pointer")

                        divClone.on("click", () => {
                            $("#chartsButton").trigger("click")
                        })
                        break

                    case "Orientamento":
                        divClone.find("i").removeClass("fa-lock").addClass("fa-retweet")
                        divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-blue-dark")
                        break
                }

                divClone.appendTo($("#grid")).show()
            }
        }

        // generatore card Ricavo giornaliero e Batteria
        for (let i = 0; i < 2; i++) {
            let title
            let text
            let divClone = $("#divBase").clone()

            if (i == 0) {
                title = "Ricavo giornaliero"
                text = (parseFloat(data["Produzione"]) * 0.2).toFixed(2) + " €"
                divClone.find("i").removeClass("fa-lock").addClass("fa-money-bill")
                divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-green-dark")
                divClone.addClass("pointer")

                divClone.on("click", () => {
                    ShowMediaProduzioneChart()
                })
            } else {
                title = "Batteria"
                text = parseInt(data["Batteria"] * 100 / 3000).toString() + " %"
                divClone.find("i").removeClass("fa-lock").addClass("fa-battery-full")
                divClone.children("div").removeClass("l-bg-cherry").addClass("l-bg-cyan")
                divClone.addClass("pointer")

                divClone.on("click", () => {
                    $("#chartsButton").trigger("click")
                })
            }

            divClone.find("h5").text(title)

            if (title == "Ricavo giornaliero") {
                divClone.find("h2").text("0 €").prop("id", "ricavatoOdierno")
            } else {
                divClone.find("h2").text(text)
            }

            divClone.appendTo($("#grid")).show()
        }
    };


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
    // generatore grafico consumo giornaliero e annuale
    function ShowConsumoCharts() {
        let labels = []

        consumoOrario.forEach((element, index) => {
            labels.push("")
        })

        let chart = new Chart($("#consumoGiornaliero"), {
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Consumo giornaliero",
                        type: 'line',
                        data: consumoOrario,
                        borderColor: "rgba(255, 0, 0, 1)",
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

        chart.canvas.parentNode.style.width = '500px';
        chart.canvas.parentNode.style.display = 'inline-block';

        chart = new Chart($("#consumoAnnuale"), {
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Consumo annuale",
                        type: 'line',
                        data: dataChart,
                        borderColor: "rgba(255, 0, 0, 1)",
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

        chart.canvas.parentNode.style.width = '500px';
        chart.canvas.parentNode.style.display = 'inline-block';
    }
    // generatore grafico produzione giornaliera e annuale
    function ShowProduzioneCharts() {
        let chart = new Chart($("#produzioneGiornaliero"), {
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Produzione giornaliera",
                        type: 'line',
                        data: dataChart,
                        borderColor: "rgba(0, 255, 0, 1)",
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

        chart.canvas.parentNode.style.width = '500px';
        chart.canvas.parentNode.style.display = 'inline-block';

        chart = new Chart($("#produzioneAnnuale"), {
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Produzione annuale",
                        type: 'line',
                        data: dataChart,
                        borderColor: "rgba(0, 255, 0, 1)",
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

        chart.canvas.parentNode.style.width = '500px';
        chart.canvas.parentNode.style.display = 'inline-block';
    }
    // generatore grafico batteria giornaliera e annuale
    function ShowBatteriaCharts() {
        let chart = new Chart($("#batteriaGiornaliero"), {
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Batteria giornaliera",
                        type: 'line',
                        data: dataChart,
                        borderColor: "rgba(0, 0, 255, 1)",
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

        chart.canvas.parentNode.style.width = '500px';
        chart.canvas.parentNode.style.display = 'inline-block';

        chart = new Chart($("#batteriaAnnuale"), {
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Batteria annuale",
                        type: 'line',
                        data: dataChart,
                        borderColor: "rgba(0, 0, 255, 1)",
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

        chart.canvas.parentNode.style.width = '500px';
        chart.canvas.parentNode.style.display = 'inline-block';
    }
});

// generatore di numeri casuali tra a e b estremi escluso
function generaNumero(a, b) { //estremo superiore escluso
    let ris = Math.floor((b - a) * Math.random()) + a;

    return ris;
}
