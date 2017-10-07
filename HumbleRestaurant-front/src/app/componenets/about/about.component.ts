import { Component, OnInit } from '@angular/core';
import { LoadingAnimateService } from 'ng2-loading-animate';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private _loadingSvc: LoadingAnimateService) { }

  ngOnInit() {
    this._loadingSvc.setValue(true);
    setTimeout(() => { this._loadingSvc.setValue(false); }, 1500);
  }

}
