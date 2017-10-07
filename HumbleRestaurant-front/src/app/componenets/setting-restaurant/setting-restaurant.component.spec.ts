import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingRestaurantComponent } from './setting-restaurant.component';

describe('SettingRestaurantComponent', () => {
  let component: SettingRestaurantComponent;
  let fixture: ComponentFixture<SettingRestaurantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingRestaurantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
