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
  styleUrls: ['./portfolio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioComponent implements OnInit {
  portfolio: any[];
  portfolioDT: any;
  subscriptions: any[];
  subscriptionsDT: any;

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
  closePortfolio() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': JSON.parse(localStorage.getItem("currentUser")).account.token
    });

    this.http.get(APP_DI_CONFIG.apiEndpoint + '/quotes/activeHours', { headers }).toPromise()
      .then((market: any) => {
        if (market.marketState == "PRE") this.toastr.warning('Market is not opened yet! Positions were not closed!', 'Market is currently closed!', { timeOut: 4000, positionClass: "toast-top-right" });
        else {
          this.http.get(APP_DI_CONFIG.apiEndpoint + '/portfolios/me', { headers }).toPromise()
            .then(async (data: Array<Object>) => {
              Promise.all([
                data.map(async (position: any) => {
                  const multiplier: number = position.type == "buy" ? 1 : -1;
                  let transactionObject: object = {
                    ticker: position.ticker,
                    type: position.type == "buy" ? "sell" : "cover",
                    stockPrice: position.value / position.volume,
                    volume: position.volume,
                    strategy: position.strategy,
                    total: position.value * multiplier
                  }
                  const result = await this.http.post(APP_DI_CONFIG.apiEndpoint + '/transactions', transactionObject, { headers }).toPromise().then((data: any) => {
                    return 200;
                  }).catch(err => {
                    return 400;
                  });
                  return result;
                })
              ])
                .then((results: any) => {
                  function resolveResults(results, that) {
                    let error: boolean = false;
                    console.log(results);
                    results.forEach(element => {
                      if (element.__zone_symbol__value == undefined) { return 0; }
                      else if (element.__zone_symbol__value.length == 0) { return 0; }
                      else {
                        console.log(element, element.__zone_symbol__value);
                        if (element.__zone_symbol__value == 400) error = true;
                      }
                    });
                    if (error) that.toastr.error('There was an error closing your portfolio!', 'Something failed!', { timeOut: 4000, positionClass: "toast-top-right" });
                    else {
                      that.toastr.info('All current positions in the portfolio were closed!', 'Positions closed!', { timeOut: 3000, positionClass: "toast-top-right" });
                    }
                    return 1;
                  }

                  if (!resolveResults(results, this)) {
                    setTimeout(() => {
                      resolveResults(results, this)
                    }, 10);
                  };
                })
                .catch(err => {
                  console.log(err);
                  this.toastr.error('There was an error closing your portfolio!', 'Something failed!', { timeOut: 4000, positionClass: "toast-top-right" });
                });
            })
            .catch(err => {
              console.log("yo2");
              this.toastr.error('There was an error closing your portfolio!', 'Something failed!', { timeOut: 4000, positionClass: "toast-top-right" });
            });
        }
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
