import { AppLayoutComponent } from "./layout/app.layout.component";


import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from "./layout/components/notfound/notfound.component";
import { LoginComponent } from "./core/login/login.component";
import { AuthGuard } from "./shared/auth/auth.guard";


const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [AuthGuard] ,
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

