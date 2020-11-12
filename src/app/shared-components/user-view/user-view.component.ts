import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  
  /* ========================================================================
      * USER VIEW COMPONENT
      *---------------------------------------------
      ? Check if the user is authenticated
      ? Get the user level to display the correct titles
      
      | NewsView Component -- Shows the lab news
      | UserView Component -- Shows user info && and upcoming or important alerts

      Potential New components or expanding on this one could include 
      listing the current open job tickets, listing upcoming appointments, 
      etc.
  ======================================================================== */

  public user: User;  // Typescript 'object' to make sure that the user data is uniform throughout the application

  constructor(private authService:AuthService) { }

  ngOnInit() {
    // Get the current logged in user info from the authService
    this.user = this.authService.getLocalUserVar();
  }

}
