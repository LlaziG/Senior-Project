import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { APP_DI_CONFIG } from '../../app-config.module';


import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transactions: any[];
  dataTable: any;

  constructor(
    private http: HttpClient,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'x-auth-token': JSON.parse(localStorage.getItem("currentUser")).account.token
    });
    this.http.get(APP_DI_CONFIG.apiEndpoint + '/transactions/me', { headers })
      .subscribe((data: any[]) => {
        this.transactions = data;

        this.chRef.detectChanges();

        const table: any = $('table');
        this.dataTable = table.DataTable();
      });
  }

}