var freqData=[
    {Region:'' ,freq:{yesVote:0, noVote:0}},
    {Region:'' ,freq:{yesVote:0, noVote:0}},
    {Region:'' ,freq:{yesVote:0, noVote:0}},
    {Region:'' ,freq:{yesVote:0, noVote:0}},
    {Region:'' ,freq:{yesVote:0, noVote:0}},
    {Region:'' ,freq:{yesVote:0, noVote:0}},
    {Region:'' ,freq:{yesVote:0, noVote:0}},
    {Region:'' ,freq:{yesVote:0, noVote:0}},
    {Region:'' ,freq:{yesVote:0, noVote:0}},
    {Region:'' ,freq:{yesVote:0, noVote:0}},
    {Region:'' ,freq:{yesVote:0, noVote:0}},
    {Region:'' ,freq:{yesVote:0, noVote:0}}
];

var chart_width     =   1500;
var chart_height    =   720;
var bar_padding     =   5;
var color = d3.scaleOrdinal().range(['blue', 'red']).domain(['yes','no']);
var barColor = 'green';

d3.csv('RefVoteData.csv', function (error, data) {
    data.forEach(function (data) {
        data.YesVote = +data.YesVote;
        data.NoVote = +data.NoVote;
    });
    data.forEach(function (d, i) {
        freqData[i].Region = data[i].Region;
        freqData[i].freq.yesVote = data[i].YesVote;
        freqData[i].freq.noVote = data[i].NoVote;
    });
    console.log(freqData);

// function to handle bar chart
    function CreateBarChart(bD) {
        var bC = {};
        var chartDim = {t: 60, b: 30, r: 10, l: 10};
        chartDim.w = (chart_width/2) - chartDim.r - chartDim.l;
        chartDim.h = chart_height - chartDim.t - chartDim.b;

        // create svg for bar chart
        var barSVG = d3.select('#chart').append('svg')
            .attr('width', chartDim.w + chartDim.l + chartDim.r)
            .attr('height', chartDim.h + chartDim.t + chartDim.b)
            .append('g')
            .attr('transform', 'translate ( '+chartDim.l+','+chartDim.t+')');

        // create function for x-axis mapping.
        var x = d3.scaleBand().rangeRound([0, chartDim.w, 0.1])
            .domain(bD.map(function (d) {
                return d.Region;
            }));

        // Add x-axis to the svg.
        barSVG.append('g').attr('class', 'x axis')
            .attr('transform', 'translate(0,' + chartDim.h + ')')
            .call(d3.axisBottom(x));

        console.log(d3.max(bD.map(function (d) {
            return d.total;
        })));

        // Create function for y-axis map.
        var y = d3.scaleLinear().range([chartDim.h, 0])
            .domain([0, d3.max(bD.map(function (d) {
                return d.total;
            }))]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = barSVG.selectAll('.bar')
            .data(bD)
            .enter()
            .append('g')
            .attr('class', 'bar');

        //create the rectangles.
        bars.append('rect')
            .attr('x', function (d) {
                return x(d.Region);
            })
            .attr('y', function (d) {
                return y(d.total);
            })
            .attr('width', x.bandwidth() - bar_padding)
            .attr('height', function (d) {
                return chartDim.h - y(d.total);
            })
            .attr('fill', barColor)
            .on('mouseover', mouseOver)
            .on('mouseout',mouseOut);

        //Create the frequency labels above the rectangles.
        bars.append('text')
            .text(function (d) {
                return d3.format(',')(d.total);
            })
            .attr('x', function (d) {
                return x(d.Region) + x.bandwidth() / 2;
            })
            .attr('y', function (d) {
                return y(d.total) - 5;
            })
            .attr('text-anchor', 'middle');

        // Mouse events
        function mouseOver(d) {
            // look for selected state
            var filterData = freqData.filter(function (f) {
                return f.Region == d.Region;
            });

            pC.update(filterData);
            legend.update(filterData, false);
        }

        function mouseOut(d) {
            pC.update(freqData);
            legend.update(freqData, true);
        }

        // update bars
        bC.update = function (newData, mouseOut){
            // update doamin

            if(mouseOut) {
                y.domain([0,d3.max(freqData.map(function (d) {
                    return d.total;
                }))]);
                var bars = barSVG.selectAll('.bar').data(freqData);

                bars.select('rect').transition().duration(500)
                    .attr('y', function (d) {
                        return y(d.total);
                    })
                    .attr('height', function (d) {
                        return chartDim.h - y(d.total);
                    })
                    .attr('fill',barColor);

                bars.select('text').transition().duration(500)
                    .text(function (d) {
                        return d3.format(',')(d.total);
                    })
                    .attr('y', function (d) {
                        return y(d.total) - 5;
                    });
            }
            else {
                if(newData.data.type == 'yes')
                {
                    y.domain([0,d3.max(freqData.map(function (d) {
                        return d.freq.yesVote;
                    }))]);
                    var bars = barSVG.selectAll('.bar').data(freqData);

                    bars.select('rect').transition().duration(500)
                        .attr('y', function (d) {
                            return y(d.freq.yesVote);
                        })
                        .attr('height', function (d) {
                            return chartDim.h - y(d.freq.yesVote);
                        })
                        .attr('fill','blue');

                    bars.select('text').transition().duration(500)
                        .text(function (d) {
                            return d3.format(',')(d.freq.yesVote);
                        })
                        .attr('y', function (d) {
                            return y(d.freq.yesVote) - 5;
                        });
                }

                if(newData.data.type == 'no')
                {
                    y.domain([0,d3.max(freqData.map(function (d) {
                        return d.freq.noVote;
                    }))]);
                    var bars = barSVG.selectAll('.bar').data(freqData);

                    bars.select('rect').transition().duration(500)
                        .attr('y', function (d) {
                            return y(d.freq.noVote);
                        })
                        .attr('height', function (d) {
                            return chartDim.h - y(d.freq.noVote);
                        })
                        .attr('fill','red');

                    bars.select('text').transition().duration(500)
                        .text(function (d) {
                            return d3.format(',')(d.freq.noVote);
                        })
                        .attr('y', function (d) {
                            return y(d.freq.noVote) - 5;
                        });
                }
            }
        };
        return bC;
    }

// function to handle pie chart
    function CreatePieChart(pD) {
        var pC = {};

        // svg for pie chart
        var pieSVG = d3.select('#chart').append('svg')
            .attr('width', chart_width / 2)
            .attr('height', chart_height * 2 / 3)
            .attr('transform', 'translate ( ' + 0 + ',' + chart_height / -3  + ')')
            .append('g')
            .attr('transform', 'translate ( ' + chart_width / 4 + ',' + chart_height / 3  + ')');

        var r = 250;
        var arc = d3.arc()
            .outerRadius(r - 10)
            .innerRadius(0);


        // compute pie slice angles
        var pie = d3.pie().sort(null).value(function (d) {
            return d.value;
        });

        var yesTotal;
        var noTotal;

        yesTotal = d3.sum(pD, function(v){
            return v.freq.yesVote;
        });

        noTotal = d3.sum(pD, function(v){
            return v.freq.noVote;
        });

        var newVotes = [{type: 'yes', value: yesTotal},
            {type: 'no', value: noTotal}];

        // draw pie slices
        pieSVG.selectAll('path')
            .data(pie(newVotes))
            .enter()
            .append('path')
            .attr('d', arc)
            .each(function (d) {
                return this._current = d;
            })
            .style('fill', function (d) {
                return color(d.data.type);
            })
            .on('mouseover',mouseOver)
            .on('mouseout',mouseOut);

        // mouse functions
        function mouseOver(d){
            bC.update(d, false)
        }

        function mouseOut(d){
            bC.update(d, true);
        }
        // Update pie chart
        pC.update = function (nD) {
            var yesTotal;
            var noTotal;

            yesTotal = d3.sum(nD, function(v){
                return v.freq.yesVote;
            });

            noTotal = d3.sum(nD, function(v){
                return v.freq.noVote;
            });

            var voteArray = [{type: 'yes', value: yesTotal},
                {type: 'no', value: noTotal}];

            pieSVG.selectAll('path').data(pie(voteArray)).transition().duration(500).attrTween('d', arcTween);
        };

        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        }
        return pC;
    }

    function CreateLegend(lD){
        var legend = {};

        var toPercent = d3.format('0.1%');

        var legendSVG = d3.select('#chart')
            .append('svg')
            .attr('width', chart_width / 2)
            .attr('height', chart_height / 3)
            .attr('transform', 'translate ( ' + chart_width / 2 + ',' + chart_height / -3  + ')')
            .append('g')
            .attr('transform', 'translate ( '+ chart_width / 4 + ',' + 0  + ')')
            .data(lD);

        // region legend
        legendSVG.append('text')
            .text(function () {
                return 'Region: All';
            })
            .attr('id','region')
            .attr('x', -30)
            .attr('y', 15)
            .attr('text-anchor', 'middle');

        // total legend (green)
        legendSVG.append('rect')
            .attr('width', 16)
            .attr('height', 16)
            .attr('x', -100)
            .attr('y', 30)
            .attr('fill', 'green');

        var allTotal = d3.sum(lD, function(v){
            return v.total;
        });

        legendSVG.append('text')
            .text(function () {
                return 'Total Votes:  ' + allTotal;
            })
            .attr('id','total')
            .attr('x', 0)
            .attr('y', 43)
            .attr('text-anchor', 'middle');

        // yes legend (blue)
        legendSVG.append('rect')
            .attr('width', 16)
            .attr('height', 16)
            .attr('x', -100)
            .attr('y', 80)
            .attr('fill', 'blue');

        var yesTotal = d3.sum(lD, function(v){
            return v.freq.yesVote;
        });

        legendSVG.append('text')
            .text(function () {
                return 'Yes Votes:  ' + yesTotal;
            })
            .attr('id','yes-total')
            .attr('x', 0)
            .attr('y', 93)
            .attr('text-anchor', 'middle');

        legendSVG.append('text')
            .text(function () {
                return 'Percent of votes:  ' +  toPercent(yesTotal/allTotal);
            })
            .attr('id','yes-percent')
            .attr('x', 10)
            .attr('y', 113)
            .attr('text-anchor', 'middle');

        // no legend (red)
        legendSVG.append('rect')
            .attr('width', 16)
            .attr('height', 16)
            .attr('x', -100)
            .attr('y', 130)
            .attr('fill', 'red');

        var noTotal = d3.sum(lD, function(v){
            return v.freq.noVote;
        });

        legendSVG.append('text')
            .text(function () {
                return 'No Votes:  ' + noTotal;
            })
            .attr('id','no-total')
            .attr('x', 0)
            .attr('y', 143)
            .attr('text-anchor', 'middle');

        legendSVG.append('text')
            .text(function () {
                return 'Percent of votes:  ' +  toPercent(noTotal/allTotal);
            })
            .attr('id','no-percent')
            .attr('x', 10)
            .attr('y', 163)
            .attr('text-anchor', 'middle');

        legend.update = function (newD, mouseOut) {
            var allTotal = d3.sum(newD, function(v){
                return v.total;
            });

            var yesTotal = d3.sum(newD, function(v){
                return v.freq.yesVote;
            });

            var noTotal = d3.sum(newD, function(v){
                return v.freq.noVote;
            });

            if(mouseOut)
            {
                legendSVG.select('#region')
                    .text(function () {
                        return 'Region: All';
                    });
            }
            else
            {
                legendSVG.select('#region')
                    .text(function () {
                        return 'Region:  ' + newD[0].Region;
                    });
            }

            legendSVG.select('#total')
                .text(function () {
                    return 'Total Votes:  ' + allTotal;
                });

            legendSVG.select('#yes-total')
                .text(function () {
                    return 'Yes Votes:  ' + yesTotal;
                });

            legendSVG.select('#yes-percent')
                .text(function () {
                    return 'Percent of votes:  ' +  toPercent(yesTotal/allTotal);
                });

            legendSVG.select('#no-total')
                .text(function () {
                    return 'No Votes:  ' + noTotal;
                });

            legendSVG.select('#no-percent')
                .text(function () {
                    return 'Percent of votes:  ' +  toPercent(noTotal/allTotal);
                });
        };


        return legend;
    }

    freqData.forEach(function (d) {
        d.total = d.freq.noVote + d.freq.yesVote;
    });

    var bC = CreateBarChart(freqData);
    var pC = CreatePieChart(freqData);
    var legend = CreateLegend(freqData);
});