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

  public activeIndex: number = 0;

  increaseIndex() {
    this.activeIndex++;
  }

  decreaseIndex() {
    this.activeIndex--;
  }

  setIndex(index: number) {
    if(index >= 0 && index <=4){
      this.activeIndex = index;
    }
  }

  ngOnInit() {

    this.items = [{
          label: 'Upload Files'
      },
      {
          label: 'Select Material and Color'
      },
      {
          label: 'Additional Comments'
      },
      {
          label: 'Job Quote'
      },
      {
        label: 'Submit Request'
      }
    ];
  }

}
