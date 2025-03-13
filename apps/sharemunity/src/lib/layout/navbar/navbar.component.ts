import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sharemunity-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isNavbarCollapsed = true;

}
