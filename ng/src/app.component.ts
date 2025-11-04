import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Toast } from 'primeng/toast';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, Toast],
    template: `<p-toast [breakpoints]="{ '920px': { width: '100%', right: '0', left: '0' } }"></p-toast> <router-outlet></router-outlet>`
})
export class AppComponent {}
