// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata

    // Filter the metadata for the object with the desired sample number
    const filteredmetadata = data.metadata.find(sampleobj => sampleobj.id === sample);

    // Use d3 to select the panel with id of `#sample-metadata`
      // Use `.html("") to clear any existing metadata
    let samplemetapanel=d3.select("#sample-metadata");
    samplemetapanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredmetadata).forEach(([key, value]) => {
      d3.select("#sample-metadata").append("h6").text(`${key.toUpperCase()}:${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filtersample = samples.filter(sampleobj => sampleobj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filtersample.otu_ids;
    let otu_labels = filtersample.otu_labels;
    let sample_values = filtersample.sample_values;

    // Build a BUBBLE Chart
    let bubblechart = {
      title: 'bacteria cultures per sample',
      margin: { t: 0 },
      hovermode: 'closest',
      xaxis: { title: 'out id' },
      margin: { t: 20 }
    };

    let bubbledatavalues = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "earth"
      }
    }];

    // Render the BUBBLE Chart
    Plotly.newPlot('bubble', bubbledatavalues, bubblechart);

    // For the BAR CHART, map the otu_ids to a list of strings for your yticks
    let barchartsample = {
      title: 'Top 10 Bacetria Cultures Found',
      margin: { t: 20, l: 120 }
    };

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let yticks = otu_ids.slice(0, 10).map(otuid => `OTU ${otuid}`).reverse();
    let barchart = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    // Render the Bar Chart
    Plotly.newPlot('bar', barchart, barchartsample);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let samplenames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#seldataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    samplenames.forEach(sample => {
      dropdownMenu.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    let firstsample = samplenames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstsample);
    buildMetadata(firstsample);
  });
}

// Function for event listener
function optionChanged(newsample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newsample);
  buildMetadata(newsample);
}

// Initialize the dashboard
init();
