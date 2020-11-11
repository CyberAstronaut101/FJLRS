import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fayjones-lab-app';

  constructor(private authService: AuthService) {
    console.log("app.component constructor running...");
  }

  ngOnInit(){
    /* 
      Check to see if the client has a jsonwebtoken that is still valid
      
    */
    this.authService.autoAuthUser();
  }
}
