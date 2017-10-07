import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Rating} from '../../models/Rating.model';
import {RatingService} from '../../services/rating/rating.service';
import {Subscription} from 'rxjs/Subscription';
import {Search} from '../../models/Search.model';
import {AuthService} from '../../services/auth/auth.service';
import swal from 'sweetalert';
import {Restaurant} from '../../models/Restaurant.model';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  @Input()
  restaurant: Restaurant;

  ratingSubscription: Subscription;
  ratingSearch: Search = {
    ownerId: null, page: 1, keyword: null, geohash: null, sortBy: 'date',
    userId: null, paymentId: null, restaurantId: null, ratingId: null
  };
  ratings: Rating[];


  default_rating = {
    userId: '',
    restaurantId: '',
    restaurantName: '',
    userName: '',
    avatar: '',
    score: 0,
    summary: ''
  };

  newRating = {
    userId: '',
    restaurantId: '',
    restaurantName: '',
    userName: '',
    avatar: '',
    score: 0,
    summary: ''
  };

  constructor(private authService: AuthService,
              private userService: UserService,
              private ratingService: RatingService) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.default_rating.restaurantId = this.restaurant.ownerId;
      this.default_rating.restaurantName = this.restaurant.name;
      this.default_rating.userId = localStorage.getItem('user_id');
      this.default_rating.avatar = localStorage.getItem('avatar');

      this.userService.getUser(this.default_rating.userId)
        .then( (res) => {
          this.default_rating.userName = res.name;
          this.newRating = this.default_rating;
        })
        .catch();
    }

    this.ratingSearch.restaurantId = this.restaurant.ownerId;
    this.getRatings();
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
          this.newRating = this.default_rating;
        });
    }
  }

  likeRating(rating: Rating) {
    rating.likes += 1;
    this.ratingService.updateRating(rating)
      .then( (res) => {
        swal('Your request has been sent', '', 'success');
      });
  }

  sortBy(keyword: string) {
    this.ratingSearch.sortBy = keyword;
    this.getRatings();
  }

  jumpPage(num: number) {
    this.ratingSearch.page += num;
    this.getRatings();
  }

  onRatingChange(event) {
    this.newRating.score = event.rating;
  }
}
