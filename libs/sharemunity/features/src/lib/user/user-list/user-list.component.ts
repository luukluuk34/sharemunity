import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { IUser } from '@sharemunity-workspace/shared/api';

@Component({
  selector: 'sharemunity-workspace-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  @Input({ required: false }) communityId!: string;

  users: IUser[] | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.communityId) {
      this.userService.list(this.communityId).subscribe((userList) => {
        this.users = userList;
      });

    } else {
      this.userService.list().subscribe((userList) => {
        this.users = userList;
      });
    }
  }
}
