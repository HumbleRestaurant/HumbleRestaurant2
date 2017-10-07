import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import {UserService} from '../user/user.service';
import {CONFIG} from '../../app.config';

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: 'm4p1eiZXw15KU58nFhz2BwGavAM1KKMZ',
    domain: 'humblerestaurants.auth0.com',
    responseType: 'token id_token',
    audience: 'https://humblerestaurants.auth0.com/userinfo',
    redirectUri: CONFIG.callback_url,
    scope: 'openid email'
  });

  userProfile: any;
  constructor(
    private userService: UserService,
    public router: Router) { }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.verifyUser(authResult);
      } else if (err) {
        console.log(err);
        this.router.navigate(['/home']);
      }
    });
  }

  private verifyUser(authResult) {
    this.userService.getUser(authResult.idTokenPayload.sub).then((user) => {
          if (!user) {
            this.userService.addUser(authResult.idTokenPayload.sub, authResult.idTokenPayload.email);
            localStorage.setItem('avatar', '');
            localStorage.setItem('name', authResult.idTokenPayload.email);
            localStorage.setItem('role', 'user');
          }else {
            localStorage.setItem('role', user.role);
            localStorage.setItem('name', user.name);
            localStorage.setItem('avatar', user.avatar);
          }

          window.location.hash = '';
          this.setSession(authResult);
          this.router.navigate(['/home']).then();
      });
  }

  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        console.log(JSON.stringify(profile));
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('user_id', authResult.idTokenPayload.sub);
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('avatar');
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']).then();
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
