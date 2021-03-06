// Generated by CoffeeScript 1.9.0
(function() {
  var ClockChart,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  ClockChart = (function(_super) {
    __extends(ClockChart, _super);

    function ClockChart(_at_app, _at_params, _at_data, _at_helpers) {
      var city, cityData, data, date, maxAQIByDay, self, _i, _len, _ref;
      this.app = _at_app;
      this.params = _at_params;
      this.data = _at_data;
      this.helpers = _at_helpers;
      self = this;
      this.el = this.params.el;
      this.qualitative = this.params.qualitative || [];
      this.width = 250;
      this.height = 250;
      this.radius = Math.min(this.width, this.height) / 2;
      this.innerRadius = 0;
      this.interval = 0;
      this.scale = d3.scale.linear().domain([0, 350]).range([0, 1]);
      this.pie = d3.layout.pie().sort(null).value(function(d) {
        return d.width;
      });
      this.arc = d3.svg.arc().innerRadius(this.innerRadius).outerRadius((function(_this) {
        return function(d, i) {
          return (_this.radius - _this.innerRadius) * (_this.scale(d.data.score)) + _this.innerRadius;
        };
      })(this));
      this.arc2 = d3.svg.arc().innerRadius(this.innerRadius).startAngle(0).endAngle(0);
      this.svg = d3.select("#" + this.el).append("svg").attr("width", this.params.width).attr("height", this.params.height);
      this.filter = this.svg.append("defs");
      this.filter.append("filter").attr("id", "blur").append("feGaussianBlur").attr("stdDeviation", 6);
      this.filter.append("filter").attr("id", "unblur").append("feGaussianBlur").attr("stdDeviation", 0);
      this.cities = ["Bangalore", "Boston", "Rio de Janeiro", "San Francisco", "Shanghai", "Singapore"];
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
          maxAQIByDay = _.max(cityData[date], function(d) {
            return d.airquality_raw;
          });
          data.push(_.map(cityData[date], function(d, i) {
            return {
              'id': d.city + "-" + i,
              'order': i,
              'color': self.helpers.getColor(d.airquality_raw, self.qualitative),
              'weight': 1,
              'score': d.airquality_raw,
              'width': 1,
              'label': city,
              'timestamp': d.timestamp,
              'is_max': d.airquality_raw === maxAQIByDay.airquality_raw ? true : false
            };
          }));
        }
        this.cityData.push({
          city: city,
          data: data
        });
      }
      this.cityContainers = this.svg.selectAll("g").data(this.cityData).enter().append("g").attr("transform", function(d, i) {
        return "translate(" + (i % 2 * 85 + 10) + ", " + (60 + i * 80) + ")";
      }).attr("id", function(d, i) {
        return "id-" + i;
      }).attr("class", "city").attr("filter", function(d) {
        return "url(#blur)";
      });
      this.cityText = this.cityContainers.append("g").attr("transform", function(d, i) {
        if (i === 0) {
          return "translate(0, -50)";
        }
        return "translate(0, -20)";
      }).attr("class", "cityText").style("opacity", 1);
      this.cityText.append("text").text(function(d) {
        return "" + d.city;
      }).attr("x", 0).attr("y", function(d, i) {
        if (i === 0) {
          return 20;
        } else if (d.city === "Boston") {
          return -60;
        } else if (d.city === "Shanghai") {
          return -140;
        } else if (d.city === "Singapore") {
          return -140;
        }
        return -60;
      }).style("opacity", 0.0).style("font-size", "14px").style("font-weight", "bold");

      /*
      @cityText
        .append("text")
        .text("Worst air quality index score by the hour")
        .attr("x", 0)
        .attr("y", (d, i) ->
          if i == 0
            return 90
          else if d.city == "Boston"
            return -40
          else if d.city == "Shanghai"
            return -120
          else if d.city == "Singapore"
            return -120
          -40
        )
        .style("opacity", 0.0)
        .style("font-size", "14px")
       */
      this.cityContainers.each(function(d, i) {
        var containerIndex;
        containerIndex = i;
        this.day = d3.select(this).selectAll(".day").data(d.data).enter().append("g").attr("class", "day").attr("transform", function(d, i) {
          return "translate(" + (50 + i * 190) + ", 0)";
        });
        this.day.each(function(d, i) {
          this.path = d3.select(this).selectAll(".middleSolidArc").data(self.pie(d)).enter().append("path").attr("fill", function(d) {
            if (d.data.score > 0) {
              return d.data.color;
            }
            return "none";
          }).style("opacity", function(d) {
            return 1.0;
          }).attr("class", "middleSolidArc").attr("stroke", "#fff").attr("stroke-width", 1.5).attr("d", self.arc);
          return d3.select(this).append("circle").attr("cx", 0).attr("cy", 0).attr("r", 2).style("fill", "#666");

          /*
          d3.select(@).selectAll("text")
            .data(self.pie(d))
            .enter().append("text")
            .attr("x", (d, i) ->
              self.arc.centroid(d)[0]
            )
            .attr("y", (d, i) ->
              self.arc.centroid(d)[1]
            )
            .text((d) ->
              d.data.score
            )
           */
        });
        return this.day.each(function(d, i) {
          var highest, index, score;
          highest = _.max(d, function(elem) {
            return elem.score;
          });
          date = moment(highest.timestamp);
          date.format('MMM-Do-YY');
          index = containerIndex;
          score = d3.select(this).append("g").attr("class", "dayText").attr("opacity", 0);
          score.attr("transform", function(d, i) {
            if (index === 0) {
              return "translate(0, 70)";
            } else if (index === 4) {
              return "translate(0, -88)";
            } else if (index === 5) {
              return "translate(0, -108)";
            }
            return "translate(0, 90)";
          });
          score.append("text").attr("y", 0).style("font-weight", "bold").text(highest.score);
          score.append("text").attr("y", 24).text(date.format('MMMM DD'));
          return score.append("text").attr("y", 40).text(date.format('ha'));
        });
      });
      this.svg.selectAll(".city").append("rect").attr("y", -this.params.height / 14).attr("width", this.params.width).attr("height", this.params.height / 7 - 20).style("opacity", 0.0).on("mouseover", function(d, i) {
        return self.unBlurCity("id-" + i, i);
      }).on("mouseout", (function(_this) {
        return function(d, i) {
          return _this.blurCity();
        };
      })(this)).on("click", function(d) {
        return window.location.href = "/city/" + d.city + "/";
      }).style("cursor", "pointer");
      this.svg.on("mouseout", function() {
        d3.selectAll(".city").attr("filter", function(d) {
          return "url(#blur)";
        });
        d3.selectAll(".cityText text").style("opacity", 0);
        return d3.selectAll(".day .dayText").style("opacity", 0);
      });
    }

    ClockChart.prototype.unBlurCity = function(idx, index) {
      d3.selectAll(".city").attr("filter", function(d) {
        return "url(#blur)";
      });
      d3.selectAll(".cityText text").style("opacity", 0);
      d3.selectAll(".day .dayText").style("opacity", 0);
      d3.selectAll("#" + idx).attr("filter", (function(_this) {
        return function(d) {
          return "url(#unblur)";
        };
      })(this)).selectAll("text").style("opacity", 1);
      return d3.selectAll("#" + idx + " .dayText").style("opacity", 1);
    };

    ClockChart.prototype.blurCities = function() {
      d3.selectAll(".city").attr("filter", (function(_this) {
        return function(d) {
          return "url(#blur)";
        };
      })(this));
      return d3.selectAll(".cityText text").style("opacity", 0);
    };

    ClockChart.prototype.blurCity = function(idx) {
      return null;
    };

    return ClockChart;

  })(APP.charts['Chart']);

  APP.charts['ClockChart'] = ClockChart;

}).call(this);
