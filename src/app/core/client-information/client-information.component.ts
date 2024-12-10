import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-client-information',
  standalone: true,
  imports: [],
  templateUrl: './client-information.component.html',
  styleUrl: './client-information.component.scss'
})
export class ClientInformationComponent {

  constructor(private messageService: MessageService) {}

  copyToClipboard(value: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Use MessageService to show the success message
    this.messageService.add({severity:'success',detail: 'The content has been copied to the clipboard.'});
  }
}
