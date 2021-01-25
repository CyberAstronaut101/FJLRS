import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'],
  styles: [`:host /deep/ .ui-steps .ui-steps-item {
    width: 20%;
}`],
  providers: [MessageService]
})
export class RequestFormComponent implements OnInit {

  items: MenuItem[];

  constructor() { }

  ngOnInit() {

    this.items = [{
      label: 'Upload Files',
      routerLink: 'uploadFiles'
  },
  {
      label: 'Select Material and Color',
      routerLink: 'materials'
  },
  {
      label: 'Additional Options',
      routerLink: 'extraOptions'
  },
  {
      label: 'Job Quote',
      routerLink: 'quote'
  },
  {
    label: 'Submit Request',
    routerLink: 'submitRequest'
  }
];
  }

}
