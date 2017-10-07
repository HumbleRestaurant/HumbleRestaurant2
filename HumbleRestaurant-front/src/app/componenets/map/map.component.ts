import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../models/User.model';
import {Restaurant} from '../../models/Restaurant.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input()
  restaurants: Restaurant[];

  constructor() { }

  ngOnInit() {
  }

}
