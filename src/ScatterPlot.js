//Charles Bruner 4/10/2023
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

function ScatterPlot(props) {
    const data = props.data;
    const scatterRef = useRef(null);
    const [conatinerWidth, setContainerWidth] = useState(0);
    const [highlightValues, setHighlightValues] = useState([]);

    //   const [conatinerHeight, setContainerHeight] = useState(0);
    //   const windowSize = useWindowResize();
    //console.log(data);
    useEffect(
        () => {
            function isHighlighted(d) {
                //console.log(d)
                // console.log(highlightValues)
                return highlightValues.includes(d.id);
            }
            //console.log(props.sharedData)
            setHighlightValues(props.sharedData);
            //console.log(highlightValues)
            setContainerWidth(scatterRef.current.clientWidth);
            //   setContainerHeight(scatterRef.current.height);
            const handleResize = () => {
                setContainerWidth(scatterRef.current.clientWidth);
                // setContainerHeight(scatterRef.current.height);
            };

            window.addEventListener("resize", handleResize);

            let scatterContainer = d3
                .select(scatterRef.current)
                .append("svg")
                .attr("class", "scatterContainer")
                .attr("width", "98%")
                .attr("height", "90%");

            // Add the title to the scatterplot
            scatterContainer
                .append("text")
                .attr("x", "50%") // center the text horizontally
                .attr("y", props.margin.top) // position the text at the top of the SVG
                .attr("text-anchor", "middle") // center the text horizontally
                .text("Scatter Plot");

            //sets up invisible tooltip
            let tooltip = d3
                .select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            let scatterRect = scatterContainer.node().getBoundingClientRect();
            // Set up scales for scatterplot
            let xScaleScatter = d3
                .scaleTime()
                .range([props.margin.left, scatterRect.width - props.margin.right]);

            let yScaleScatter = d3
                .scaleLinear()
                .range([scatterRect.height - props.margin.bottom, props.margin.top]);

            // Set up axes
            let xAxis = d3.axisBottom(xScaleScatter);
            let yAxis = d3.axisLeft(yScaleScatter);

            scatterContainer.append("g").attr("class", "x axis").call(xAxis);
            scatterContainer.append("g").attr("class", "y axis").call(yAxis);

            //console.log(scatterRect.width);

            scatterRect = scatterContainer.node().getBoundingClientRect();
            xScaleScatter.domain(d3.extent(data, (d) => d.Week));
            yScaleScatter.domain([
                0,
                d3.max(data, (d) => d3.max([d.javascript, d.python, d.java])),
            ]);

            // Update axis positions
            scatterContainer
                .select(".x.axis")
                .attr(
                    "transform",
                    `translate(0, ${scatterRect.height - props.margin.bottom})`
                )
                .call(xAxis);

            scatterContainer
                .select(".y.axis")
                .attr("transform", `translate(${props.margin.left}, 0)`)
                .call(yAxis);

            // Update chart dimensions
            scatterContainer
                .attr("width", scatterRect.width)
                .attr("height", scatterRect.height);

            // Plot the data points for JavaScript
            scatterContainer
                .selectAll(".javascript")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "javascript")
                .attr("cx", (d) => xScaleScatter(d.Week))
                .attr("cy", (d) => yScaleScatter(d.javascript))
                .attr("r", 5)
                .style("fill", "red")
                .attr("class", d => isHighlighted(d) ? "highlighted" : "")
                // Add event listeners for tooltip
                .on("mouseover", function (event, d) {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip
                        .html(
                            "Javascript <br>" +
                            d.javascript +
                            "<br>" +
                            d.Week.toLocaleDateString()
                        )
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

            // Plot the data points for Python
            scatterContainer
                .selectAll(".python")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "python")
                .attr("class", d => isHighlighted(d) ? "highlighted" : "")
                .attr("cx", (d) => xScaleScatter(d.Week))
                .attr("cy", (d) => yScaleScatter(d.python))
                .attr("r", 5)
                .style("fill", "blue")
                .on("mouseover", function (event, d) {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip
                        .html(
                            "Python <br>" + d.python + "<br>" + d.Week.toLocaleDateString()
                        )
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

            // Plot the data points for Java
            scatterContainer
                .selectAll(".java")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "java")
                .attr("class", d => isHighlighted(d) ? "highlighted" : "")
                .attr("cx", (d) => xScaleScatter(d.Week))
                .attr("cy", (d) => yScaleScatter(d.java))
                .attr("r", 5)
                .style("fill", "green")
                .on("mouseover", function (event, d) {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip
                        .html("Java <br>" + d.java + "<br>" + d.Week.toLocaleDateString())
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

            // Define line generators
            let lineJavascript = d3
                .line()
                .x((d) => xScaleScatter(d.Week))
                .y((d) => yScaleScatter(d.javascript));

            let linePython = d3
                .line()
                .x((d) => xScaleScatter(d.Week))
                .y((d) => yScaleScatter(d.python));

            let lineJava = d3
                .line()
                .x((d) => xScaleScatter(d.Week))
                .y((d) => yScaleScatter(d.java));

            // Create path elements for each language's data points
            scatterContainer
                .selectAll(".line-javascript")
                .data([data])
                .join("path")
                .attr("class", "line-javascript")
                .attr("d", lineJavascript)
                .style("fill", "none")
                .style("stroke", "red")
                .on("mouseover", function (event, d) {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip
                        .html("Javascript")
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

            scatterContainer
                .selectAll(".line-python")
                .data([data])
                .join("path")
                .attr("class", "line-python")
                .attr("d", linePython)
                .style("fill", "none")
                .style("stroke", "blue")
                .on("mouseover", function (event, d) {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip
                        .html("Python")
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

            scatterContainer
                .selectAll("line-java")
                .data([data])
                .join("path")
                .attr("class", "line-java")
                .attr("d", lineJava)
                .style("fill", "none")
                .style("stroke", "green")
                .on("mouseover", function (event, d) {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip
                        .html("Java")
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

            // Cleanup function to remove the scatter plot when the component is unmounted
            return () => scatterContainer.remove();
        },
        [
            conatinerWidth,
            data,
            props.margin.bottom,
            props.margin.left,
            props.margin.right,
            props.margin.top,
            props.sharedData,
            highlightValues
        ]
        // [conatinerHeight]
    );

    return <div ref={scatterRef} className="scatter"></div>;
}
export default ScatterPlot;