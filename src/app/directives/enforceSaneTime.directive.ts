import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[enforceSaneTime]'
})
export class EnforceSaneTimeDirective implements OnInit {
  constructor(private startTime: ElementRef) {}


  ngOnInit(){
    console.log(this.startTime);
  }
}
