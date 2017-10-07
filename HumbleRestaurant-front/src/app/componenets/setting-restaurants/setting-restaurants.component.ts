import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from '../../models/User.model';
import {Search} from '../../models/Search.model';
import {Restaurant} from '../../models/Restaurant.model';
import {Subscription} from 'rxjs/Subscription';
import {RestaurantService} from '../../services/restaurant/restaurant.service';

@Component({
  selector: 'app-setting-restaurants',
  templateUrl: './setting-restaurants.component.html',
  styleUrls: ['./setting-restaurants.component.css']
})
export class SettingRestaurantsComponent implements OnInit, OnDestroy {
  @Input()
  user: User;

  subscription: Subscription;
  search: Search = {
    ownerId: null, page: 1, keyword: null, geohash: null, sortBy: null,
    userId: null, paymentId: null, restaurantId: null, ratingId: null
  };

  restaurants: Restaurant[];
  selected: User;

  constructor(private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.searchRestaurants();
  }

  searchRestaurants() {
    this.subscription =
      this.restaurantService.searchRestaurant(this.search)
        .subscribe(res => this.restaurants = res);
  }

  jumpPage(num: number) {
    this.search.page += num;
    if (this.search.page <= 0) {
      this.search.page = 1;
    }

    this.searchRestaurants();
  }

  setCurRestaurant(restaurant: Restaurant) {
    this.selected = new User();
    this.selected.userId = restaurant.ownerId;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
