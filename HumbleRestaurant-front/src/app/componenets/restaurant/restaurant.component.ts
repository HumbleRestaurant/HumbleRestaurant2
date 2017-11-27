import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {User} from '../../models/User.model';
import {ActivatedRoute, Params} from '@angular/router';
import {RestaurantService} from '../../services/restaurant/restaurant.service';
import { ICarouselConfig, AnimationConfig } from 'angular4-carousel';
import {Restaurant} from '../../models/Restaurant.model';
import { CarouselService } from 'angular4-carousel';
import {FavService} from '../../services/fav/fav.service';
import {AuthService} from '../../services/auth/auth.service';
import {Search} from '../../models/Search.model';
import swal from 'sweetalert2';
import { LoadingAnimateService } from 'ng2-loading-animate';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit, AfterViewChecked {
  role: string;
  userId: string;
  isFav: boolean;

  restaurant: Restaurant;
  slides: string[];

  config: ICarouselConfig = {
    verifyBeforeLoad: false,
    log: false,
    animation: true,
    animationType: AnimationConfig.SLIDE_OVERLAP,
    autoplay: false,
    autoplayDelay: 6000,
    stopAutoplayMinWidth: 768
  };

  constructor(
    private _loadingSvc: LoadingAnimateService,
    private favService: FavService,
    private authService: AuthService,
    private carouselService: CarouselService,
    private router: ActivatedRoute,
    private restaurantService: RestaurantService
  ) { }

  ngOnInit() {
    this._loadingSvc.setValue(true);
    setTimeout(() => { this._loadingSvc.setValue(false); }, 1500);

    this.router.params.subscribe((params: Params) => {
      this.restaurantService.getRestaurant(params['id'])
        .then(restaurant => this.setRestaurant(restaurant));
    });
  }

  ngAfterViewChecked() {
    setTimeout(() => { this._loadingSvc.setValue(false); }, 1500);
  }

  setRestaurant(restaurant) {
    this.restaurant = restaurant;

    if (this.authService.isAuthenticated()) {
      this.setUserContent();
    }

    this.slides = [];
    if (this.restaurant.url1 && this.restaurant.url1 !== '') {
      this.slides.push(this.restaurant.url1);
      if (this.restaurant.url2 && this.restaurant.url2 !== '') {
        this.slides.push(this.restaurant.url2);
      }
      if (this.restaurant.url3 && this.restaurant.url3 !== '') {
        this.slides.push(this.restaurant.url3);
      }
      if (this.restaurant.url4 && this.restaurant.url4 !== '') {
        this.slides.push(this.restaurant.url4);
      }
    } else {
      this.slides.push('../../../assets/restaurant_default.jpg');
    }
  }

  setUserContent() {
    this.role = localStorage.getItem('role');
    this.userId = localStorage.getItem('user_id');

    const ownerId = this.restaurant.ownerId;

    const search: Search = {
      ownerId: ownerId, page: 1, keyword: null, geohash: null, sortBy: 'rating',
      userId: this.userId, paymentId: null, restaurantId: null, ratingId: null
    };

    this.favService.searchFavs(search)
      .subscribe(res => {
        this.isFav = res.length > 0;
      });
  }

  setFavorite(flag: boolean) {
    if (flag) {
      this.favService.addFavs({userId: this.userId,
        ownerId: this.restaurant.ownerId, restaurantName: this.restaurant.name})
        .then((res) => {
          this.isFav = true;
        })
        .catch((error) => {
          swal('Error occurred', error, 'error');
        });
    } else {
      this.favService.deleteFavs({userId: this.userId,
        ownerId: this.restaurant.ownerId, restaurantName: this.restaurant.name})
        .then((res) => {
          this.isFav = false;
        })
        .catch((error) => {
          swal('Error occurred', error, 'error');
        });
    }
  }
}
