import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SwAlertService } from '../services/sw.alert.service';



@Injectable({
    providedIn: 'root'
})
export class AuthLoginService {

    constructor(
        private http: HttpClient,
        private Swal: SwAlertService,
        private router: Router
    ) { }

    private getHeaders(): HttpHeaders {
        // Aquí puedes agregar encabezados personalizados si es necesario
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return headers;
    }

    login(usuario: string, pwd: string): Observable<any> {
        const body = { usuario, pwd };
        return this.http.post(`${environment.apiUrlLogin}/login/signin`, body, { headers: this.getHeaders() });
    }

    verifyToken() {
        const tokenWithQuotes = sessionStorage.getItem('session');

        let token = '';
        if (tokenWithQuotes) {
            token = tokenWithQuotes.replace(/"/g, '');
        }

        const body = { token };

        this.http.post(`${environment.apiUrlLogin}/login/verify`, body, { headers: this.getHeaders() }).subscribe({
            next: (data: any) => {
                sessionStorage.setItem('session', data.data.token);
            }, error: (error) => {
                this.Swal.showError("Se expiro la sesion, sera redirigido a login!!").then((result) => {
                    if (result.isConfirmed) {
                        sessionStorage.removeItem('session');
                        sessionStorage.removeItem('user');
                        sessionStorage.removeItem('timeExpired');
                        this.router.navigateByUrl('/login')
                    }
                });
            }
        })
    }
}
