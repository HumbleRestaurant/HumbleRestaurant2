import {Component, Input, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {User} from '../../models/User.model';
import {UserService} from '../../services/user/user.service';
import {Search} from '../../models/Search.model';
import {Subscription} from 'rxjs/Subscription';
import swal from 'sweetalert';

@Component({
  selector: 'app-setting-role',
  templateUrl: './setting-role.component.html',
  styleUrls: ['./setting-role.component.css']
})
export class SettingRoleComponent implements OnInit, OnDestroy {
  @Input()
  user: User;

  subscription: Subscription;
  users: User[];


  search: Search = {
    ownerId: null, page: 1, keyword: null, geohash: null, sortBy: null,
    userId: null, paymentId: null, restaurantId: null, ratingId: null
  };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.searchUsers();
  }

  searchUsers() {
    this.subscription =
      this.userService.searchUsers(this.search)
        .subscribe(users => this.users = users);
  }

  updateUser(userId: string) {
    const user = this.users.find(item => item.userId === userId);
    this.userService.updateUser(user)
      .then((res) => {
        swal('Changes have been saved', '', 'success');
      })
      .catch();
  }

  jumpPage(num: number) {
    this.search.page += num;
    if (this.search.page <= 0){
      this.search.page = 1;
    }

    this.searchUsers();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
