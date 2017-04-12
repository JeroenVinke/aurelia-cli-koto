define('app',['exports', 'koto', 'd3'], function (exports, _koto, _d) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  var Koto = _interopRequireWildcard(_koto);

  var d3 = _interopRequireWildcard(_d);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var MyChartName = function (_Koto$default) {
    _inherits(MyChartName, _Koto$default);

    function MyChartName(selection) {
      _classCallCheck(this, MyChartName);

      var _this = _possibleConstructorReturn(this, _Koto$default.call(this, selection));

      var chart = _this;

      _this.configs = {
        height: {
          name: 'height',
          description: 'The height of the chart.',
          value: 500,
          type: 'number',
          units: 'px',
          category: 'Size',
          getter: function getter() {
            return this.value;
          },
          setter: function setter(newValue) {
            return newValue;
          }
        },
        width: {
          name: 'width',
          description: 'The widthj of the chart.',
          value: 800,
          units: 'px',
          type: 'number',
          category: 'Size'
        }
      };

      _this.x = d3.scaleLinear().range([0, _this.config('width')]);

      _this.y = d3.scaleLinear().domain([0, 100]).rangeRound([0, _this.config('height')]);

      _this.layer('bars', _this.base.append('g'), {
        dataBind: function dataBind(data) {
          return this.selectAll('rect').data(data, function (d) {
            return d.time;
          });
        },
        insert: function insert() {
          return this.append('rect');
        }
      }).on('enter', function (selection) {
        var length = _this._length = selection.data().length;
        selection.attr('x', function (d, i) {
          return _this.x(i + 1) - 0.5;
        }).attr('y', function (d) {
          return _this.config('height') - _this.y(d.value) - 0.5;
        }).attr('width', _this.config('width') / length).style('fill', 'steelBlue').attr('height', function (d) {
          return _this.y(d.value);
        });
      }).on('merge:transition', function (selection) {
        selection.duration(1000).attr('x', function (d, i) {
          return _this.x(i) - 0.5;
        });
      }).on('exit:transition', function (selection) {
        selection.duration(1000).attr('x', function (d, i) {
          return _this.x(i - 1) - 0.5;
        }).remove();
      });

      _this.layer('labels', _this.base.append('g'), {
        dataBind: function dataBind(data) {
          return this.selectAll('text').data(data, function (d) {
            return d.time;
          });
        },
        insert: function insert() {
          return this.append('text');
        }
      }).on('enter', function () {
        var length = this.data().length;
        this.attr('x', function (d, i) {
          return chart.x(i + 1) + chart.config('width') / length / 2;
        }).attr('y', function (d) {
          return chart.config('height') - chart.y(d.value) - 15;
        }).style('fill', 'steelBlue').style('text-anchor', 'middle').text(function (d) {
          return d.value;
        });
      }).on('merge:transition', function () {
        this.duration(1000).attr('x', function (d, i) {
          return chart.x(i) + chart.config('width') / chart._length / 2;
        });
      }).on('exit:transition', function () {
        this.duration(1000).attr('x', function (d, i) {
          return chart.x(i - 1) - 0.5;
        }).remove();
      });
      return _this;
    }

    MyChartName.prototype.preDraw = function preDraw(data) {
      this.x.domain([0, data.length]);
    };

    return MyChartName;
  }(Koto.default);

  Koto.MyChartName = MyChartName;

  var DataSrc = function () {
    function DataSrc() {
      var _this2 = this;

      _classCallCheck(this, DataSrc);

      this.time = 1297110663;
      this.value = 70;
      this.data = d3.range(33).map(function () {
        return _this2.next();
      });
    }

    DataSrc.prototype.next = function next() {
      this.time += 1;
      this.value = ~~Math.max(10, Math.min(90, this.value + 10 * (Math.random() - .5)));
      return {
        time: this.time,
        value: this.value
      };
    };

    DataSrc.prototype.fetch = function fetch() {
      this.data.shift();
      this.data.push(this.next());
    };

    return DataSrc;
  }();

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);

      this.message = 'Hello World!';
    }

    App.prototype.attached = function attached() {
      var dataSrc = new DataSrc();
      var barChart = new Koto.MyChartName(d3.select('#test'));
      barChart.draw(dataSrc.data);
      setInterval(function () {
        dataSrc.fetch();
        barChart.draw(dataSrc.data);
      }, 1500);
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><h1>Hello world</h1><svg width=\"100%\" height=\"100%\" viewBox=\"0 0 800 500\"><g id=\"test\"></g></svg></template>"; });
//# sourceMappingURL=app-bundle.js.map