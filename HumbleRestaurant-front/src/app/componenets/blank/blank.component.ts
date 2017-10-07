import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.css']
})
export class BlankComponent implements OnInit {
  @Input()
  type: string;

  content: string;

  types = [
    {
      type: 'rating',
      content: 'This area shows user\'s reviews and ratings to restaurants, ' +
      'you will see me because user didn\'t make any review or made it private to others'
    }, {
      type: 'payment',
      content: 'This area shows user\'s payment and donation history, ' +
      'you will see me because user didn\'t make any donation or made it private to others'
    },
    {
      type: 'image',
      content: 'click to upload'
    }
  ];

  constructor() { }

  ngOnInit() {
    this.content = this.types.find(obj => obj.type === this.type).content;
  }

}
