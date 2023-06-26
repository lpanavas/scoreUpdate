import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const data = {
  0: { low_score: 0, average_score: 0, high_score: 49 },
  1: { low_score: 0, average_score: 19, high_score: 49 },
  2: { low_score: 0, average_score: 38, high_score: 98 },
  3: { low_score: 0, average_score: 55, high_score: 147 },
  4: { low_score: 0, average_score: 70, high_score: 179 },
  5: { low_score: 0, average_score: 85, high_score: 228 },
  6: { low_score: 0, average_score: 102, high_score: 272 },
};

const maxHighScore = Math.max(...Object.values(data).map((d) => d.high_score));

function ScoreLine({ userScore, stage }) {
  const ref = useRef();
  console.log(userScore, stage);
  useEffect(() => {
    const svg = d3.select(ref.current);
    const svgWidth = +svg.node().getBoundingClientRect().width;
    const score = data[stage];
    const xScale = d3
      .scaleLinear()
      .domain([0, score.high_score])
      .range([0, svgWidth]);
    const colorScale = d3
      .scaleLinear()
      .domain([0, maxHighScore])
      .range(["blue", "red"]);

    // If it's the first time, add all elements. If not, only update necessary ones.
    if (svg.select("line").empty()) {
      // Add line for current stage
      svg
        .append("line")
        .attr("x1", xScale(0)) // low end of the line always at 0
        .attr("x2", xScale(maxHighScore)) // high end of the line always at max high score
        .attr("y1", 50)
        .attr("y2", 50)
        .attr("stroke", colorScale(score.average_score))
        .attr("stroke-width", 2);

      // Add vertical line for average
      svg
        .append("line")
        .attr("class", "avg-line")
        .attr("x1", xScale(score.average_score))
        .attr("x2", xScale(score.average_score))
        .attr("y1", 40)
        .attr("y2", 60)
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      // Add circle for user score
      svg
        .append("circle")
        .attr("class", "user-circle")
        .attr("cx", xScale(userScore))
        .attr("cy", 50)
        .attr("r", 5)
        .attr("fill", "green");

      // Add text for low, average, high
      svg
        .append("text")
        .attr("class", "low-text")
        .attr("x", 0)
        .attr("y", 80)
        .text("Low");
      svg
        .append("text")
        .attr("class", "avg-text")
        .attr("x", xScale(score.average_score))
        .attr("y", 80)
        .text("Avg");
      svg
        .append("text")
        .attr("class", "high-text")
        .attr("x", svgWidth)
        .attr("y", 80)
        .attr("style", "text-anchor: end;")
        .text("High");
    }

    // Update elements
    svg.select("line").attr("stroke", colorScale(score.average_score));
    svg
      .select(".user-circle")
      .transition()
      .duration(1000)
      .attr("cx", xScale(userScore));
    svg
      .select(".avg-line")
      .transition()
      .duration(1000)
      .attr("x1", xScale(score.average_score))
      .attr("x2", xScale(score.average_score));
    svg.select(".avg-text").attr("x", xScale(score.average_score)).text("Avg");
  }, [userScore, stage]);

  return <svg ref={ref} style={{ width: "100%", height: "200px" }} />;
}

export default ScoreLine;
