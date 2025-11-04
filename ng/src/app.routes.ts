import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { ExpensesComponent } from '@/expenses/expenses.component';
import { CategoryComponent } from '@/category/category.component';
import { BudgetComponent } from '@/budget/budget.component';
import { ReportComponent } from '@/report/report.component';
import { IncomeSourceComponent } from '@/income-source/income-source.component';
import { IncomeComponent } from '@/income/income.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            {path: 'category', component: CategoryComponent},
            {path: 'expenses', component: ExpensesComponent},
            {path: 'budget', component: BudgetComponent},
            {path: 'report', component: ReportComponent},
            {path: 'incomesource', component: IncomeSourceComponent},
            {path: 'income', component: IncomeComponent},

        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' },
];
