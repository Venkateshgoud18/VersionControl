import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import "./heatmap.css";

const Heatmap = ({ values }) => {
  return (
    <div className="heatmap-container">
      <h2>Contribution Heatmap</h2>
      <CalendarHeatmap
        startDate={new Date(new Date().getFullYear(), 0, 1)}
        endDate={new Date()}
        values={values}
        classForValue={(value) => {
            console.log("value passed:", value);
            if (!value) return "color-empty";
            if (value.count >= 4) return "color-github-4";
            return `color-github-${value.count}`;
          }}
          
          
        tooltipDataAttrs={(value) => {
          if (!value || !value.date) {
            return null;
          }
          return {
            "data-tip": `${value.date}: ${value.count} contributions`,
          };
        }}
        showWeekdayLabels
      />
    </div>
  );
};

export default Heatmap;
