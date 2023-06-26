import React, { useEffect, useRef, useState } from "react";
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

const maxHighScore = 102; // Game finishes when the score reaches 102

function TwoScoreLine({ userScore, stage, onFinish }) {
  const ref = useRef();
  const [finishedGame, setFinishedGame] = useState(false);
  const [previousScore, setPreviousScore] = useState(userScore);
  const [scoreChangeMsg, setScoreChangeMsg] = useState(null); // New state variable

  useEffect(() => {
    if (userScore !== previousScore) {
      const diff = userScore - previousScore;
      setScoreChangeMsg(
        `You agree with ${100 - diff}%. Your score increased by 100 - ${
          100 - diff
        } = ${diff}`
      );
      setPreviousScore(userScore);
    }
  }, [userScore]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const svgWidth = +svg.node().getBoundingClientRect().width;
    const xScale = d3
      .scaleLinear()
      .domain([0, maxHighScore])
      .range([0, svgWidth]);
    const score = data[stage];

    // Background lines and labels
    const lineInfo = [
      { y: 100, class: "user", color: "green", label: "You", score: userScore },
      {
        y: 170,
        class: "avg",
        color: "black",
        label: "Others",
        score: score.average_score,
      },
    ];

    lineInfo.forEach((line) => {
      if (svg.select(`.${line.class}-bg-line`).empty()) {
        // Background line
        svg
          .append("line")
          .attr("class", `${line.class}-bg-line`)
          .attr("x1", xScale(0))
          .attr("x2", xScale(maxHighScore))
          .attr("y1", line.y)
          .attr("y2", line.y)
          .attr("stroke", "#ddd")
          .attr("stroke-width", 2);

        // Label
        svg
          .append("text")
          .attr("class", `${line.class}-label`)
          .attr("x", 0)
          .attr("y", line.y)
          .attr("dy", "-1em")
          .text(line.label);

        // Tick mark
        svg
          .append("circle")
          .attr("class", `${line.class}-tick`)
          .attr("cx", xScale(line.score))
          .attr("cy", line.y)
          .attr("r", 5)
          .attr("fill", line.color);

        // Tick text
        svg
          .append("text")
          .attr("class", `${line.class}-tick-text`)
          .attr("x", xScale(line.score))
          .attr("y", line.y)
          .attr("dx", "1em")
          .attr("dy", "1em")
          .text(line.score);
      }
    });

    // Update elements
    svg
      .selectAll(".user-tick")
      .data([userScore])
      .transition()
      .duration(1000)
      .attr("cx", (d) => xScale(Math.min(d, maxHighScore)));

    svg
      .selectAll(".avg-tick")
      .data([score.average_score])
      .transition()
      .duration(1000)
      .attr("cx", (d) => xScale(Math.min(d, maxHighScore)));

    svg
      .selectAll(".user-tick-text")
      .data([userScore])
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(Math.min(d, maxHighScore)))
      .text((d) => d);

    svg
      .selectAll(".avg-tick-text")
      .data([score.average_score])
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(Math.min(d, maxHighScore)))
      .text((d) => d);

    // Check if game is finished
    if (
      (userScore >= maxHighScore || score.average_score >= maxHighScore) &&
      !finishedGame
    ) {
      setFinishedGame(true);
      onFinish?.();
    }
  }, [userScore, stage, finishedGame, onFinish]);

  return (
    <div className="scoreLines">
      {scoreChangeMsg && <div>{scoreChangeMsg}</div>}
      <svg ref={ref} style={{ width: "100%", height: "200px" }} />
    </div>
  );
}

export default TwoScoreLine;
