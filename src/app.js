import * as Koto from 'koto';
import * as d3 from 'd3';

class MyChartName extends Koto.default {
  constructor(selection) {
    super(selection);

    // Setup
    var chart = this;

    // define configs
    this.configs = {
      height: {
        name: 'height',
        description: 'The height of the chart.',
        value: 500,
        type: 'number',
        units: 'px',
        category: 'Size',
        getter: function (){
          // get value
          return this.value;
        },
        setter: function (newValue){
          // Set value
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

    // Scales
    this.x = d3.scaleLinear()
      .range([0, this.config('width')]);

    this.y = d3.scaleLinear()
      .domain([0, 100])
      .rangeRound([0, this.config('height')]);

    // add a layer
    this.layer('bars', this.base.append('g'), {
      // destructuring ftw
      dataBind(data) {
        return this.selectAll('rect')
          .data(data, d => d.time);
      },
      insert() {
        return this.append('rect');
      }
    })
    // lifecycle events (Arrow function syntax)
    .on('enter', selection => {
      var length = this._length = selection.data().length;
      selection.attr('x', (d, i) => this.x(i + 1) - 0.5 )
        .attr('y', (d) => this.config('height') - this.y(d.value) - 0.5)
        .attr('width', this.config('width') / length)
        .style('fill', 'steelBlue')
        .attr('height', d => this.y(d.value));
    })
    .on('merge:transition', selection => {
      selection.duration(1000)
        .attr('x', (d, i) => this.x(i) - 0.5);
    })
    .on('exit:transition', selection => {
      selection.duration(1000)
        .attr('x', (d, i) => this.x(i - 1) - 0.5)
        .remove();
    });

    // add another layer 
    this.layer('labels', this.base.append('g'), {
      dataBind(data) {
        return this.selectAll('text')
          .data(data, d => d.time);
      },
      insert() {
        return this.append('text');
      }
    })
    // non arrow function syntax
    .on('enter', function() {
      var length = this.data().length;
      this
        .attr('x', (d, i) => chart.x(i + 1) + ((chart.config('width') / length) / 2))
        .attr('y', d => chart.config('height') - chart.y(d.value) - 15)
        .style('fill', 'steelBlue')
        .style('text-anchor', 'middle')
        .text(d => d.value);
    })
    .on('merge:transition', function() {
      this.duration(1000)
        .attr('x', (d, i) => chart.x(i) + ((chart.config('width') / chart._length) / 2));
    })
    .on('exit:transition', function() {
      this.duration(1000)
        .attr('x', (d, i) => chart.x(i - 1) - 0.5)
        .remove();
    });
  }

  //override methods
  preDraw(data) {
    this.x.domain([0, data.length]);
  }
}

// we attach everything to the global `koto` variable
Koto.MyChartName = MyChartName;


class DataSrc {
  constructor() {
    this.time = 1297110663; // start time (seconds since epoch)
    this.value = 70;
    this.data = d3.range(33).map(() => { return this.next(); });
  }

  next() {
    this.time += 1;
    this.value = ~~Math.max(10, Math.min(90, this.value + 10 * (Math.random() - .5)));
    return {
      time: this.time,
      value: this.value
    };
  }

  fetch() {
    this.data.shift();
    this.data.push(this.next());
  }
}

export class App {
  constructor() {
    this.message = 'Hello World!';
  }

  attached() {
    let dataSrc = new DataSrc();
    let barChart = new Koto.MyChartName(d3.select('#test'));
    barChart.draw(dataSrc.data);
    setInterval(function() {
      dataSrc.fetch();
      barChart.draw(dataSrc.data);
    }, 1500);
  }
}
