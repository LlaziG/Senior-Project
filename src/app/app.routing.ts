import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './dashboard/transactions/transactions.component';
import { DashboardChartsComponent } from './dashboard/dashboard-charts/dashboard-charts.component';

import { SearchComponent } from './search/search.component';
import { LoginComponent } from './login/login.component';

import { AuthGuard } from './_guards';

const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { state: 'dashboard' }
    },
    {
        path: 'search',
        component: SearchComponent,
        canActivate: [AuthGuard],
        data: { state: 'search' }
    },

    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);