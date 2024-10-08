    // Initialize the Survey123 Web Form
    var survey123WebForm = new Survey123WebForm({
        // Replace with your actual form's item ID
        itemId: "c66e3b44bf0841efa4c72b44d5602538", // Updated survey, from Lauren
        //itemId: "0d7a173cf2224fb5bde595c994e4312d", // Full survey, from Greg
        //itemId: "d76488086d8a4fae8ab8c3a84b0496ac",  // Form 3 - testing
        container: "survey123Container"
    });

    // Register Chart.js Data Labels Plugin
    Chart.register(ChartDataLabels);

    //Variables to store the Chart objects
    var downloadChart, uploadChart;

    // Function to create a doughnut chart
    function createDoughnutChart(ctx, color) {
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [0, 500], // Initial data: [current, remaining]
                    backgroundColor: [
                        color,
                        '#e0e0e0' // Gray for the remaining part
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Important for filling the parent container
                cutout: '30%', // Thickness of the doughnut
                rotation: 0, // Start angle
                circumference: 360, // Full circle in degrees
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    },
                    datalabels: {
                        display: true,
                        formatter: function(value, context) {
                            if (context.dataIndex === 0) {
                                return value;
                            }
                            return '';
                        },
                        color: '#FFF',
                        font: {
                            weight: 'bold',
                            size: 14,
                            style: 'italic'
                            //family: 'Avenir Next'
                        },
                        anchor: 'center',
                        align: 'center'
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    
    function updateDoughnutChart(chart, value) {
        chart.data.datasets[0].data[0] = value;
        chart.data.datasets[0].data[1] = 500 - value;
        chart.update();
    }

    
    function initializeGauges() {
        if (!downloadChart && !uploadChart) {
            // Create Download Doughnut Chart
            var downloadCtx = document.getElementById('downloadGauge').getContext('2d');
            downloadChart = createDoughnutChart(downloadCtx, '#4caf50'); // Green color

            // Create Upload Doughnut Chart
            var uploadCtx = document.getElementById('uploadGauge').getContext('2d');
            uploadChart = createDoughnutChart(uploadCtx, '#2196f3'); // Blue color               
        }
    }

    // Run the NDT Speed Test
    function runSpeedTest() {
        // Disable the button to prevent multiple clicks
        const runButton = document.getElementById("runSpeedTest");
        runButton.disabled = true;
        runButton.innerText = "Running...";

        // Reset gauges and table
        updateDoughnutChart(downloadChart, 0);
        updateDoughnutChart(uploadChart, 0);
        document.getElementById("resultsTable").style.display = "none";
        document.getElementById("downloadResult").innerText = "- Mbps";
        document.getElementById("uploadResult").innerText = "- Mbps";
        document.getElementById("latencyResult").innerText = "- ms";

        // Initialize variables
        let downloadSpeed = 0;
        let uploadSpeed = 0;
        let latency = 0;

        // Start the test
        ndt7.test(
            {
                userAcceptedDataPolicy: true, // Required by M-Lab's policy
                downloadWorkerScript: 'ndt7-download-worker.min.js',
                uploadWorkerScript: 'ndt7-upload-worker.min.js'
            },
            {
                serverChosen: function(server) {
                    // Optional: Handle server selection if needed
                    //console.log('Testing to server:', server);
                },
                downloadMeasurement: function(measurement) {
                    if (measurement.Source === 'client' && measurement.Data && measurement.Data.MeanClientMbps) {
                        downloadSpeed = parseFloat(measurement.Data.MeanClientMbps).toFixed(2); // Mbps
                        var downloadValue = Math.min(downloadSpeed, 500); // Cap at 500 Mbps
                        updateDoughnutChart(downloadChart, downloadValue);
                    }
                    if (measurement.Source === 'server' && measurement.Data.TCPInfo && measurement.Data.TCPInfo.MinRTT) {
                        latency = (measurement.Data.TCPInfo.MinRTT / 1000).toFixed(2); // ms
                        serverIP = measurement.Data.ConnectionInfo.Server;                                                                                  
                    }
                },
                uploadMeasurement: function(measurement) {
                    if (measurement.Source === 'client' && measurement.Data && measurement.Data.MeanClientMbps) {
                        uploadSpeed = parseFloat(measurement.Data.MeanClientMbps).toFixed(2); // Mbps
                        var uploadValue = Math.min(uploadSpeed, 500); // Cap at 500 Mbps
                        updateDoughnutChart(uploadChart, uploadValue);
                    }
                }
            }
        ).then(() => {
            // Populate the survey fields with results
            survey123WebForm.setQuestionValue({'download_speed': parseFloat(downloadSpeed)});
            survey123WebForm.setQuestionValue({'upload_speed': parseFloat(uploadSpeed)});
            survey123WebForm.setQuestionValue({'latency': parseFloat(latency)});
            //console.log('Server IP:', serverIP);

            // Populate the ouput table with results
            document.getElementById("downloadResult").innerText = `${downloadSpeed} Mbps`;
            document.getElementById("uploadResult").innerText = `${uploadSpeed} Mbps`;
            document.getElementById("latencyResult").innerText = `${latency} ms`;
            document.getElementById("resultsTable").style.display = "table";

            // Re-enable the button
            runButton.disabled = false;
            runButton.innerText = "Run Speed Test";
        }).catch((error) => {
            
            alert("Speed test failed. Please try again.");
            console.error('NDT7 Error:', error);

            // Re-enable the button
            runButton.disabled = false;
            runButton.innerText = "Run Speed Test";
        });
    }

    // Add event listener to the button
    document.getElementById("runSpeedTest").addEventListener("click", runSpeedTest);

    // Add event listener to the Close button
    document.getElementById("closeSpeedTestSection").addEventListener("click", function() {
        // Hide the speed test section
        document.getElementById('speedTestSection').style.display = 'none';
    });

    // Function to handle changes in the how_is_this_location_connected question
    function handleBroadbandConnectionChange(value) {
        if (value ===  null || value === undefined || value === '') {
            // Hide the speed test section
            document.getElementById('speedTestSection').style.display = 'none';    
        }
        else {        
            // Show the speed test section
            document.getElementById('speedTestSection').style.display = 'flex';
            // Initialize gauges if not already done
            initializeGauges();
        } 
    }

    // Wait for survey to be fully loaded
    survey123WebForm.setOnFormLoaded(function() {
        // Listen for changes to the 'how_is_this_location_connected' question
        survey123WebForm.setOnQuestionValueChanged(function(event) {
            if (event.field === 'how_is_this_location_connected') { 
                handleBroadbandConnectionChange(event.value);
            }
        });

        // Check the initial value of 'how_is_this_location_connected' question
        // change name of question to match the survey
        survey123WebForm.getQuestionValue('how_is_this_location_connected').then(function(question) {
            var value = question.value;
            handleBroadbandConnectionChange(value);
        });
    });

