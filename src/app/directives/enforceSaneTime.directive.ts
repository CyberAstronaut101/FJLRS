import { Directive, ElementRef, OnInit } from '@angular/core';

// Used to try input check to make sure schedule open time comes before the schedule close time,, etc other checks 

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