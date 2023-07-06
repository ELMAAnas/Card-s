import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../lesInjectables';
import { AuthService } from '../lesInjectables';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  translationCount: number = 0;  
  private translationCountSub!: Subscription;  
  userId: string = '';  

  constructor(
    private userService: UserService,
    private authService: AuthService
    ) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = this.authService.getUserIdFromToken(token);
      if (userId) {
        this.userId = userId;
        this.fetchTranslationCount();
      } else {
        console.error('Invalid token or user ID not found in token');
      }
    } else {
      console.error('Token not found in local storage');
    }
  }
  
  fetchTranslationCount(): void {
    this.userService.getUser(this.userId).subscribe((user) => {
      this.translationCount = user.translationCount;
    });
  }

  ngOnDestroy() {
    this.translationCountSub.unsubscribe();
  }
}
