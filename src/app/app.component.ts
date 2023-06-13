import { Component } from '@angular/core';
import { InteractionService } from './services/api.iteraction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app-crud';


  constructor(
    private interaction: InteractionService
  ) {

  }
}
