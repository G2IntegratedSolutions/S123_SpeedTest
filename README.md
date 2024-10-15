# ENTRUST Standard Internet Survey with Speed Test

This project is an interactive web page that integrates ESRI's Survey123 along with an embedded Internet Speed Test using M-Lab's NDT (Network Diagnostic Tool). It allows users to complete a survey while also providing an option to run an internet speed test, displaying the results for download speed, upload speed, and latency in a user-friendly interface.

## Features

- **Survey123 Integration**: The survey form is embedded directly into the page, allowing users to fill in relevant data about their internet connection and other details.
- **Internet Speed Test**: Utilizes the M-Lab NDT7 library to measure download and upload speeds, as well as latency. Results are displayed on two gauges and in a summary table.
- **User-Friendly Gauges**: Circular gauge indicators (download and upload) provide a visual representation of speed measurements as the test progresses.

## Usage

- **Run Survey and Speed Test**:
  - The user can interact with the survey provided by Survey123.
  - When the "Run Speed Test" button is clicked, gauges will animate to display real-time download and upload speeds.
  - The summary results are displayed in a table.
- **Hiding the Speed Test Section**:
  - Click the "X" button at the top right of the results to hide the speed test section.

## File Structure

- `index.html` - Main HTML file that embeds the Survey123 form and initializes the speed test gauges.
- `styles.css` - CSS file that styles the entire page, including the gauges and speed test section.
- `speedTest.js` - JavaScript logic for initializing the speed test and handling user interactions.

## Built With

- [ESRI Survey123](https://survey123.arcgis.com) - Embedded survey for collecting user data.
- [M-Lab NDT7](https://www.measurementlab.net/) - Internet speed test library.
- [Chart.js](https://www.chartjs.org) - Used to create the download and upload speed gauges.

