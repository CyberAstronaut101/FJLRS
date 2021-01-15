import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MessageService } from 'primeng/api';
import { PMessage } from 'src/assets/interfaces';

@Component({
    templateUrl: './error.component.html'
})
export class ErrorComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: {message: PMessage}) {
        console.log(data.message);
        
    }

    message = "An unknown error occured!"

}