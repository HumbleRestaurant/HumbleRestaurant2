import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {User} from '../../models/User.model';
import {RestaurantService} from '../../services/restaurant/restaurant.service';
import {Restaurant} from '../../models/Restaurant.model';
import {FileService} from '../../services/file/file.service';
import swal from 'sweetalert';
import {GeohashService} from '../../services/geohash/geohash.service';

@Component({
  selector: 'app-setting-restaurant',
  templateUrl: './setting-restaurant.component.html',
  styleUrls: ['./setting-restaurant.component.css']
})
export class SettingRestaurantComponent implements OnInit, OnChanges {

  @Input()
  user: User;

  role: string;
  loading = false;

  restaurant: Restaurant;
  constructor(
    private geohashService: GeohashService,
    private fileService: FileService,
    private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.role = localStorage.getItem('role');

    this.restaurantService.getRestaurant(this.user.userId)
      .then( res => this.restaurant = res);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.role = localStorage.getItem('role');
    this.restaurantService.getRestaurant(this.user.userId)
      .then( res => {
        this.restaurant = res;
      });
  }

  onAddressChange() {
    this.loading = true;
    this.geohashService.getCoordinate(this.restaurant.address)
      .then((res) => {
        this.restaurant.lat = res.lat;
        this.restaurant.lng = res.lng;
        this.restaurant.geohash =  this.geohashService.getGeoHash(res.lat, res.lng);
        this.loading = false;
      });
  }

  uploadFile(num: number, files: File[]) {
    const file = files[0];
    const formData = new FormData();

    const arr = file.name.split('.');
    if (arr.length < 2) {
      swal('File type doesn\'t support', file.name, 'error');
      return;
    }
    if ( arr[arr.length - 1] !== 'png' && arr[arr.length - 1] !== 'jpg' &&
      arr[arr.length - 1] !== 'svg' && arr[arr.length - 1] !== 'gif') {
      swal('File type doesn\'t support', file.name , 'error');
      return;
    }

    formData.append('name', 'restaurant-' + num + '-' +
      this.restaurant.ownerId + '.' + arr[arr.length - 1]);
    formData.append('file', file);

    this.fileService.uploadFile(formData)
      .then(res => {
        swal('Image uploaded, click to save your change.',
          'It needs some time to apply your changes.', 'success');
        switch (num) {
          case 0:
            this.restaurant.url1 = res.path;
            break;
          case 1:
            this.restaurant.url2 = res.path;
            break;
          case 2:
            this.restaurant.url3 = res.path;
            break;
          case 3:
            this.restaurant.url4 = res.path;
            break;
        }
      })
      .catch(error => {
        swal('Upload fail', error, 'error');
      });
  }

  updateResturant() {
    this.restaurantService.updateRestaurant(this.restaurant)
      .then(res => {
        swal('Restaurant updated', '', 'success');
      });
  }

  newRestaurant() {
    this.restaurantService.addRestaurant(this.user.userId)
      .then((res) => {
        this.ngOnChanges(null);
      })
      .catch();
  }
}
