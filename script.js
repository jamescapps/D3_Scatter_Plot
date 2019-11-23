//Receives the data to be used.
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then(response => response.json())
  .then(data => {
      data.forEach(function(d) {
        let parsedTime = d.Time.split(":");
        d.Time = new Date(0000, 0, 1, 0, parsedTime[0], parsedTime[1]);
      });
  
      const width = 1500
      const height = 400
      
      let color = d3.scaleOrdinal()
                    .range(["white", "blue"])
      
      let svg =  d3.select("#chart")
                   .append("svg")
                   .attr("width", width + 200)
                   .attr("height", height + 60)
                   
      let tooltip = d3.select("#chart")
                      .append("div")
                      .attr("id", "tooltip")
      
      //Acquire x-axis values
      let years = data.map(function(item) {
          return item.Year
      })
  
      let sortedYears = years.sort(function(a, b) {
        return a - b
      })
      let minYear = sortedYears[0]
      let maxYear = sortedYears[sortedYears.length - 1]
      let timeFormat = d3.timeFormat("%M:%S")
      
      //Sets axis
      let xScale = d3.scaleLinear()
                     .domain([minYear, maxYear])
                     .range([0, width - 600])
                     .nice()
      let yScale = d3.scaleTime()
                     .domain(d3.extent(data, function(d) {
                          return d.Time;
                       }))
                     .range([height, 0])
      let yAxis = d3.axisLeft(yScale)
                    .tickFormat(function(d){
                         return d3.timeFormat(timeFormat)(d)
                     });
                    
      let xAxis = d3.axisBottom()
                    .scale(xScale)
                    .tickFormat(d3.format("d"))
  
      svg.append("g")
         .call(xAxis)
         .attr("id", "x-axis")
         .attr("transform", "translate(240, 440)")
  
      svg.append("g")
         .call(yAxis)
         .attr("id", "y-axis")
         .attr("transform", "translate(240, 40)")
  
      svg.append("text")
         .attr("transform", "rotate(-90)")
         .attr("x", -300)
         .attr("y", 140)
         .text("Time (in minutes)")
    
      svg.selectAll(".dot")
         .data(data)
         .enter().append("circle")
         .attr("class", "dot")
         .attr("transform", "translate(240, 40)")
         .attr("r", 6)
         .attr("cx", function(d) {
             return xScale(d.Year)
         })
        .attr("cy", function(d) {
            return yScale(d.Time)
         })
        .attr("data-xvalue", function(d){
           return d.Year
        })
        .attr("data-yvalue", function(d){
           return d.Time
        })
        .style("fill", function(d) {
            return color(d.Doping != "");
        })
       .on("mouseover", function(d) {
           tooltip.style("opacity", .9);
           tooltip.attr("data-year", d.Year)
           tooltip.html(d.Name + ": " + d.Nationality + "<br/>"
                  + "Year: " +  d.Year + ", Time: " + timeFormat(d.Time) 
                  + (d.Doping?"<br/><br/>" + d.Doping:""))
                  .style("left", (d3.event.pageX + 15) + "px")
                  .style("top", (d3.event.pageY - 170) + "px");
        })
       .on("mouseout", function(d) {
           tooltip.style("opacity", 0);
        });

       let legend = svg.selectAll(".legend")
                       .data(color.domain())
                       .enter()
                       .append("g")
                       .attr("class", "legend")
                       .attr("id", "legend")
                       .attr("transform", function(d, i) {
                            return "translate(0," + (height/2 - i * 25) + ")"
                        })
          legend.append("rect")
                      .attr("x", width - 450)
                      .attr("y", 25)
                      .attr("width", 20)
                      .attr("height", 15)
                      .style("fill", color)
          legend.append("text")
                      .attr("x", width - 460)
                      .attr("y", 38)
                      .style("text-anchor", "end")
                      .text(function(d) {
                        if (d) return "Allegations"
                        else {
                          return "Clean"
                        }
                      })
  
})