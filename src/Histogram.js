//Charles Bruner 4/10/2023
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
function Histogram(props) {
    const data = props.data;
    const histoRef = useRef(null);
    const [conatinerWidth, setContainerWidth] = useState(0);
    useEffect(() => {
        setContainerWidth(histoRef.current.clientWidth);
        //   setContainerHeight(scatterRef.current.height);
        const handleResize = () => {
            setContainerWidth(histoRef.current.clientWidth);
            // setContainerHeight(scatterRef.current.height);
        };

        window.addEventListener("resize", handleResize);

        let histogramContainer = d3
            .select(histoRef.current)
            .append("svg")
            .attr("class", "histogramContainer")
            .attr("width", "100%")
            .attr("height", "100%");

        // Add the title to the histogram
        histogramContainer
            .append("text")
            .attr("x", "50%")
            .attr("y", props.margin.top - 5)
            .attr("text-anchor", "middle")
            .text("Histogram");

        //sets up invisible tooltip
        let tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        let histoRect = histogramContainer.node().getBoundingClientRect();

        histoRect = histogramContainer.node().getBoundingClientRect();

        let javascriptAvg = d3.mean(data, (d) => d.javascript);
        let pythonAvg = d3.mean(data, (d) => d.python);
        let javaAvg = d3.mean(data, (d) => d.java);

        // Put the averages into an array
        let pieData = [
            { language: "JavaScript", value: javascriptAvg },
            { language: "Python", value: pythonAvg },
            { language: "Java", value: javaAvg },
        ];

        // Set up the scales
        let histoXScale = d3
            .scaleBand()
            .domain(d3.range(pieData.length))
            .range([props.margin.left, histoRect.width - props.margin.right])
            .paddingInner(0.1);

        let histoYScale = d3
            .scaleLinear()
            .domain([0, d3.max(pieData, (d) => d.value)])
            .range([histoRect.height - props.margin.bottom, props.margin.top]);

        // Define the colors for each bar
        let histoColorScale = d3
            .scaleOrdinal()
            .domain(pieData.map((d) => d.language))
            .range(["red", "blue", "green"]);

        // Create the histogram bars

        histogramContainer
            .append("g")
            .selectAll("rect")
            .data(pieData)
            .join("rect")
            .attr("x", (d, i) => histoXScale(i) - 14)
            .attr("y", (d) => histoYScale(d.value) + 5)
            .attr("width", histoXScale.bandwidth())
            .attr(
                "height",
                (d) => histoRect.height - props.margin.bottom - histoYScale(d.value)
            )
            .attr("fill", (d) => histoColorScale(d.language))
            .attr("stroke", "black")
            .attr("stroke-width", "3")
            //tooltip for histograms
            .on("mouseover", function (event, d) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip
                    .html(Math.round(d.value))
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 10 + "px");
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 10 + "px");
            })
            .on("mouseout", function (event) {
                tooltip.transition().duration(500).style("opacity", 0);
            });
        return () => histogramContainer.remove();
    }, [
        conatinerWidth,
        data,
        props.margin.bottom,
        props.margin.left,
        props.margin.right,
        props.margin.top,
    ]);
    return <div ref={histoRef} className="histo"></div>;
}

export default Histogram;