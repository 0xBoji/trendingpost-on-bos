const dataP =
  props.dataP && Array.isArray(props.dataP)
    ? props.dataP.map((item) => parseFloat(item) || 0)
    : [1, 2, 3, 4, 5, 5, 6, 6, 6, 6, 4, 5, 4, 4, 5];

const backgroundcolorP = props.backgroundcolorP || [
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
];

const borderColorP = props.bordercolorP || [
  "#00e592",
  "#00e592",
  "#00e592",
  "#00e592",
  "#00e592",
  "#00e592",
  "#00e592",
  "#00e592",
  "#00e592",
  "#00e592",
  "#00e592",
  "#00e592",
  "#00e592",
  "#00e592",
  "#00e592",
];

const labelP = props.labelP || [
  "Jan",
  "Feb",
  "Mar",
  "April",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "dá",
  "dsa",
  "dsa",
];

const labelN = props.labelN || "test";
const data = {
  labels: labelP,
  datasets: [
    {
      label: labelN,
      data: dataP,
      backgroundColor: backgroundcolorP,
      borderColor: bordercolorP,
      borderWidth: 1,
    },
  ],
};

const config = {
  type: "bar",
  data: data,
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

const chartData = props.chartData ?? data; // Use your data or fall back to default data
const chartOptions = props.chartOptions ?? config; // Use your config or fall back to default config

const code = `
<html>
<head>
<script src="https://unpkg.com/chart.js@4.3.0/dist/chart.umd.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.contentWindow.js"></script>
</head>
<body>
<canvas id="myChart"></canvas>
</body>
<script>
    function createChart(ctx, data, options) {
        new Chart(ctx, {
            type: options.type,
            data: data,
            options: options.options
        });
    }

    window.addEventListener('message', function(event) {
    }, false);

    const handleMessage = (m) => {
        const { data, options } = m;
        const ctx = document.getElementById('myChart').getContext('2d');
        createChart(ctx, data, options);
    };

    window.iFrameResizer = {
        onMessage: handleMessage
    }
</script>
</html>

`;
return (
  <>
    <iframe
      iframeResizer
      className="w-100"
      srcDoc={code}
      message={{ data: chartData, options: chartOptions }}
    />
  </>
);
