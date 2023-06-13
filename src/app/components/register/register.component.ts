import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { validarPassword } from 'src/app/validator/password-validator';
import { SwAlertService } from 'src/app/services/sw.alert.service';
import { TimerService } from 'src/app/services/api.time.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  correovalido: boolean = false;
  correoEnviado: boolean = false;
  passwordVisible = false;

  mostrarLogin: boolean = false;
  mostrarLoading: boolean = false;

  @ViewChild('validacorreo') miModal: any;

  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(16),
  ]);

  formRegistro = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(/[a-zA-Z ]\d{0,9}/)]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      validarPassword
    ]),

    correo: new FormControl('', [Validators.required, Validators.email]),
    nombres: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
    apellidos: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
    rol: new FormControl('Administrador', [Validators.required]),
  });

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
  ) {

  }

  get code() {
    return this.codigoverificacion;
  }

  get controls() {
    return this.formRegistro.controls;
  }

  get isCorreoConfirmado() {
    return this.correovalido;
  }

  get sendMail() {
    return this.correoEnviado;
  }

  ngOnInit(): void {
  }

  mostrarComponenteLogin() {
    this.router.navigateByUrl('/Login')
  }

  resetTimer() {
    this.time.stopTimer();
  }

  startTimer() {
    this.time.startTimer(6, 0);
  }


  codigoverificacion() {
    if (!this.formRegistro.get('correo')?.value) {
      return;
    }
    this.correoEnviado = true;
    this.service.enviarCodigo(this.formRegistro.get('correo')?.value!).subscribe({
      next: (data) => {
      }, error: (error) => {
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  cerrarModal() {
    const closeButton = this.elementRef.nativeElement.querySelector('.btn-close');
    this.renderer.setAttribute(closeButton, 'data-bs-dismiss', 'modal');
    closeButton.click();
  }

  confirmarCorreo() {
    this.mostrarLoading = true;
    this.service.validarCorreo(this.formRegistro.value.correo!, this.codigoVerificado.value.codigo!).subscribe({
      next: (data) => {
        this.mostrarLoading = false;
        this.Swal.showSuccess("Codigo verificado!!").then((result) => {
          this.codigoVerificado.reset();
          this.cerrarModal();
          if (!result.isConfirmed || !this.formRegistro.valid) {
            return;
          }
          this.mostrarLoading = true;
          this.service.registrarUsuario(this.formRegistro.value as any).subscribe({
            next: (data) => {
              this.mostrarLoading = false;
              this.Swal.showSuccess("Usuario registrado con exito").then((result) => {
                if (result.isConfirmed) {
                  this.router.navigateByUrl('/login')
                }
              });
            },
            error: (error) => {
              this.mostrarLoading = false;
              let mensajeError: string = error.error.meta.message;
              const textoModificado = mensajeError.replace(/\[([^[\]]+)\]/g, "!$1¡");
              this.Swal.showError(textoModificado).then((result) => {
                if (!result.isConfirmed || !this.formRegistro.valid) {
                  return;
                }
              });
            }
          });
        });

      },
      error: (error) => {
        this.mostrarLoading = false;
        let mensajeError: string = error.error.meta.message;
        const textoModificado = mensajeError.replace(/\[([^[\]]+)\]/g, "¡$1!");
        this.Swal.showError(textoModificado).then((result) => {
          if (!result.isConfirmed || !this.formRegistro.valid) {
            return;
          }
        });
      }
    });
  }
}

