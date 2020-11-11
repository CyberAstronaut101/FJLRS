import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/admin/manage-users/user.service';
import { User } from 'src/assets/interfaces';

@Component({
  selector: 'app-wood-kiosk',
  templateUrl: './wood-kiosk.component.html',
  styleUrls: ['./wood-kiosk.component.css']
})
export class WoodKioskComponent implements OnInit {

  constructor(private userService: UserService,
              private authService: AuthService) { }

  loggedInUser: User;
  
  totalPeopleInLab: Number = 0;



  ngOnInit() {
    this.loggedInUser = this.authService.getLocalUserVar();

    console.log("Woodshop Kiosk Login with User: ");
    console.log(this.loggedInUser);


    

    // FIRST check to see if there is room for the user in the woodshop
    // TODO maybe hard code the departments for now

    // THEN check to make sure they have AT LEAST training level 1

    // DISPLAY this information in a popup box, 

    // THEN the kiosk view will just show the current # people? maybe a slideshow 
    // of some projects
  }

}
