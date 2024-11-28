import { NgModule } from '@angular/core';
import { CoreRoutingModule } from './core-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { PasswordModule } from 'primeng/password';
import { LoginComponent } from './login/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
    declarations: [
        DashboardComponent, 
        LoginComponent
    ],
    imports: [
        CommonModule,
        CoreRoutingModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        HighchartsChartModule,
        PasswordModule,
        InputTextModule,
        DropdownModule,
        SkeletonModule,
        ProgressSpinnerModule
    ],
    providers: [],
})
export class CoreModule {}
