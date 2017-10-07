import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {User} from '../../models/User.model';
import { LoadingAnimateService } from 'ng2-loading-animate';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  user: User;
  constructor(
    private _loadingSvc: LoadingAnimateService,
    private userService: UserService) { }

  ngOnInit() {
    this._loadingSvc.setValue(true);
    setTimeout(() => { this._loadingSvc.setValue(false); }, 1500);

    this.userService.getUser(localStorage.getItem('user_id'))
      .then((user) => {
        this.user = user;
      });
  }

}
