import { AppLayoutComponent } from "./layout/app.layout.component";


import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from "./layout/components/notfound/notfound.component";


const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        loadChildren: () => 
            import('./core/core.module').then((m)=> m.CoreModule)
    },
    { path: 'notfound', component: NotfoundComponent },
    { path: '**', redirectTo: '/notfound' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

