import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit(){
    let myChart = echarts.init(document.getElementById('bot-performance'));
    let chartOptions = {
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
          itemStyle: {normal: {areaStyle: {type: 'default'}}},
          data: [2, 7.1, 6.029, 2.8481, 5.9336, 8.0522, 12.3743]
        },
        {
          name: 'Daily Change',
          type: 'line',
          smooth: true,
          itemStyle: {normal: {areaStyle: {type: 'default'}}},
          data: [2, 5, -1, -3, 3, 2, 4]
        }
      ]
    };
    myChart.setOption(chartOptions);
  }
}
