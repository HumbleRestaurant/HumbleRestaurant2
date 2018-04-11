import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {RestaurantService} from '../../services/restaurant/restaurant.service';
import {Restaurant} from '../../models/Restaurant.model';
import {Subscription} from 'rxjs/Subscription';
import {Search} from '../../models/Search.model';
import { LoadingAnimateService } from 'ng2-loading-animate';
import swal from 'sweetalert2';

const default_search: Search = Object.freeze({
  ownerId: null, page: 1, keyword: null, geohash: null, sortBy: 'rating',
  userId: null, paymentId: null, restaurantId: null, ratingId: null
});

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {
  search: Search = Object.assign({}, default_search );

  subscription: Subscription;
  restaurants: Restaurant[];

  keyword = '';
  location = '';

  constructor(
    private _loadingSvc: LoadingAnimateService,
    private restaurantService: RestaurantService) { }

  ngOnInit() {
    this._loadingSvc.setValue(true);
    setTimeout(() => { this._loadingSvc.setValue(false); }, 1500);

    this.subscription =
      this.restaurantService.searchRestaurant(default_search)
        .subscribe(restaurants => this.restaurants = restaurants);

    if ( !localStorage.getItem('first-alert') ) {
      swal({
        title: 'Welcome to HEFSEN',
        html:
        `
        <p>
          Healthcare by Exchange for Someone Else's Needs.
          <a href="/about">More about us</a>
        </p>
        `
      });
      localStorage.setItem('first-alert', '1');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

