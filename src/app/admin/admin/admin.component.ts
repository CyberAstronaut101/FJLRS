import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {

    // Need to add an auth check here? TODO
    console.log("AdminComponent OnInit running....");
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        console.log("AdminComponent successfully authenticated");
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {

  }

}
