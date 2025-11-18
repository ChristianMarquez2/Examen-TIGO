import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatAdminPage } from './chat-admin.page';

describe('ChatAdminPage', () => {
  let component: ChatAdminPage;
  let fixture: ComponentFixture<ChatAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
