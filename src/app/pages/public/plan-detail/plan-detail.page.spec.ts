import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanDetailPage } from './plan-detail.page';

describe('PlanDetailPage', () => {
  let component: PlanDetailPage;
  let fixture: ComponentFixture<PlanDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
