import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_DI_CONFIG } from '../../app-config.module';

import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.component.html',
  styleUrls: ['./dashboard-charts.component.scss']
})
export class DashboardChartsComponent implements OnInit {

  constructor(private http: HttpClient) { }
  lineChart: any;
  lineChartOptions: any;
  scatterChart: any;
  scatterChartOptions: any;

  lineStrategies = new Array();
  lineStrategySeries = new Array();
  lineDates = new Array();
  scatterStrategies = new Array();
  colors = ["#16a085", "#2980b9", "#474787", "#c0392b", "#8e44ad"]

  ngOnInit() {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': JSON.parse(localStorage.getItem("currentUser")).account.token
    });
    this.http.get(APP_DI_CONFIG.apiEndpoint + '/strategies/me/grouped', { headers }).toPromise().then((strategiesData: any) => {
      strategiesData.forEach(strategy => {
        this.scatterStrategies.push([strategy.profit, strategy._id.strategy, strategy._id.ticker]);
      });
      this.scatterChart = echarts.init(document.getElementById("scatter-performance"));
      this.scatterChartOptions = {
        tooltip: {
          padding: 10,
          backgroundColor: '#222',
          formatter: function (obj) {
            var value = obj.value;
            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
              + value[2] + '</div>'
              + 'Strategy：' + value[1] + '<br>'
              + 'Profit：' + value[0] + '<br>'
          }
        },
        xAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#EEEEEE' } },
        },
        yAxis: {
          type: 'category',
          axisLine: { lineStyle: { color: '#EEEEEE' } },
        },
        series: [
          {
            symbolSize: 8,
            type: 'scatter',
            data: this.scatterStrategies
          }
        ]
      }
      this.scatterChart.setOption(this.scatterChartOptions);
    });

    this.http.get(APP_DI_CONFIG.apiEndpoint + '/strategies/me/dates', { headers }).toPromise().then((strategiesData: any) => {
      strategiesData.forEach(strategy => {
        if (this.lineStrategies.indexOf(strategy._id.strategy) == -1) {
          this.lineStrategies.push(strategy._id.strategy);
          this.lineStrategySeries.push({
            name: strategy._id.strategy,
            type: 'line',
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: []
          })
        }
        if (this.lineDates.indexOf(strategy._id.month + "/" + strategy._id.day + "/" + strategy._id.year) == -1) {
          this.lineDates.push(strategy._id.month + "/" + strategy._id.day + "/" + strategy._id.year);
        }
      });
      this.lineStrategySeries.forEach(series => {
        for (let i = 0; i < this.lineDates.length; i++) series.data.push(0);
      });
      strategiesData.forEach(strategy => {
        this.lineStrategySeries.forEach(series => {
          if (series.name == strategy._id.strategy) {
            series.data[this.lineDates.indexOf(strategy._id.month + "/" + strategy._id.day + "/" + strategy._id.year)] = strategy.profit;
          }
        });
      });
      this.lineChart = echarts.init(document.getElementById('bot-performance'));
      this.lineChartOptions = {
        textStyle: {
          color: '#EEEEEE'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.lineStrategies,
          textStyle: {
            color: '#EEEEEE'
          }
        },
        color: this.colors,
        calculable: true,
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.lineDates
        }],
        yAxis: [{
          type: 'value'
        }],
        series: this.lineStrategySeries
      };
      this.lineChart.setOption(this.lineChartOptions);
    });



  }
  onResize(event) {
    this.lineChart.setOption(this.lineChartOptions);
  }
}
