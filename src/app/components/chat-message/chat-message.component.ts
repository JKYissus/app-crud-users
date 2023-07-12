import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  userto: string = "";

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe({
      next: (data: any) => {

        this.userto = data.id;


      }, error: (error) => {

      }
    })
  }

  autoResizeTextArea(textarea: any) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 65) + 'px';
  }
}
