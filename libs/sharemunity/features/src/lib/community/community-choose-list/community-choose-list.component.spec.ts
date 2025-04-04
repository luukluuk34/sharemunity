import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityChooseListComponent } from './community-choose-list.component';

describe('CommunityChooseListComponent', () => {
  let component: CommunityChooseListComponent;
  let fixture: ComponentFixture<CommunityChooseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityChooseListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityChooseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
