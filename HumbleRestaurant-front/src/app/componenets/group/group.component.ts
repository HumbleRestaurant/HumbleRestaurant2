import {Component, OnDestroy, OnInit} from '@angular/core';
import { LoadingAnimateService } from 'ng2-loading-animate';
import {ActivatedRoute, Params} from '@angular/router';
import {Group} from '../../models/Group';
import {GroupService} from '../../services/group/group.service';
import {AuthService} from '../../services/auth/auth.service';
import {Payment} from '../../models/Payment.model';
import {Favorite} from '../../models/Favorite.model';
import {PaymentService} from '../../services/payment/payment.service';
import {FavService} from '../../services/fav/fav.service';
import {Rating} from '../../models/Rating.model';
import {Search} from '../../models/Search.model';
import {Subscription} from 'rxjs/Subscription';
import swal from 'sweetalert';
import {RatingService} from '../../services/rating/rating.service';

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

        console.log(JSON.stringify(res));

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

        console.log(JSON.stringify(favs));

        this.favorites = favs;
      });
  }

  joinGroup() {
    this.isMember = true;
    const user = {ownerId: this.group.ownerId, userId: this.userId, userName: this.userName};
    this.gropService.addGroupUser(user)
      .then(res => {this.groupUsers.push(user); });
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
