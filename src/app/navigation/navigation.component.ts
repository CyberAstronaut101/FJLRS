import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';


import { faBars,
        faSignInAlt,
        faSignOutAlt,
        faHome,
        faBug,
        faUserPlus,
        faUserCircle,
        faArchway,
        faToriiGate,
        faDungeon,
        faCube,
        faLayerGroup,
        faServer


       } from '@fortawesome/free-solid-svg-icons';
import { MatSidenavModule } from '@angular/material';
import { _ } from 'ag-grid-community';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy{

  @ViewChild('sidenav', {static: false}) sidenavRef: MatSidenavModule;

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  userLevel = 'default';

  userName = 'default';

  // Icon Variables
  faBars = faBars;
  faSignIn = faSignInAlt;
  faSignOut = faSignOutAlt;
  faHome = faHome;
  contact = faBug;
  addUser = faUserPlus;
  // adminGate = faDungeon;
  adminGate = faServer;
  employeeGate = faToriiGate;
  userAccount = faUserCircle;
  studentGate = faArchway;
  cube = faCube;
  layerGroup = faLayerGroup;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router) {}


  ngOnInit() {
    // to get initial auth value
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userLevel = this.authService.getUserLevel();
    this.userName = this.authService.getUserFullName();
    // setup subscription to userAuth status
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userLevel = this.authService.getUserLevel();
        this.userName = this.authService.getUserFullName();

      });


    // TODO need to add a socket.io connection to the AuthService
    // to allow for push messages to be sent to people at a higher frame level.
  }

  onLogout() {
    console.log('onLogout() --> authService.logout()');
    // clear token
    // inform all parts about auth change
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    // this.route.
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
    // have a listener to listen for the token

    // use auth service to get token


}
