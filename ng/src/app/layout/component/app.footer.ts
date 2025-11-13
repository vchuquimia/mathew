import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        con <i class="fas fa-heart text-rose-500"></i> por
        <span class="text-primary font-bold hover:underline">Tigrito</span>
    </div>`
})
export class AppFooter {}
