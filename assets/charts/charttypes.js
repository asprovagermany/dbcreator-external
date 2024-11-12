const regex = /\(([^\d)]+)\)/;
// Define a ChartWidget constructor function

// Switch case einbauen für die verschiedenen typen
function ChartWidget(id, chartType, chartData) {
  this.id = id;
  this.chartType = chartType;
  this.chartData = chartData;

  switch (this.chartType) {
    case "abs":
      let absWidget = document.getElementById(`chart-${id}`);
      absWidget.innerHTML = `<div class="abs"><h3>${this.chartData[0].data}</h3></div>`;

    case "bar":
      this.createChart = function () {
        let options = {
          chart: {
            type: this.chartType,
            height: "85%",
            events: {
              animationEnd: (chart) => {
                chart.windowResizeHandler();
              },
            },
          },
          legend: {
            position: "top",
            horizontalAlign: "center",
          },
          series: transformData(this.chartData, [
            ["name", "name"],
            ["data", "data"],
          ]),
          xaxis: {
            categories: transformData(this.chartData, [
              ["code", "code"],
            ])[0].map((elem) => elem.replace(")", "").split("(", 2)),
          },
        };
        let chart = new ApexCharts(
          document.querySelector(`#chart-${id}`),
          options
        );
        chart.render();
      };

      break;

    case "horizontalbar":
      this.createChart = function () {
        let options = {
          chart: {
            type: "bar",
            height: "85%",
            events: {
              animationEnd: (chart) => {
                chart.windowResizeHandler();
              },
            },
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          legend: {
            position: "top",
            horizontalAlign: "center",
          },
          series: transformData(this.chartData, [
            ["name", "name"],
            ["data", "data"],
          ]),
          xaxis: {
            categories: transformData(this.chartData, [
              ["code", "code"],
            ])[0].map((elem) => elem.replace(")", "").split("(", 2)),
          },
        };

        let chart = new ApexCharts(
          document.querySelector(`#chart-${id}`),
          options
        );
        chart.render();
      };

      break;

    case "line":
      this.createChart = function () {
        let options = {
          chart: {
            type: this.chartType,
            height: "85%",
            events: {
              animationEnd: (chart) => {
                chart.windowResizeHandler();
              },
            },
          },
          legend: {
            position: "top",
            horizontalAlign: "center",
          },
          series: transformData(this.chartData, [
            ["name", "name"],
            ["data", "data"],
          ]),
          xaxis: {
            categories: transformData(this.chartData, [
              ["code", "code"],
            ])[0].map((elem) => elem.replace(")", "").split("(", 2)),
          },
        };

        let chart = new ApexCharts(
          document.querySelector(`#chart-${id}`),
          options
        );
        chart.render();
      };
      break;

    case "radar":
      this.createChart = function () {
        let options = {
          chart: {
            type: this.chartType,
            height: "85%",
            events: {
              animationEnd: (chart) => {
                chart.windowResizeHandler();
              },
            },
          },
          plotOptions: {
            radar: {
              polygons: {
                strokeColor: "#e8e8e8",
                fill: {
                  colors: ["#f8f8f8", "#fff"],
                },
              },
            },
          },
          stroke: {
            show: true,
            width: 1,
          },
          markers: {
            size: 5,
            hover: {
              size: 10,
            },
          },
          legend: {
            position: "top",
            horizontalAlign: "center",
          },
          series: transformData(groupByCode(this.chartData), [
            ["code", "name"],
            ["data", "data"],
          ]),
          xaxis: {
            categories: transformData(this.chartData, [["name", "name"]]).map(
              (e) => {
                return e.includes("(")
                  ? splitStringNicely(e.replace(regex, ""))
                  : splitStringNicely(e);
              }
            ),
          },
          dataLabels: {
            enabled: false,
            background: {
              enabled: true,
              borderRadius: 2,
            },
          },
          yaxis: {
            labels: {
              formatter: function (val, i) {
                if (i % 2 === 0) {
                  return val;
                } else {
                  return val.toFixed(2);
                }
              },
            },
            tickAmount: 10,
          },
        };
        let chart = new ApexCharts(
          document.querySelector(`#chart-${id}`),
          options
        );
        chart.render();
      };
      break;

    case "pie":
      this.createChart = function () {
        let options = {
          chart: {
            type: this.chartType,
            height: "85%",
            events: {
              animationEnd: (chart) => {
                chart.windowResizeHandler();
              },
            },
          },
          legend: {
            position: "top",
            horizontalAlign: "center",
          },
          series: appendAllChild(this.chartData, "data").map((elem) =>
            parseFloat(elem)
          ),
          labels: appendAllChild(this.chartData, "name"),
        };

        let chart = new ApexCharts(
          document.querySelector(`#chart-${id}`),
          options
        );
        chart.render();
      };
      break;

    case "donut":
      this.createChart = function () {
        let options = {
          chart: {
            type: this.chartType,
            height: "85%",
            events: {
              animationEnd: (chart) => {
                chart.windowResizeHandler();
              },
            },
          },
          legend: {
            position: "top",
            horizontalAlign: "center",
          },
          series: appendAllChild(this.chartData, "data").map((elem) =>
            parseFloat(elem)
          ),
          labels: appendAllChild(this.chartData, "name"),
        };
        let chart = new ApexCharts(
          document.querySelector(`#chart-${id}`),
          options
        );
        chart.render();
      };
      break;

    case "gauge":
      this.createChart = function () {
        let options = {
          chart: {
            height: "85%",
            type: "radialBar",
            events: {
              animationEnd: (chart) => {
                chart.windowResizeHandler();
              },
            },
          },
          legend: {
            position: "top",
            horizontalAlign: "center",
          },

          series: transformData(this.chartData, [["data", "data"]]),
          colors: ["#20E647"],
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
              hollow: {
                margin: 10,
                size: "70%",
                background: "#293450",
                imageHeight: 10,
                imageClipped: true,
              },
              track: {
                show: true,
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 0,
                  blur: 4,
                  opacity: 0.15,
                },
              },
              dataLabels: {
                name: {
                  offsetY: -10,
                  color: "#fff",
                  fontSize: "13px",
                },
                value: {
                  color: "#fff",
                  fontSize: "30px",
                  show: true,
                },
              },
            },
          },
          fill: {
            type: "gradient",
            gradient: {
              shade: "dark",
              type: "vertical",
              gradientToColors: ["#87D4F9"],
              stops: [0, 100],
            },
          },
          stroke: {
            lineCap: "round",
          },
          labels: transformData(this.chartData, [["name", "name"]]),
        };
        let chart = new ApexCharts(
          document.querySelector(`#chart-${id}`),
          options
        );
        chart.render();
      };
      break;

    case "radialBar":
      this.createChart = function () {
        let options = {
          series: transformData(this.chartData, [["data", "data"]]),
          chart: {
            events: {
              animationEnd: (chart) => {
                chart.windowResizeHandler();
              },
            },
            height: "85%",
            type: "radialBar",
          },
          plotOptions: {
            radialBar: {
              offsetY: 0,
              startAngle: 0,
              endAngle: 270,
              hollow: {
                margin: 5,
                size: "30%",
                background: "transparent",
                image: undefined,
              },
              dataLabels: {
                name: {
                  show: false,
                },
                value: {
                  show: false,
                },
              },
              barLabels: {
                enabled: true,
                useSeriesColors: true,
                margin: 8,
                fontSize: "16px",
                formatter: function (seriesName, opts) {
                  return (
                    seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
                  );
                },
              },
            },
          },
          labels: transformData(this.chartData, [["name", "name"]]),
        };

        let chart = new ApexCharts(
          document.querySelector(`#chart-${id}`),
          options
        );
        chart.render();
      };
      break;
  }
}
