import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

interface User {
  username: string;
  nombres: string;
  apellidos: string;
  correo: string;
  id: string;
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  mostrarMenu: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private service: ApiService
  ) { }

  selectedUser: any = null;
  userselect: string = "";
  users: User[] = [];
  filteredUsers: User[] = [];
  ngOnInit(): void {

    this.route.firstChild?.params.subscribe({
      next: (data: any) => {
        console.log(data);
        this.userselect = data.id;
      }, error: (error) => {

      }
    })
    this.getUserLoged()
  }

  selectUser(user: any) {
    this.selectedUser = user;
  }

  getUserLoged() {
    this.service.getUsers(0, 100, this.userselect!).subscribe({
      next: (data: any) => {
        this.filteredUsers = [...
          data.data.usuarios.map((user: User) => {
            return {
              username: user.username,
              nombres: user.nombres,
              apellidos: user.apellidos,
              correo: user.correo,
              id: user.id,
            }
          })
        ];
      }, error: (error) => {

      }
    });
  }

}
