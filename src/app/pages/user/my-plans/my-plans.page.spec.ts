import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPlansPage } from './my-plans.page';

describe('MyPlansPage', () => {
  let component: MyPlansPage;
  let fixture: ComponentFixture<MyPlansPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPlansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
