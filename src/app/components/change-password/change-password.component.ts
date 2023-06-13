import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { TimerService } from 'src/app/services/api.time.service';
import { SwAlertService } from 'src/app/services/sw.alert.service';
import { validarPassword } from 'src/app/validator/password-validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {
  correovalido: boolean = false;
  correoEnviado: boolean = false;
  passwordVisibleNew: boolean = false;
  passwordVisibleConfirm: boolean = false;

  cambiarPassword: boolean = false;

  formCorreo = new FormGroup({
    correo: new FormControl('', [Validators.required]),
  })

  formPassword = new FormGroup({
    pwdNueva: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      validarPassword
    ]),
    pwdConfirmar: new FormControl('', [Validators.required]),
  })

  codigoVerificado = new FormGroup({
    codigo: new FormControl('', [Validators.required]),
  })


  constructor(
    private service: ApiService,
    private Swal: SwAlertService,
    private time: TimerService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private router: Router
  ) { }

  get controls() {
    return this.formPassword.controls;
  }

  get code() {
    return this.codigoverificacion;
  }

  get isCorreoConfirmado() {
    return this.correovalido;
  }

  get sendMail() {
    return this.correoEnviado;
  }

  ngOnInit(): void {
  }

  resetTimer() {
    this.time.stopTimer();
  }

  startTimer() {
    this.time.startTimer(6, 0);
  }

  validarPassword(): boolean {

    if (!this.formPassword.valid) {
      return false;
    }

    if (this.formPassword.value.pwdNueva != this.formPassword.value.pwdConfirmar) {
      return false;
    }

    return true;
  }

  codigoverificacion() {
    if (!this.formCorreo.get('correo')?.value) {
      return;
    }
    this.correoEnviado = true;
    this.service.enviarCodigo(this.formCorreo.get('correo')?.value!).subscribe({
      next: (data) => {
      }, error: (error) => {
      }
    });
  }

  togglePasswordVisibilityNew() {
    this.passwordVisibleNew = !this.passwordVisibleNew;
  }
  togglePasswordVisibilityConfirm() {
    this.passwordVisibleConfirm = !this.passwordVisibleConfirm;
  }

  cerrarModal() {
    const closeButton = this.elementRef.nativeElement.querySelector('.btn-close');
    this.renderer.setAttribute(closeButton, 'data-bs-dismiss', 'modal');
    closeButton.click();
  }

  confirmarCorreo() {

    this.service.validarCorreo(this.formCorreo.value.correo!, this.codigoVerificado.value.codigo!).subscribe({
      next: (data) => {
        this.Swal.showSuccess("Codigo verificado!!").then((result) => {
          this.codigoVerificado.reset();
          this.cambiarPassword = true;
          this.cerrarModal();
          if (!result.isConfirmed || !this.formCorreo.valid) {
            return;
          }
        });
      },
      error: (error) => {
        let mensajeError: string = error.error.meta.message;
        const textoModificado = mensajeError.replace(/\[([^[\]]+)\]/g, "¡$1!");
        this.Swal.showError(textoModificado).then((result) => {
          if (!result.isConfirmed || !this.formCorreo.valid) {
            return;
          }
        });
      }
    });


  }

  cambiarPasswordVerificado() {

    if (this.formCorreo.invalid || this.formPassword.invalid) {
      return;
    }

    const correo = {
      correo: this.formCorreo.value.correo!,
      pwdNueva: this.formPassword.value.pwdNueva!,
      pwdConfirmar: this.formPassword.value.pwdConfirmar!
    };

    this.service.changePassowrd(correo).subscribe({
      next: (data) => {
        this.Swal.showSuccess("Contraseña cambiada!!").then((result) => {
          if (!result.isConfirmed || !this.formPassword.valid) {
            return;
          }
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        let mensajeError: string = error.error.meta.message;
        console.log(error);
        this.Swal.showError(mensajeError).then((result) => {
          if (!result.isConfirmed || !this.formPassword.valid) {
            return;
          }
        });
      }
    })
  }
}