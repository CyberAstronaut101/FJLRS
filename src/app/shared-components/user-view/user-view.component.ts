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

      
  ======================================================================== */

  


  public user: User;

  constructor(private authService:AuthService) { }

  ngOnInit() {
    
    // Get the current logged in user info
    this.user = this.authService.getLocalUserVar();

    // TODO GET THE FUTURE APPTS THAT THE USER MIGHT HAVE

  }

}
