import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';



import { AppConfigModule } from './app-config.module';
import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';


import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './dashboard/transactions/transactions.component';
import { DashboardChartsComponent } from './dashboard/dashboard-charts/dashboard-charts.component';

import { SearchComponent } from './search/search.component';

import { PortfolioComponent } from './portfolio/portfolio.component';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AuthenticationService, UserService, SuggestionService } from './_services';
import { MaterialModule } from './material-module';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TransactionsComponent,
    SearchComponent,
    DashboardChartsComponent,
    LoginComponent,
    PortfolioComponent
  ],
  imports: [
    AppConfigModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    SuggestionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
