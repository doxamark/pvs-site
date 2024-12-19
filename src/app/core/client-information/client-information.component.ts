import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ClientService } from 'src/app/shared/service/client.service';

@Component({
    templateUrl: './client-information.component.html',
    styleUrl: './client-information.component.scss',
})
export class ClientInformationComponent implements OnInit {
    clientInfo: any = {};
    sectionLoading: boolean = false;
    constructor(
        private messageService: MessageService,
        private clientService: ClientService
    ) {}

    ngOnInit(): void {
        this.loadClientInformation(); // Load client info when the component is initialized
    }

    loadClientInformation(): void {
        this.sectionLoading = true;
        setTimeout(() => {
            this.clientService.getClientInformation().subscribe(
                (response) => {
                    // Set the fetched data to the component variable
                    this.clientInfo = response;
                    this.sectionLoading = false;
                },
                (error) => {
                    // Handle error if needed
                    this.messageService.add({
                        severity: 'error',
                        detail: 'Failed to load client information.',
                    });
                }
            );
        }, 1000);
    }

    copyToClipboard(value: string): void {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        // Use MessageService to show the success message
        this.messageService.add({
            severity: 'success',
            detail: 'The content has been copied to the clipboard.',
        });
    }
}
