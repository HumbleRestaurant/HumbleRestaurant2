import {Component, OnDestroy, OnInit} from '@angular/core';
import { LoadingAnimateService } from 'ng2-loading-animate';
import {ActivatedRoute, Params} from '@angular/router';
import {Group} from '../../models/Group';
import {GroupService} from '../../services/group/group.service';
import {AuthService} from '../../services/auth/auth.service';
import {Payment} from '../../models/Payment.model';
import {PaymentService} from '../../services/payment/payment.service';
import {FavService} from '../../services/fav/fav.service';
import {Rating} from '../../models/Rating.model';
import {Search} from '../../models/Search.model';
import {Subscription} from 'rxjs/Subscription';
import swal from 'sweetalert2';
import {RatingService} from '../../services/rating/rating.service';
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, OnDestroy {

  group: Group;
  groupUsers;

  userId: string;
  userName: string;

  isMember = true;
  canJoin = true;
  memberNumMax = 10;

  payments: Payment[] = [];
  favorites = [];

  ratingSubscription: Subscription;
  ratingSearch: Search = {
    ownerId: null, page: 1, keyword: null, geohash: null, sortBy: 'date',
    userId: null, paymentId: null, restaurantId: null, ratingId: null
  };
  ratings: Rating[];

  newRating = {
    userId: '',
    restaurantId: '',
    restaurantName: '',
    userName: '',
    avatar: '',
    score: 0,
    summary: ''
  };

  constructor(
    private userService: UserService,
    private ratingService: RatingService,
    private favoriteService: FavService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private gropService: GroupService,
    private _loadingSvc: LoadingAnimateService,
    private router: ActivatedRoute) { }

  ngOnInit() {
    this._loadingSvc.setValue(true);
    setTimeout(() => { this._loadingSvc.setValue(false); }, 1500);


    if (this.authService.isAuthenticated()) {
      this.userId = localStorage.getItem('user_id');
      this.userName = localStorage.getItem('name');

      this.userService.getUserGroups(this.userId)
        .then((res) => {
            const groups = res;
            this.userService.getUser(this.userId)
              .then((res) => {
                 let user = res;
                 let limit = 5;

                 if(user.donation > 10) {
                   limit = 10;
                 }

                 if(groups.length >= limit) {
                   this.canJoin = false;
                 }
              });
        });

    } else {
      this.isMember = false;
      this.canJoin = false;
    }

    this.router.params.subscribe((params: Params) => {
      const ownerId = params['ownerId'];
      this.gropService.getGroup(ownerId)
        .then(res => {
          this.group = res;

          this.ratingSearch.restaurantId = this.group.ownerId;
          this.newRating.userId = this.userId;
          this.newRating.restaurantId = this.group.ownerId;
          this.newRating.restaurantName = this.group.name;
          this.newRating.userName = this.userName;

          this.getRatings();
        });

      this.gropService.getGroupUsers(ownerId)
        .then(res => {
          this.groupUsers = res;

          this.userService.getUser(this.group.ownerId)
            .then((res) => {
              if(res.donation > 10){
                this.memberNumMax = 20;
              }

              if(this.groupUsers.length >= this.memberNumMax) {
                this.canJoin = false;
              }
            });

          this.getMemberInfo();
        });
    });
  }

  getMemberInfo() {
    if (this.userId && !this.groupUsers.find(o => o.userId === this.userId)) {
      this.isMember = false;
    }

    let userId = `'',`;
    for (let i = 0; i < this.groupUsers.length; i++) {
      userId += `'` + this.groupUsers[i].userId + `',`;
    }
    userId = userId.substr(0, userId.length - 1);

    this.paymentService.searchPayments({paymentId: null, userId: userId, page: 1})
      .subscribe(res => {
        this.payments = res;
      });

    this.favoriteService.searchFavs({userId: userId, ownerId: null})
      .subscribe(res => {
        const favs = [];
        for (let i = 0; i < res.length; i++) {
          let temp = favs.find(o => o.ownerId === res[i].ownerId);
          if (!temp) {
            temp = res[i];
            temp.times = 1;
            favs.push(temp);
          } else {
            temp.times++;
          }
        }

        favs.sort((a, b) => {
          if (a.times < b.times) {
            return 1;
          }

          if (a.times > b.times) {
            return -1;
          }

          return 0;
        });

        this.favorites = favs;
      });
  }

  joinGroup() {

    if(this.group.password) {

      swal({
        title: 'Enter password',
        html: 'Password is need to join the group, contact the ' +
        '<a href="/profile/' + this.group.ownerId + '">owner</a> for more info.',
        input: "text"
      })
      .then((input) => {
        if (input.value != this.group.password){
          swal("Password doesn't match.");
        } else {
          this.isMember = true;
          const user = {ownerId: this.group.ownerId, userId: this.userId, userName: this.userName};
          this.gropService.addGroupUser(user)
            .then(res => {this.groupUsers.push(user); });
        }
      });

    } else {
      this.isMember = true;
      const user = {ownerId: this.group.ownerId, userId: this.userId, userName: this.userName};
      this.gropService.addGroupUser(user)
        .then(res => {this.groupUsers.push(user); });
    }
  }

  leaveGroup() {
    this.isMember = false;
    for (let i = 0, len = this.groupUsers.length; i < len; i++) {
      if(this.groupUsers[i].userId === this.userId) {
          this.groupUsers.splice(i, 1);
          break;
      }
    }
    this.gropService.deleteGroupUser(this.group.ownerId, this.userId)
      .then( res => {});
  }

  getRatings() {
    this.ratingSubscription = this.ratingService.searchRatings(this.ratingSearch)
      .subscribe(ratings => this.ratings = ratings);
  }

  addRating() {
    if (!this.newRating.userId) {
      swal('Login before make a comment', '', 'error');
    }else if (!this.newRating.summary) {
      swal('Comment cannot be null', '', 'error');
    }else {
      this.ratingService.addRating(this.newRating)
        .then((res) => {
          swal('Post successfully', '', 'success');
          this.getRatings();
          this.newRating.summary = '';
        });
    }
  }

  ngOnDestroy() {
    this.ratingSubscription.unsubscribe();
  }
}
