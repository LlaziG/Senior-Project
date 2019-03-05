import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.component.html',
  styleUrls: ['./dashboard-charts.component.css']
})
export class DashboardChartsComponent implements OnInit {

  constructor() { }
  performanceChart: any;
  performanceChartOptions: any;

  ngOnInit() {
    this.performanceChart = echarts.init(document.getElementById('bot-performance'));
    this.performanceChartOptions = {
      textStyle: {
        color: 'white'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Total Progress', 'Daily Change'],
        textStyle: {
          color: 'white'
        }
      },
      color: ['#ffa000', '#156BBF'],
      calculable: true,
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ]
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [
        {
          name: 'Total Progress',
          type: 'line',
          smooth: true,
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
          data: [2, 7.1, 6.029, 2.8481, 5.9336, 8.0522, 12.3743]
        },
        {
          name: 'Daily Change',
          type: 'line',
          smooth: true,
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
          data: [2, 5, -1, -3, 3, 2, 4]
        }
      ]
    };
    this.performanceChart.setOption(this.performanceChartOptions);
  }
  onResize(event) {
    this.performanceChart.setOption(this.performanceChartOptions);
  }
}
