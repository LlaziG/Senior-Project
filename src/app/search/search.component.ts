import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as echarts from 'echarts';
import { timeout } from 'q';




@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    constructor(private http: HttpClient, private chRef: ChangeDetectorRef) { }
    rawData: any[];
    stockChart: any;
    stockChartOptions: any;
    candles: any;
    dates: any;
    volumes: any;

    calculateMA(dayCount, data) {
        var result = [];
        for (var i = 0, len = data.length; i < len; i++) {
            if (i < dayCount) {
                result.push('-');
                continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
                sum += data[i - j][1];
            }
            result.push(sum / dayCount);
        }
        return result;
    }

    ngOnInit() {
        document.getElementById('stockChart').style.height = (window.innerHeight - window.innerWidth * 2 / 100 - 20) + "px";
        this.http.get('https://api.iextrading.com/1.0/stock/aapl/chart/5y')
            .subscribe((data: any) => {
                this.rawData = data;
                this.stockChart = echarts.init(document.getElementById('stockChart'));

                this.dates = this.rawData.map(function (item) {
                    return item.date;
                });
                let i = -1;
                this.volumes = this.rawData.map(function (item){
                    i++;
                	return [i, item.volume, item.open > item.close ? -1 : 1];
                });
                console.log(this.volumes);
                this.candles = this.rawData.map(function (item) {
                    return [+item.open, +item.close, +item.low, +item.high];
                });
                this.stockChartOptions = {
                    backgroundColor: '#21202D',
                    animation: false,
                    legend: {
                        data: ['AAPL', 'MA5', 'MA10', 'MA20', 'MA30'],
                        inactiveColor: '#777',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    toolbox: {
                        feature: {
                            my1m: {
                                show: true,
                                title: '1m',
                                icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                                onclick: function (){
                                    alert('myToolHandler1')
                                }
                            },
                            my5m: {
                                show: true,
                                title: '5m',
                                icon: 'image://http://echarts.baidu.com/images/favicon.png',
                                onclick: function (){
                                    alert('myToolHandler2')
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false,
                            type: 'cross',
                            lineStyle: {
                                color: '#376df4',
                                width: 2,
                                opacity: 1
                            }
                        }
                    },
                    visualMap: {
                        show: false,
                        seriesIndex: 5,
                        dimension: 2,
                        pieces: [{
                            value: -1,
                            color: '#b33939'
                        }, {
                            value: 1,
                            color: '#218c74'
                        }]
                    },
                    grid: [
                        {
                            left: '10%',
                            right: '8%',
                            height: '50%'
                        },
                        {
                            left: '10%',
                            right: '8%',
                            top: '63%',
                            height: '16%'
                        }
                    ],
                    xAxis: [
                        {
                            
                            type: 'category',
                            data: this.dates,
                            scale: true,
                            boundaryGap : false,
                            axisLine: { lineStyle: { color: '#8392A5' } },
                            splitLine: {show: false},
                            splitNumber: 20,
                            min: 'dataMin',
                            max: 'dataMax',
                            axisPointer: {
                                z: 100
                            }
                        },
                        {
                            type: 'category',
                            gridIndex: 1,
                            data: this.dates,
                            scale: true,
                            boundaryGap : false,
                            axisLine: { lineStyle: { color: '#8392A5' } },
                            axisTick: {show: false},
                            splitLine: {show: false},
                            axisLabel: {show: false},
                            splitNumber: 20,
                            min: 'dataMin',
                            max: 'dataMax'
                        }
                    ],
                    yAxis: [
                        {
                            scale: true,
                            axisLine: { lineStyle: { color: '#8392A5' } }
                        },
                        {
                            scale: true,
                            gridIndex: 1,
                            splitNumber: 2,
                            axisLine: { lineStyle: { color: '#8392A5' } },
                            axisTick: {show: false}
                        }
                    ],
                    dataZoom: [
                        {
                            type: 'inside',
                            xAxisIndex: [0, 1],
                            start: 0,
                            end: 100
                        },
                        {
                            dataBackground: {
                            areaStyle: {
                                color: '#8392A5'
                            },
                            lineStyle: {
                                opacity: 0.8,
                                color: '#8392A5'
                            }
                        },textStyle: {
                            color: '#8392A5'
                        }, handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        },
                            show: true,
                            xAxisIndex: [0, 1],
                            type: 'slider',
                            top: '85%',
                            start: 98,
                            end: 100
                        }
                    ],
                    series: [
                        {
                            name: 'AAPL',
                            type: 'candlestick',
                            data: this.candles,
                            itemStyle: {
                                normal: {
                                    color: '#218c74',
                                    color0: '#b33939',
                                    borderColor: null,
                                    borderColor0: null
                                }
                            }
                        },
                        {
                            name: 'MA5',
                            type: 'line',
                            data: this.calculateMA(5, this.candles),
                            smooth: true,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            }
                        },
                        {
                            name: 'MA10',
                            type: 'line',
                            showSymbol: false,
                            data: this.calculateMA(10, this.candles),
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            }
                        },
                        {
                            name: 'MA20',
                            type: 'line',
                            showSymbol: false,
                            data: this.calculateMA(20, this.candles),
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            }
                        },
                        {
                            name: 'MA30',
                            type: 'line',
                            showSymbol: false,
                            data: this.calculateMA(30, this.candles),
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            }
                        },
                        {
                            name: 'Volume',
                            type: 'bar',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            data: this.volumes
                        }
                    ]
                };
                this.stockChart.setOption(this.stockChartOptions);

            });
    }
    onResize(event) {
        document.getElementById('stockChart').style.height = (window.innerHeight - window.innerWidth * 2 / 100 - 20) + "px";
        this.stockChart.setOption(this.stockChartOptions);
    }
}
