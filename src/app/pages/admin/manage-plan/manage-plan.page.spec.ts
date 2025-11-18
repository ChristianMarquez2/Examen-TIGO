import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagePlanPage } from './manage-plan.page';

describe('ManagePlanPage', () => {
  let component: ManagePlanPage;
  let fixture: ComponentFixture<ManagePlanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
