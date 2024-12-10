import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../shared/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    logout: any;

    constructor(public layoutService: LayoutService, private authService: AuthService,  private router: Router) { }

    ngOnInit() {
        this.logout = {
            label: '',
            items: [
                { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => this.handleLogout(), },
            ]
        }
        this.model = [
            {
                label: '',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Client Information', icon: 'pi pi-fw pi-id-card', routerLink: ['/client'] },
                    { label: 'Search', icon: 'pi pi-fw pi-search', routerLink: ['/search'] },
                    { label: 'Exports', icon: 'pi pi-fw pi-file-export', routerLink: ['/exports'] },
                ]
            },
        ];
    }

    handleLogout(): void {
        this.authService.logout(); // Perform logout logic
        this.router.navigate(['/login']); // Redirect to login page
    }
}
