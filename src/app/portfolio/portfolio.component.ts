import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_DI_CONFIG } from '../app-config.module';
import { ToastrService } from 'ngx-toastr';

import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioComponent implements OnInit {
  portfolio: any[];
  portfolioDT: any;
  subscriptions: any[];
  subscriptionsDT: any;
  headers: any;

  constructor(
    private http: HttpClient,
    private chRef: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getPortfolio();
    this.getSubscriptions();
  }
  getPortfolio() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': JSON.parse(localStorage.getItem("currentUser")).account.token
    });

    this.http.get(APP_DI_CONFIG.apiEndpoint + '/portfolios/me', { headers })
      .subscribe((data: any[]) => {
        this.portfolio = data;
        this.chRef.detectChanges();

        const table: any = $('table.portfolio');
        this.portfolioDT = table.DataTable();
      });
  }
  getSubscriptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': JSON.parse(localStorage.getItem("currentUser")).account.token
    });

    this.http.get(APP_DI_CONFIG.apiEndpoint + '/subscriptions/me', { headers })
      .subscribe((data: any[]) => {
        this.subscriptions = data;
        this.chRef.detectChanges();

        const table: any = $('table.subscription');
        this.subscriptionsDT = table.DataTable();
      });
  }
  editSubscription(event) {
    const ticker = event.target.id.substr(5);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': JSON.parse(localStorage.getItem("currentUser")).account.token
    });

    this.http.post(APP_DI_CONFIG.apiEndpoint + '/subscriptions', {
      'ticker': ticker,
      'candleSize': document.getElementById('select-' + ticker)["value"]
    }, { headers }).toPromise().then((data) => {
      this.toastr.info('Your subscription for ' +
        ticker + ' is now set to: ' +
        (document.getElementById('select-' + ticker)["value"] == 0 ? "none" : document.getElementById('select-' + ticker)["value"]), 'Subscription updated!', { timeOut: 3000, positionClass: "toast-top-right" });
    });
  }
  deleteSubscription(event) {
    const ticker = event.target.id.substr(7);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': JSON.parse(localStorage.getItem("currentUser")).account.token
    });
    this.http.delete(APP_DI_CONFIG.apiEndpoint + '/subscriptions/ticker/' + ticker, { headers }).toPromise().then((data) => {
      this.getSubscriptions();
      this.toastr.info('Your subscription for ' +
        ticker + ' is now removed', 'Unsubscribed!', { timeOut: 3000, positionClass: "toast-top-right" });
    });
  }
}
