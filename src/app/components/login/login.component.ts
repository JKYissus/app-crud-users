import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, UrlTree } from '@angular/router';
import { AuthLoginService } from 'src/app/auth/auth-login.service';
import { SwAlertService } from 'src/app/services/sw.alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  mostrarRegister: boolean = false;
  mostrarLogin: boolean = true;
  showPassword: boolean = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })


  get controls() {
    return this.loginForm.controls;
  }

  constructor(
    private router: Router,
    private authLogin: AuthLoginService,
    private Swal: SwAlertService
  ) { }

  ngOnInit(): void {
    this.mostrarRegister = false;
  }

  ocultarComponente() {
    this.mostrarRegister = false;
  }

  mostrarComponenteRegister() {
    this.router.navigateByUrl('/dashboard')
  }

  login() {

    this.authLogin.login(this.loginForm.value.username!, this.loginForm.value.password!).subscribe({

      next: (data) => {

        sessionStorage.setItem("session", JSON.stringify(data.data.session));
        sessionStorage.setItem("timeExpired", JSON.stringify(data.data.timeExpire));
        sessionStorage.setItem("user", JSON.stringify(data.data.user));
        sessionStorage.setItem("timeSession", new Date().toUTCString());

        this.Swal.showSuccess("Inicio de sesión exitoso!!").then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('/dashboard/home')
          }
        });
      }, error: (error) => {
        this.Swal.showError(error.error.meta.message);
      }
    })

  }


  onForgotPassword() {
    console.log('Olvidé mi contraseña');
  }
}
