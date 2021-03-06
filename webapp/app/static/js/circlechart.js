// Generated by CoffeeScript 1.9.0
(function() {
  var CircleChart,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  CircleChart = (function(_super) {
    __extends(CircleChart, _super);

    function CircleChart(_at_app, _at_params, _at_data, _at_helpers) {
      var city, cityData, data, date, self, _i, _len, _ref;
      this.app = _at_app;
      this.params = _at_params;
      this.data = _at_data;
      this.helpers = _at_helpers;
      self = this;
      this.el = this.params.el;
      this.qualitative = this.params.qualitative || [];
      this.svg = d3.select("#" + this.el).append("svg").attr("width", this.params.width).attr("height", this.params.height);
      this.cities = ["Bangalore", "Boston", "Geneva", "Rio de Janeiro", "San Francisco", "Shanghai", "Singapore"];
      this.cityData = [];
      _ref = this.cities;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        city = _ref[_i];
        cityData = _.groupBy(_.where(this.data, {
          "city": city
        }), function(d) {
          return d.timestamp.substring(0, 10);
        });
        data = [];
        for (date in cityData) {
          data.push(_.filter(cityData[date], function(d, i) {
            return d.airquality_raw > 100 && d.city !== 'Geneva';
          }));
        }
        this.cityData.push({
          city: city,
          data: data
        });
      }
      this.cityContainers = this.svg.selectAll("g").data(this.cityData).enter().append("g").attr("transform", function(d, i) {
        return "translate(0, " + (60 + i * 50) + ")";
      });
      this.cityContainers.each(function(d, i) {

        /*
        d3.select(@).append("text")
          .text(d.city)
          #.attr("transform", "rotate(-90)")
          .attr("y", 4)
          #.attr("dx", "0.8em")
          .style("text-anchor", "start")
          .style("font-size", "11px")
          .style("stroke", "none")
          .style("fill", "#999")
         */
        this.day = d3.select(this).selectAll(".day").data(d.data).enter().append("g").attr("class", "day").attr("transform", function(d, i) {
          return "translate(" + (50 + i * 100) + ", 0)";
        });
        return this.day.each(function(d, i) {
          d3.select(this).selectAll("circle").data(d).enter().append("circle").attr("cx", 0).attr("cy", 0).attr("r", (function(_this) {
            return function(d, i) {
              return i * 4;
            };
          })(this)).style("fill", "none").style("opacity", 0.7).style("stroke", (function(_this) {
            return function(d, i) {
              if (d.airquality_raw > 100) {
                return self.helpers.getColor(d.airquality_raw, self.qualitative);
              }
              return "none";
            };
          })(this)).style("stroke-width", 1.5).attr("class", "circle");
          return d3.select(this).append("circle").attr("cx", 0).attr("cy", 0).attr("r", 2).style("fill", "#999");
        });
      });

      /*
      @cities.each((d, i) ->
      
        @cityData = _.where(@data, {city: d})
        #@rioData = _.filter(@rioData, (d) -> d.airquality_raw > 50)
      
        @g = @svg.append("g")
          .attr("class", d)
          .attr("transform", "translate(200, 200)")
          
        @g.selectAll(".circle")
          .data(@cityData)
          .enter()
          .append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", (d, i) =>
            console.log d
            i * 3
          )
          .style("fill", "none")
          .style("stroke", (d, i) =>
            console.log d.airquality_raw
            if d.airquality_raw > 100
              return @helpers.getColor(d.airquality_raw, @qualitative)
            "#fff"
          )
          .style("stroke-width", 1)
          .attr("class", "circle")
      )
       */
    }

    return CircleChart;

  })(APP.charts['Chart']);

  APP.charts['CircleChart'] = CircleChart;

}).call(this);
