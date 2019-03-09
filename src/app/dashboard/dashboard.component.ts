import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_DI_CONFIG } from '../app-config.module';

import { trigger, stagger, animate, style, group, query as q, transition, keyframes } from '@angular/animations';
const query = (s, a, o = { optional: true }) => q(s, a, o);

export const dashboardTransition = trigger('dashboardTransition', [
  transition(':enter', [
    query('.card', style({ opacity: 0 })),
    query('.card', stagger(100, [
      style({ transform: 'translateY(100px)' }),
      animate('600ms cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateY(0px)', opacity: 1 })),
    ])),
  ]),
  transition(':leave', [
    query('.card', stagger(100, [
      style({ transform: 'translateY(0px)', opacity: 1 }),
      animate('600ms cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateY(100px)', opacity: 0 })),
    ])),
  ])
]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [dashboardTransition],
  host: {
    '[@dashboardTransition]': ''
  }
})
export class DashboardComponent implements OnInit {
  constructor(private http: HttpClient) { }
  netWorth = 0;
  available = 0;
  provisions = 0;
  todayChange = 0;
  todayChangeP = 0;
  monthChange = 0;
  monthChangeP = 0;
  ytdChange = 0;
  ytdChangeP = 0;

  ngOnInit() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': JSON.parse(localStorage.getItem("currentUser")).account.token
    });
    this.http.get(APP_DI_CONFIG.apiEndpoint + '/portfolios/me', { headers }).toPromise().then((portfolioData: any) => {
      var portfolioValue = 0;

      portfolioData.forEach(pos => {
        portfolioValue += pos.profit
      });
      this.http.get(APP_DI_CONFIG.apiEndpoint + '/wallets/me', { headers }).toPromise().then((walletData: any) => {
        this.netWorth = portfolioValue + walletData.available - walletData.provisions;
        this.available = walletData.available - walletData.provisions;
        this.provisions = walletData.provisions;

        this.http.get(APP_DI_CONFIG.apiEndpoint + '/strategies/me/day', { headers }).toPromise().then((strategiesData: any) => {
          if(this.netWorth != 0) {
            this.todayChange = strategiesData[0].profit;
            this.todayChangeP = strategiesData[0].profit / this.netWorth;
          }
          else {
            this.todayChange = 0;
            this.todayChangeP = 0;
          }
        });
        this.http.get(APP_DI_CONFIG.apiEndpoint + '/strategies/me/month', { headers }).toPromise().then((strategiesData: any) => {
          if(this.netWorth != 0) {
            this.monthChange = strategiesData[0].profit;
            this.monthChangeP = strategiesData[0].profit / this.netWorth;
          }
          else {
            this.monthChange = 0;
            this.monthChangeP = 0;
          }
        });
        this.http.get(APP_DI_CONFIG.apiEndpoint + '/strategies/me/year', { headers }).toPromise().then((strategiesData: any) => {
          if(this.netWorth != 0) {
            this.ytdChange = strategiesData[0].profit;
            this.ytdChangeP = strategiesData[0].profit / this.netWorth;
          }
          else {
            this.ytdChange = 0;
            this.ytdChangeP = 0;
          }
        });
      });
    });
  }

}
