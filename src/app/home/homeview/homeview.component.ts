import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User, News } from '../../../assets/interfaces';
import { AuthService } from 'src/app/auth/auth.service';
import { NewsService } from 'src/app/admin/manage-news/news.service';


@Component({
  selector: 'app-homeview',
  templateUrl: './homeview.component.html',
  styleUrls: ['./homeview.component.css']
})
export class HomeviewComponent implements OnInit, OnDestroy {

  /* ========================================================================
      * HOME VIEW COMPONENT
      *---------------------------------------------
      ? Check if the user is authenticated
      ? Get the user level to display the correct titles
      
      | NewsView Component -- Shows the lab news
      | UserView Component -- Shows user info && and upcoming or important alerts

      

  ======================================================================== */

  public userLevel = 'default';
  public userIsAuthenticated = false;
  public user: User;
  public authStatusSub: Subscription;

  // Loading the news Articles
  // *Might try to use lazy loading here?
  public newsList: News[];
  public newsArticleSub: Subscription;

  constructor(private authService: AuthService,
              private newsService: NewsService) {
    console.log('Homeview constructor running');
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userLevel = this.authService.getUserLevel();
    this.user = this.authService.getLocalUserVar();

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuth => {
          console.log('isAuth: ' + isAuth);
          this.userIsAuthenticated = isAuth;
          this.userLevel = this.authService.getUserLevel();
    });

}

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
