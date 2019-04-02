import { Component, OnInit, ChangeDetectorRef, HostListener, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as echarts from 'echarts';
import { Suggestion } from '../_models/suggestion';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SuggestionService } from '../_services/suggestion.service';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { APP_DI_CONFIG } from '../app-config.module';
import { ToastrService } from 'ngx-toastr';

import { trigger, stagger, animate, style, group, query as q, transition, keyframes } from '@angular/animations';
const query = (s, a, o = { optional: true }) => q(s, a, o);

export const searchTransition = trigger('searchTransition', [
  transition(':enter', [
    query('.row', style({ opacity: 0 })),
    query('.row', stagger(100, [
      style({ transform: 'translateY(100px)' }),
      animate('500ms cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateY(0px)', opacity: 1 })),
    ])),
  ]),
  transition(':leave', [
    query('.row', stagger(100, [
      style({ transform: 'translateY(0px)', opacity: 1 }),
      animate('500ms cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateY(100px)', opacity: 0 })),
    ])),
  ])
]);

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [searchTransition],
  host: {
    '[@searchTransition]': ''
  }
})
export class SearchComponent implements OnInit {

    constructor(
        private http: HttpClient,
        private chRef: ChangeDetectorRef,
        private fb: FormBuilder,
        private suggestionService: SuggestionService,
        private toastr: ToastrService
    ) { }

    rawData: any;
    stockChart: any;
    stockChartOptions: any;
    candles: any[];
    dates: any[];
    volumes: any[];
    filteredSuggestions: Suggestion[] = [];
    companiesForm: FormGroup;
    suggestions: FormGroup;
    isLoading = false;
    displayFn: any;
    currentTicker = "AAPL";

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
            result.push((sum / dayCount).toFixed(4));
        }
        return result;
    }
    ngOnInit() {
        let that = this;
        function getCandleData(company, interval, range, callback) {
            that.http.get(APP_DI_CONFIG.apiEndpoint + '/quotes/candles/' + company + '/' + interval + '/' + range)
                .subscribe((data: any) => {
                    that.rawData = data.chart.result[0].indicators.quote[0];
                    that.stockChart = echarts.init(document.getElementById('stockChart'));

                    that.dates = data.chart.result[0].timestamp.map(function (item) {
                        var iso = new Date(item * 1000).toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)
                        return iso[1] + ' ' + iso[2];
                    });
                    that.volumes = [];
                    that.candles = [];
                    for (let i = 0; i < that.rawData.open.length; i++) {
                        that.volumes.push([
                            i,
                            that.rawData.volume[i],
                            that.rawData.open[i] > that.rawData.close[i] ? -1 : 1
                        ]);
                        that.candles.push([
                            +that.rawData.open[i],
                            +that.rawData.close[i],
                            +that.rawData.low[i],
                            +that.rawData.high[i]
                        ]);
                    }
                    callback();
                });

        }
        function setOptions(company, callback) {
            that.stockChartOptions = {
                backgroundColor: '#1B191B',
                animation: false,
                legend: {
                    data: [company, 'MA5', 'MA10', 'MA20', 'MA30'],
                    inactiveColor: '#777',
                    textStyle: {
                        color: '#fff',
                        fontFamily: 'Lato',
                        fontSize: '16'
                    }
                },
                toolbox: {
                    feature: {
                        my1m: {
                            show: true,
                            icon: 'image:///assets/icons/1m.png',
                            title: ' ',
                            onclick: function () {
                                getCandleData(that.currentTicker, "1m", "7d", () => {
                                    setOptions(that.currentTicker, () => {
                                        that.stockChart.setOption(that.stockChartOptions);
                                    });
                                });
                            }
                        },
                        my2m: {
                            show: true,
                            icon: 'image:///assets/icons/2m.png',
                            title: ' ',
                            onclick: function () {
                                getCandleData(that.currentTicker, "2m", "14d", () => {
                                    setOptions(that.currentTicker, () => {
                                        that.stockChart.setOption(that.stockChartOptions);
                                    });
                                });
                            }
                        },
                        my5m: {
                            show: true,
                            icon: 'image:///assets/icons/5m.png',
                            title: ' ',
                            onclick: function () {
                                getCandleData(that.currentTicker, "5m", "20d", () => {
                                    setOptions(that.currentTicker, () => {
                                        that.stockChart.setOption(that.stockChartOptions);
                                    });
                                });
                            }
                        },
                        my15m: {
                            show: true,
                            icon: 'image:///assets/icons/15m.png',
                            title: ' ',
                            onclick: function () {
                                getCandleData(that.currentTicker, "15m", "30d", () => {
                                    setOptions(that.currentTicker, () => {
                                        that.stockChart.setOption(that.stockChartOptions);
                                    });
                                });
                            }
                        },
                        my30m: {
                            show: true,
                            icon: 'image:///assets/icons/30m.png',
                            title: ' ',
                            onclick: function () {
                                getCandleData(that.currentTicker, "30m", "45d", () => {
                                    setOptions(that.currentTicker, () => {
                                        that.stockChart.setOption(that.stockChartOptions);
                                    });
                                });
                            }
                        },
                        my1h: {
                            show: true,
                            icon: 'image:///assets/icons/1h.png',
                            title: ' ',
                            onclick: function () {
                                getCandleData(that.currentTicker, "1h", "70d", () => {
                                    setOptions(that.currentTicker, () => {
                                        that.stockChart.setOption(that.stockChartOptions);
                                    });
                                });
                            }
                        },
                        myytd: {
                            show: true,
                            icon: 'image:///assets/icons/ytd.png',
                            title: ' ',
                            onclick: function () {
                                getCandleData(that.currentTicker, "1h", "ytd", () => {
                                    setOptions(that.currentTicker, () => {
                                        that.stockChart.setOption(that.stockChartOptions);
                                    });
                                });
                            }
                        },
                        myall: {
                            show: true,
                            icon: 'image:///assets/icons/max.png',
                            title: ' ',
                            onclick: function () {
                                getCandleData(that.currentTicker, "1h", "max", () => {
                                    setOptions(that.currentTicker, () => {
                                        that.stockChart.setOption(that.stockChartOptions);
                                    });
                                });
                            }
                        }
                    },
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
                        color: '#ff394f'
                    }, {
                        value: 1,
                        color: '#1ec481'
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
                        data: that.dates,
                        scale: true,
                        boundaryGap: false,
                        axisLine: { lineStyle: { color: '#8392A5' } },
                        splitLine: { show: false },
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
                        data: that.dates,
                        scale: true,
                        boundaryGap: false,
                        axisLine: { lineStyle: { color: '#8392A5' } },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: { show: false },
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
                        axisTick: { show: false }
                    }
                ],
                dataZoom: [
                    {
                        type: 'inside',
                        xAxisIndex: [0, 1],
                        start: 90,
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
                        }, textStyle: {
                            color: '#8392A5',
                            fontFamily: 'Lato',
                            fontSize: '16'
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
                        name: company,
                        type: 'candlestick',
                        data: that.candles,
                        itemStyle: {
                            normal: {
                                color: '#1ec481',
                                color0: '#ff394f',
                                borderColor: null,
                                borderColor0: null
                            }
                        }
                    },
                    {
                        name: 'MA5',
                        type: 'line',
                        data: that.calculateMA(5, that.candles),
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
                        data: that.calculateMA(10, that.candles),
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
                        data: that.calculateMA(20, that.candles),
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
                        data: that.calculateMA(30, that.candles),
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
                        data: that.volumes
                    }
                ]
            };
            callback();

        }

        async function getSubscription(ticker: string) {
            const headers = new HttpHeaders({
                'Content-Type': 'application/json; charset=utf-8',
                'x-auth-token': JSON.parse(localStorage.getItem("currentUser")).account.token
            });
            return await that.http.get(APP_DI_CONFIG.apiEndpoint + '/subscriptions/ticker/' + ticker, { headers }).toPromise().then((data) => {
                return data;
            });
        }

        document.getElementById('stockChart').style.height = (window.innerHeight - window.innerWidth * 2 / 100 - 20) + "px";

        this.companiesForm = this.fb.group({
            suggestionInput: null
        });
        this.suggestions = this.fb.group({
            interval: "0"
        });
        getSubscription(this.currentTicker).then((value) => {
            this.suggestions.controls.interval.setValue(value["candleSize"]);
        });
        this.companiesForm
            .get('suggestionInput')
            .valueChanges
            .pipe(
                debounceTime(300),
                tap(() => this.isLoading = true),
                switchMap(value => this.suggestionService.search(value)
                    .pipe(
                        finalize(() => this.isLoading = false),
                    )
                )
            )
            .subscribe(suggestion => this.filteredSuggestions = suggestion.results);
        this.displayFn = (suggestion: Suggestion) => {
            if (suggestion) {
                getCandleData(suggestion.symbol, "30m", "20d", () => {
                    setOptions(suggestion.symbol, () => {
                        this.stockChart.setOption(this.stockChartOptions);
                    });
                });
                getSubscription(suggestion.symbol).then((value) => {
                    this.suggestions.controls.interval.setValue(value["candleSize"]);
                });
                this.currentTicker = suggestion.symbol;
                return suggestion.symbol;
            }
        }
        getCandleData(this.currentTicker, "30m", "20d", () => {
            setOptions(this.currentTicker, () => {
                this.stockChart.setOption(this.stockChartOptions);
            });
        });

    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        document.getElementById('stockChart').style.height = (window.innerHeight - window.innerWidth * 2 / 100 - 20) + "px";
        this.stockChart.resize();
    }
    submitSubscription() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'x-auth-token': JSON.parse(localStorage.getItem("currentUser")).account.token
        });
        this.http.post(APP_DI_CONFIG.apiEndpoint + '/subscriptions', {
            'ticker': this.currentTicker,
            'candleSize': this.suggestions.controls.interval.value
        }, { headers }).toPromise().then((data) => {
            this.toastr.info('Your subscription for ' +
                this.currentTicker + ' is now set to: ' +
                (this.suggestions.controls.interval.value == 0 ? "none" : this.suggestions.controls.interval.value), 'Subscription updated!', { timeOut: 3000, positionClass: "toast-top-right" });
        });
    }
}