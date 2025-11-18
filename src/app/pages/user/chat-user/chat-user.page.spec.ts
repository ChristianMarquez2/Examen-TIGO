import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatUserPage } from './chat-user.page';

describe('ChatUserPage', () => {
  let component: ChatUserPage;
  let fixture: ComponentFixture<ChatUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
