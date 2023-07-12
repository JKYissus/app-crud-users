import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { TimerService } from 'src/app/services/api.time.service';
import { SwAlertService } from 'src/app/services/sw.alert.service';

interface User {
  username: string;
  nombres: string;
  apellidos: string;
  correo: string;
  id: string;
}

interface UserSession {
  id: string;
  correo: string;
  rol: string;
  username: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  correovalido: boolean = false;
  correoEnviado: boolean = false;
  habilidarBtnEditar: boolean = false;
  passwordVisible = false;
  users: User[] = [];
  filteredUsers: User[] = [];
  userid: UserSession = JSON.parse(sessionStorage.getItem('user')!.toString());

  formUser = new FormGroup({
    username: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required]),
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    id: new FormControl(this.userid.id, [Validators.required]),
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

  get code() {
    return this.codigoverificacion;
  }

  get controls() {
    return this.formUser.controls;
  }

  get isCorreoConfirmado() {
    return this.correovalido;
  }

  get sendMail() {
    return this.correoEnviado;
  }

  ngOnInit(): void {
    this.getUserLoged();
    this.correovalido = false;
  }

  resetTimer() {
    this.time.stopTimer();
  }

  startTimer() {
    this.time.startTimer(6, 0);
  }

  validarCorreo(): boolean {
    let user: UserSession = JSON.parse(sessionStorage.getItem('user')!.toString());

    if (user.correo != this.formUser.get('correo')!.value) {
      return false;
    }

    return true;
  }

  codigoverificacion() {

    if (this.habilidarBtnEditar) {
      return;
    }

    this.correovalido = true;
    let user: UserSession = JSON.parse(sessionStorage.getItem('user')!.toString());

    if (!this.formUser.get('correo')?.value) {
      this.habilidarBtnEditar = false;
      return;
    }

    if (this.validarCorreo()) {
      this.guardarPerfil();
      return;
    }

    this.correoEnviado = true;
    this.service.enviarCodigo(this.formUser.get('correo')!.value!).subscribe({
      next: (data) => {
        this.habilidarBtnEditar = true;
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
    this.service.validarCorreo(this.formUser.value.correo!, this.codigoVerificado.value.codigo!).subscribe({
      next: (data) => {
        this.Swal.showSuccess("Codigo verificado!!").then((result) => {
          this.codigoVerificado.reset();
          this.cerrarModal();
          if (!result.isConfirmed || !this.formUser.valid) {
            return;
          }
          this.guardarPerfil();
        });
      },
      error: (error) => {
        let mensajeError: string = error.error.meta.message;
        const textoModificado = mensajeError.replace(/\[([^[\]]+)\]/g, "¡$1!");
        this.Swal.showError(textoModificado).then((result) => {
          if (!result.isConfirmed || !this.formUser.valid) {
            return;
          }
        });
      }
    });
  }



  guardarPerfil() {
    let userid: UserSession = JSON.parse(sessionStorage.getItem('user')!.toString());
    let id = userid.id;
    this.service.getUserLoged(this.formUser.value as any).subscribe({
      next: (data) => {
        this.Swal.showSuccess("Usuario actualizado!!").then((result) => {
          if (result.isConfirmed) {
            this.habilidarBtnEditar = true;
            this.getUserLoged();
          }
        });
      }, error: (error) => {
        let mensajeError: string = error.error.meta.message;
        const textoModificado = mensajeError.replace(/\[([^[\]]+)\]/g, "!$1¡");
        this.Swal.showError(textoModificado).then((result) => {
          if (!result.isConfirmed) {
            this.habilidarBtnEditar = true;
            this.getUserLoged();
            return;
          }
        });
      }
    })
  }

  getUserLoged() {
    this.correovalido = false;
    let user: UserSession = JSON.parse(sessionStorage.getItem('user')!.toString());
    this.service.getUsers(0, 100, "").subscribe({
      next: (data: any) => {
        this.filteredUsers = data.data.usuarios.map((user: User) => {
          return {
            username: user.username,
            nombres: user.nombres,
            apellidos: user.apellidos,
            correo: user.correo,
            id: user.id,
          };
        });

        let userid: UserSession = JSON.parse(sessionStorage.getItem('user')!.toString());
        let id = userid.id;

        const exist = this.filteredUsers.find(idUser => idUser.id === id);

        if (exist) {
          this.formUser.patchValue({
            username: exist.username
          });
          this.formUser.patchValue({
            correo: exist.correo
          });
          this.formUser.patchValue({
            nombres: exist.nombres
          });
          this.formUser.patchValue({
            apellidos: exist.apellidos
          });
        }
        this.habilidarBtnEditar = false;
      },
      error: (error: any) => {
        this.habilidarBtnEditar = false;
      }
    });

  }

  validarFormulario(): boolean {
    let userid: UserSession = JSON.parse(sessionStorage.getItem('user')!.toString());
    let id = userid.id;

    const exist = this.filteredUsers.find(idUser => idUser.id === id);

    if (!this.formUser.valid) {
      return false;
    }

    if (exist!.username != this.formUser.value.username ||
      exist!.correo != this.formUser.value.correo ||
      exist!.apellidos != this.formUser.value.apellidos ||
      exist!.nombres != this.formUser.value.nombres) {

      return true;

    }
    return false;
  }

}
