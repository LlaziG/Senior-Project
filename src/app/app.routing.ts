import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

import { SearchComponent } from './search/search.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

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
    {
        path: 'portfolio',
        component: PortfolioComponent,
        canActivate: [AuthGuard],
        data: { state: 'portfolio' }
    },

    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);