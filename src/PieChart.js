//Charles Bruner 4/10/2023
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

function PieChart(props) {
    const data = props.data;
    const pieRef = useRef(null);
    const [conatinerWidth, setContainerWidth] = useState(0);
    useEffect(() => {
        setContainerWidth(pieRef.current.clientWidth);
        //   setContainerHeight(scatterRef.current.height);
        const handleResize = () => {
            setContainerWidth(pieRef.current.clientWidth);
            // setContainerHeight(scatterRef.current.height);
        };

        window.addEventListener("resize", handleResize);

        let pieContainer = d3
            .select(pieRef.current)
            .append("svg")
            .attr("class", "pieContainer")
            .attr("width", "100%")
            .attr("height", "100%");

        // Add the title to the pie chart
        pieContainer
            .append("text")
            .attr("x", "50%")
            .attr("y", props.margin.top - 5)
            .attr("text-anchor", "middle")
            .text("Pie Chart");

        //sets up invisible tooltip
        let tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        let pieRect = pieContainer.node().getBoundingClientRect();

        pieRect = pieContainer.node().getBoundingClientRect();
        let javascriptAvg = d3.mean(data, (d) => d.javascript);
        let pythonAvg = d3.mean(data, (d) => d.python);
        let javaAvg = d3.mean(data, (d) => d.java);

        // Put the averages into an array
        let pieData = [
            { language: "JavaScript", value: javascriptAvg },
            { language: "Python", value: pythonAvg },
            { language: "Java", value: javaAvg },
        ];

        // Set up the pie chart layout
        let pie = d3.pie().value((d) => d.value);

        // Set up the arc generator for the pie slices
        let arc = d3
            .arc()
            .innerRadius(0)
            .outerRadius(Math.min(pieRect.width, pieRect.height) / 2 - 20);

        // Create a group for the pie slices
        let slices = pieContainer
            .append("g")
            .attr(
                "transform",
                `translate(${pieRect.width / 2},${pieRect.height / 2})`
            );

        // Add the slices to the pie chart
        slices
            .selectAll(".slice")
            .data(pie(pieData))
            .enter()
            .append("path")
            .attr("class", "slice")
            .attr("d", arc)
            .attr("fill", (d) => {
                if (d.data.language === "JavaScript") {
                    return "red";
                } else if (d.data.language === "Python") {
                    return "blue";
                } else {
                    return "green";
                }
            })
            //tool tip for pie chart
            .on("mouseover", function (event, d) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip
                    .html(Math.round(d.value) + "<br>" + d.data.language)
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
        return () => pieContainer.remove();
    }, [conatinerWidth, data, props.margin.top]);
    return <div ref={pieRef} className="pie"></div>;
}

export default PieChart;