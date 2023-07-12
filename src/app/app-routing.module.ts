import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AuthGuardGuard } from './auth-guard.guard';
import { HomeComponent } from './components/home/home.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChatsComponent } from './components/chats/chats.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'chats', component: ChatsComponent, children: [

          { path: ':id', component: ChatMessageComponent },

        ]
      },
      { path: 'usuarios', component: UsuarioComponent },
      { path: 'perfil', component: PerfilComponent },
    ],
    canActivate: [AuthGuardGuard],
    canActivateChild: [AuthGuardGuard]
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'changePassword', component: ChangePasswordComponent
  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
