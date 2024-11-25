import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientInformationComponent } from './client-information/client-information.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { ExportPageComponent } from './export-page/export-page.component';


const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'client',
        component: ClientInformationComponent
    },
    {
        path: 'search',
        component: SearchPageComponent
    },
    {
        path: 'exports',
        component: ExportPageComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoreRoutingModule {
}
