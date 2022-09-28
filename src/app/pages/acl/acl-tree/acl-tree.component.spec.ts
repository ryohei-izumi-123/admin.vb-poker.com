import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AclTreeComponent } from './acl-tree.component';

describe('AclTreeComponent', () => {
  let component: AclTreeComponent;
  let fixture: ComponentFixture<AclTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AclTreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AclTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
