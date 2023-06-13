import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        // Aquí puedes agregar encabezados personalizados si es necesario
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return headers;
    }

    validarCorreo(correo: string, codigo: string) {

        const url = `${environment.apiUrlUser}/email/validar`;
        const params = new HttpParams().set('codigo', codigo).set('correo', correo);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.get(url, { params, headers });
    }

    enviarCodigo(correo: string) {

        const url = `${environment.apiUrlUser}/email/enviar`;
        const body = { correo };

        return this.http.post(url, body, { headers: this.getHeaders() });
    }


    registrarUsuario(usuario: {
        username: string,
        password: string, correo: string, nombres: string,
        apellidos: string, rol: string,
    }) {

        const url = `${environment.apiUrlUser}/usuarios/registrar`;

        return this.http.post(url, usuario, { headers: this.getHeaders() });
    }

    getUsers(numpagina: number, numtampagina: number, usuario: string): Observable<any> {
        const url = `${environment.apiUrlUser}/usuarios`;

        const tokenWithQuotes = sessionStorage.getItem('session');

        let token = '';
        if (tokenWithQuotes) {
            token = tokenWithQuotes.replace(/"/g, '');
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(url, { headers, params: { numpagina, numtampagina, usuario } });
    }

    getUserLoged(usuario: {
        username: string,
        correo: string,
        nombres: string,
        apellidos: string,
        id: string
    }
    ) {

        const tokenWithQuotes = sessionStorage.getItem('session');

        const url = `${environment.apiUrlUser}/usuarios`;

        let token = '';
        if (tokenWithQuotes) {
            token = tokenWithQuotes.replace(/"/g, '');
        }
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.put(url, usuario, { headers });
    }

    changePassowrd(correo: {
        correo: string,
        pwdNueva: string,
        pwdConfirmar: string
    }
    ) {
        const url = `${environment.apiUrlUser}/usuarios/cambiarcontraseña`;

        return this.http.put(url, correo, { headers: this.getHeaders() });
    }
}
