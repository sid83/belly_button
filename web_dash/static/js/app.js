function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  let selector = d3.select("#sample-metadata");
  selector.html("");
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`/metadata/${sample}`).then(successHandle, errorHandle);
  function errorHandle(error) {
    console.log(error);
    selector.html("<h2>ERROR in Retrieving Data</h2>")
  }
  function successHandle(data) {
    // console.log(data);
    Object.entries(data).forEach(([key, value]) => {
      selector.append('p').text(`${key}: ${value}`)
    })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  }

    
    
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(successHandle, errorHandle);
  function errorHandle(error) {error=> console.log(error)};

  function successHandle(sampleData) {
    // console.log(sampleData);
    // trace and layout for bubble chart
    makeBubbleChart(sampleData);   // function to make pie chart
    makePieChart(sampleData);   // function to make pie chart
  }
  
  function makeBubbleChart(data) {
    const trace_bubble = {
      x: data.otu_ids,
      y: data.sample_values,
      type: "scatter",
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      },
      text: data.otu_labels
    };
    const layout_bubble = {
      title: "",
      showlegend: false,
      yaxis: {
        title: "Sample Values",
        autorange: true,
        // range: [0, sampleData.sample_values]
      },
      xaxis: {
        title: "otu_ids",
        autorange: true
      }
      // width: 600
    };
    // console.log(trace_bubble)
    // Plotting Bubble Chart
    const bubbleElement = document.getElementById("bubble")
    // bubbleElement.html("")
    Plotly.newPlot(bubbleElement, [trace_bubble], layout_bubble);

  }

  function makePieChart(data) {
      // Sort and Slice
      sortedData = zipSortSlice(data.otu_ids, data.otu_labels, 
        data.sample_values);  // returns sortedData as array of top 10 objects
      console.log(sortedData)
      const tracePie = {
        values: sortedData.map(d=>d.sample_values),
        labels: sortedData.map(d=>d.otu_ids),
        hovertext: sortedData.map(d=>d.otu_labels),
        hoverinfo: "hovertext",
        type: "pie"
      }
      const layoutPie = {
        title: "pie chart"
      } 
      console.log(tracePie)
      // const pieElement = document.getElementById("pie")
      // console.log(pieElement)
      Plotly.newPlot('pie', [tracePie], layoutPie)
  
  }
  function zipSortSlice(a, b, c) {
    // console.log(a);
    var zipped=[];
    for (let i=0;i<a.length;i++) 
    { zipped.push({
        otu_ids: a[i], otu_labels: b[i], sample_values: c[i]
      })
    };
    console.log(zipped)
    // sort and slice the zipped array
    zipped.sort((x,y)=> y.sample_values - x.sample_values);
    return zippedSortSliced = zipped.slice(0,9);
    
  
  }
}

// function to zip the parallel arrays to array of objects to sort and 
// (a, b, c are parallel arrays)


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
