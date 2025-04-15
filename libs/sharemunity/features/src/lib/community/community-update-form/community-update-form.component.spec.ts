import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityUpdateFormComponent } from './community-update-form.component';

describe('CommunityUpdateFormComponent', () => {
  let component: CommunityUpdateFormComponent;
  let fixture: ComponentFixture<CommunityUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityUpdateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
