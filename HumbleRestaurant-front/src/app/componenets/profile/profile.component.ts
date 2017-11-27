import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {User} from '../../models/User.model';
import {ActivatedRoute, Params} from '@angular/router';
import {Rating} from '../../models/Rating.model';
import {Payment} from '../../models/Payment.model';
import {RatingService} from '../../services/rating/rating.service';
import {PaymentService} from '../../services/payment/payment.service';
import {Restaurant} from '../../models/Restaurant.model';
import {Search} from '../../models/Search.model';
import {Subscription} from 'rxjs/Subscription';
import {FavService} from '../../services/fav/fav.service';
import {Favorite} from '../../models/Favorite.model';
import { LoadingAnimateService } from 'ng2-loading-animate';
import {Group} from "../../models/Group";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;

  ratings: Rating[];
  ratingSubscription: Subscription;
  ratingSearch: Search = {
    ownerId: null, page: 1, keyword: null, geohash: null, sortBy: 'date',
    userId: null, paymentId: null, restaurantId: null, ratingId: null
  };

  favs: Favorite[];
  favSubscription: Subscription;
  favSearch: Search = {
    ownerId: null, page: 1, keyword: null, geohash: null, sortBy: 'donation',
    userId: null, paymentId: null, restaurantId: null, ratingId: null
  };

  groups: Group[];

  payments: Payment[];
  paymentSubscription: Subscription;
  paymentSearch: Search = {
    ownerId: null, page: 1, keyword: null, geohash: null, sortBy: 'date',
    userId: null, paymentId: null, restaurantId: null, ratingId: null
  };

  constructor(
    private _loadingSvc: LoadingAnimateService,
    private router: ActivatedRoute,
    private paymentService: PaymentService,
    private ratingService: RatingService,
    private favService: FavService,
    private userService: UserService) { }

  ngOnInit() {

    this._loadingSvc.setValue(true);
    setTimeout(() => { this._loadingSvc.setValue(false); }, 1500);

    this.router.params.subscribe((params: Params) => {
      this.userService.getUser(params['id'])
        .then((user) => {
          this.user = user;

          this.favSearch.userId = user.userId;
          this.paymentSearch.userId = user.userId;
          this.ratingSearch.userId = user.userId;

          this.getRatings();
          this.getFavs();
          this.getPayments();
          this.getGroups();
        });
    });
  }

  getRatings() {
    this.ratingSubscription = this.ratingService.searchRatings(this.ratingSearch)
      .subscribe(ratings => this.ratings = ratings);
  }

  getFavs() {
    this.favSubscription = this.favService.searchFavs(this.favSearch)
      .subscribe(favs => this.favs = favs);
  }

  getPayments() {
    this.paymentSubscription = this.paymentService.searchPayments(this.paymentSearch)
      .subscribe(payments => this.payments = payments);
  }

  getGroups() {
    this.userService.getUserGroups(this.user.userId).then(
      groups => this.groups = groups
    );
  }

  jumpPaymentsPage(num) {
    this.paymentSearch.page += num;
    if ( num < 0 && this.paymentSearch.page <= 0) {
      this.paymentSearch.page -= num;
    } else if (num > 0 && this.payments.length !== 10) {
      this.paymentSearch.page -= num;
    } else {
      this.getPayments();
    }
  }

  jumpRatingsPage(num) {
    this.ratingSearch.page += num;
    if ( num < 0 && this.ratingSearch.page <= 0) {
      this.ratingSearch.page -= num;
    } else if (num > 0 && this.ratings.length !== 10) {
      this.ratingSearch.page -= num;
    } else {
      this.getRatings();
    }
  }
}
