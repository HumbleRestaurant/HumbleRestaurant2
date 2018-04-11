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
      swal(
        'Welcome to HEFSEN',
        `"HEFSEN is "Healthcare by Exchange for Someone Else's Needs".
          Our website is currently in its testing phase and we are currently in the application process for nonprofit organizational status.
          The mission of HEFSEN is to help subsidize healthcare costs for those in need. Specifically,
          we will be funding for patients who have any kind of cancer, heart disease, or genetic disorder.
          We plan on raising funds for our mission through other businesses in exchange for advertisement.
          In order to attract users to our site, and by extension affiliated businesses of HEFSEN,
          users of hefsen.com will be able to accrue points whenever they purchase and send us receipts from businesses
          advertised by HEFSEN.
          These points users accrue will be able to be exchanged for items such as TVs, clothes,
          concert tickets, computers, or other things that HEFSEN's user base is most interested in.
          If you have any additional questions, please email us at hefsen@hefsen.com."`,
        'success'
      );
      localStorage.setItem('first-alert', '1');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

