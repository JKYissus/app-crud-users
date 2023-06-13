import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwAlertService } from './sw.alert.service';
import { AuthLoginService } from '../auth/auth-login.service';

@Injectable({
    providedIn: 'root',

})
export class InteractionService {

    constructor(
        public refrescar: AuthLoginService,
        public router: Router,
        public Swal: SwAlertService,
        public route: ActivatedRoute
    ) {
        this.addInteractionListener();
    }

    addInteractionListener() {

        document.addEventListener('mousemove', () => { this.handleInteraction(); });
        document.addEventListener('click', () => { this.handleInteraction(); });
    }

    handleInteraction() {

        const session = sessionStorage.getItem('timeSession')?.toString()

        const currentUrl = this.router.url;

        if (currentUrl.includes('login') || currentUrl.includes('register') || currentUrl.includes('changePassword')) {
            return;
        }

        if (!session) {
            this.refrescar.verifyToken();
            return;
        }

        const date = new Date(session!);
        const diff = new Date().getTime() - date.getTime();

        if (diff > 1000 * 60 * 8) {
            sessionStorage.setItem('timeSession', new Date().toUTCString())
            this.refrescar.verifyToken();
        }

        return;

    }
}