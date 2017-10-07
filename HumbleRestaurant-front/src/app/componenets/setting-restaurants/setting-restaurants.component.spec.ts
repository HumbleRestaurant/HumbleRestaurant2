import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingRestaurantsComponent } from './setting-restaurants.component';

describe('SettingRestaurantsComponent', () => {
  let component: SettingRestaurantsComponent;
  let fixture: ComponentFixture<SettingRestaurantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingRestaurantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
