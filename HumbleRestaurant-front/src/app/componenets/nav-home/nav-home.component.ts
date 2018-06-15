import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-nav-home',
  templateUrl: './nav-home.component.html',
  styleUrls: ['./nav-home.component.css']
})
export class NavHomeComponent implements OnInit {
  title = 'MunchCare';
  userId: string;
  profile: any;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.getProfile();
    }
  }

  getProfile() {
    this.userId = localStorage.getItem('user_id');
    if (this.authService.userProfile) {
      this.profile = this.authService.userProfile;
    } else {
      this.authService.getProfile((err, profile) => {
        this.profile = profile;
      });
    }
  }
}
