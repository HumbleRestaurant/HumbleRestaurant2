import { Component, OnInit } from '@angular/core';
import { LoadingAnimateService } from 'ng2-loading-animate';
import {Group} from '../../models/Group';
import {GroupService} from '../../services/group/group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  keyword: string;
  status: string;
  page: number;
  groups: Group[] = [];

  constructor(
    private groupService: GroupService,
    private _loadingSvc: LoadingAnimateService) { }

  ngOnInit() {
    this._loadingSvc.setValue(true);
    setTimeout(() => { this._loadingSvc.setValue(false); }, 1500);

    this.keyword = null;
    this.status = null;
    this.page = 1;
    this.searchGroup();
  }

  changeStatus(status) {
    this.status = status;
    this.searchGroup();
  }

  searchGroup() {
    this.groupService.searchGroups(
      {keyword: this.keyword, status: this.status, page: this.page, sortBy: 'donation'})
      .then(res => this.groups = res);
  }

  jumpPage(num: number) {
    this.page += num;
    if (this.page <= 0) {
      this.page = 1;
    }

    this.searchGroup();
  }
}
