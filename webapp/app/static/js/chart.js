// Generated by CoffeeScript 1.9.0
(function() {
  var Chart;

  Chart = (function() {
    function Chart(_at_app, _at_params, _at_data, _at_city, _at_helpers) {
      this.app = _at_app;
      this.params = _at_params;
      this.data = _at_data;
      this.city = _at_city;
      this.helpers = _at_helpers;
      null;
    }

    Chart.prototype._isAboveTheFold = function() {
      return $(window).scrollTop() + $(window).height() > $("#" + this.el).offset().top;
    };

    Chart.prototype._getDuration = function() {
      if (this._isAboveTheFold()) {
        return 1000;
      } else {
        return 0;
      }
    };

    return Chart;

  })();

  if (window.APP == null) {
    window.APP = {};
  }

  APP.charts = {
    Chart: Chart
  };

}).call(this);