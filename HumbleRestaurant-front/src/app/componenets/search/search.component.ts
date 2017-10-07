import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../models/User.model';
import {RestaurantService} from '../../services/restaurant/restaurant.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Restaurant} from '../../models/Restaurant.model';
import {Search} from '../../models/Search.model';
import {Subscription} from 'rxjs/Subscription';
import {GeohashService} from '../../services/geohash/geohash.service';
import swal from 'sweetalert';
import { LoadingAnimateService } from 'ng2-loading-animate';

const default_search: Search = Object.freeze({
  ownerId: null, page: 1, keyword: null, geohash: null, sortBy: 'rating',
  userId: null, paymentId: null, restaurantId: null, ratingId: null
});

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  search: Search = Object.assign({}, default_search);
  location: string;
  subscription: Subscription;
  restaurants: Restaurant[];
  center = {lat: 0, lng: 0};

  constructor(
    private router: ActivatedRoute,
    private _loadingSvc: LoadingAnimateService,
    private geohashService: GeohashService,
    private restaurantService: RestaurantService) { }

  ngOnInit() {
    this._loadingSvc.setValue(true);
    setTimeout(() => { this._loadingSvc.setValue(false); }, 1500);

    this.restaurants = [];
    this.router.params.subscribe((params: Params) => {
      this.location = (params['location']);
      this.search.sortBy = 'rating';
      this.search.page = 1;
      this.search.keyword = (params['keyword']);

      this.searchRestaurants();
    });
  }

  searchRestaurants() {
    this.geohashService.getCoordinate(this.location)
      .then((res) => {
        this.center = res;
        this.search.geohash = this.geohashService
          .getGeoHash(res.lat, res.lng)
          .substr(0, 4);
      })
      .then(() => {
        this.subscription =
           this.restaurantService.searchRestaurant(this.search)
             .subscribe((restaurants) => (this.restaurants = restaurants));
      });
  }

  changeSortBy(sortBy: string) {
    this.search.sortBy = sortBy;
    this.searchRestaurants();
  }

  jumpPage(num: number) {
    this.search.page += num;
    if (this.search.page <= 0) {
      this.search.page = 1;
    }

    this.searchRestaurants();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
