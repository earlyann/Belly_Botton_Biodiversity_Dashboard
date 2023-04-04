// Read in the data from the URL and log it to the console for verification
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    console.log(data);

    // Set the initial sample and data for the plot
    var dropdownMenu = d3.select("#selDataset");

    // Populate the dropdown menu with Test Subject ID Numbers
    data.names.forEach(function(name) {
        dropdownMenu.append("option").text(name).property("value", name);
    });

    // Update the plot when a new sample is selected from the dropdown menu
    dropdownMenu.on("change", optionChanged);

    // This function is called when a dropdown menu item is selected
    function optionChanged(selectedValue) {
        d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
            let dropdownMenu = d3.select("#selDataset");
            let selectedName = selectedValue || dropdownMenu.property("value");
            let sample = data.samples.find(sample => sample.id === selectedName);

            // Bar chart
            let sampleValues = sample.sample_values.slice(0, 10).reverse();
            let otuIds = sample.otu_ids.slice(0, 10).map(id => "OTU " + id).reverse();
            let otuLabels = sample.otu_labels.slice(0, 10).reverse();
            Plotly.update("bar", { x: [sampleValues], y: [otuIds], text: [otuLabels] });

            // Bubble chart
            createBubbleChart(sample);

            // Update metadata
            let metadata = data.metadata.find(meta => meta.id == selectedName);
            updateMetaData(metadata);
        });
    }

    // Create a bubble chart for the selected sample
    function createBubbleChart(sample) {
        let trace = {
            x: sample.otu_ids,
            y: sample.sample_values,
            mode: 'markers',
            marker: {
                size: sample.sample_values,
                color: sample.otu_ids,
                colorscale: 'Earth'
            },
            text: sample.otu_labels
        };

        let data = [trace];

        let layout = {
            title: 'OTU ID vs Sample Values',
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' }
        };

        Plotly.newPlot('bubble', data, layout);
    }

    // Update the metadata panel with the selected sample's metadata
    function updateMetaData(metadata) {
        let metaDataDiv = d3.select("#sample-metadata");
        metaDataDiv.html(""); // Clear the existing metadata
    
        Object.entries(metadata).forEach(([key, value]) => {
            metaDataDiv.append("p").text(`${key}: ${value}`);
        });
    }

    // Initialize the page with the default plot
    function init() {
        // This function creates the initial plot and is called at the end of the data load
        let initialSample = data.samples[0];

        // Bar chart
        let sampleValues = initialSample.sample_values.slice(0, 10).reverse();
        let otuIds = initialSample.otu_ids.slice(0, 10).map(id => "OTU " + id).reverse();
        let otuLabels = initialSample.otu_labels.slice(0, 10).reverse();
        let trace = {
            x: sampleValues,
            y: otuIds,
            type: "bar",
            orientation: "h",
            text: otuLabels
        };
        let plotData = [trace];
        let layout = {
            title: "Top 10 OTUs Found in Individual",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" },
            margin: { t: 75,
                      l: 125, }
        };
        Plotly.newPlot("bar", plotData, layout);

        // Bubble chart
        createBubbleChart(initialSample);

        // Update metadata with values for the starting sample
        let initialMetaData = data.metadata.find(meta => meta.id == initialSample.id);
        updateMetaData(initialMetaData);
    }

    // Call the init function to create the initial plot when the page is loaded
    init();
});
