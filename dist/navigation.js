// for spa
$(() => {
    let interval = undefined;

    $('nav a').on('click', function (e) {
        document.getElementById("id_search_not_found").style.display = "none";
        e.preventDefault();
        let page = this.dataset.page;
        $('section').removeClass('show');
        $(`#${page}`).addClass('show');

        if (page !== 'coins') {
            document.getElementById('fromSearch').style.display = "none";
        } else {
            document.getElementById('fromSearch').style.display = "flex";
        }

        if (interval)
            clearInterval(interval);
        interval = undefined;
        if (page === 'reports') {
            const selectedCoins = Array.from(document.querySelectorAll('input:checked'));
            const coinSymbols = selectedCoins.map(x => x.dataset.coinSymbol.toUpperCase()).join(',');
            let prices = {};
            interval = setInterval(async () => {
                let data = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinSymbols}&tsyms=USD`).then(res => res.json());
                for (const coin in data) {
                    if (!prices[coin]) {
                        prices[coin] = [];
                    }
                    prices[coin].push({
                        x: new Date(),
                        y: data[coin].USD
                    });
                }
                var options = {
                    exportEnabled: true,
                    animationEnabled: true,
                    title: {
                        text: selectedCoins.map(sC => sC.id).join(' vs ')
                    },
                    subtitles: [{
                        text: "Click Legend to Hide or Unhide Data Series"
                    }],
                    axisX: {
                        title: "Date"
                    },
                    axisY: {
                        title: "Profit in USD",
                        titleFontColor: "#C0504E",
                        lineColor: "#C0504E",
                        labelFontColor: "#C0504E",
                        tickColor: "#C0504E"
                    },
                    axisY2: {
                        title: "Profit in USD",
                        titleFontColor: "#C0504E",
                        lineColor: "#C0504E",
                        labelFontColor: "#C0504E",
                        tickColor: "#C0504E"
                    },
                    toolTip: {
                        shared: true
                    },
                    legend: {
                        cursor: "pointer",
                    },
                    data: [
                        ...Object.entries(prices).map(([key, value]) => ({
                            type: "spline",
                            name: key,
                            showInLegend: true,
                            xValueFormatString: "MMM YYYY",
                            yValueFormatString: "#,##0 Units",
                            dataPoints: value
                        }))
                    ]
                };
                try {
                    $("#liveReports")?.CanvasJSChart(options)?.render();
                }
                catch (e) {
                }
            }, 2000);
        }
    });
});





