import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../lesInjectables';
import { TranslationStorageService } from '../lesInjectables';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userId: string | null = null;
  translationsAllowedToday: boolean = true;
  remainingTranslations: number = 5;
  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private translationStorageService: TranslationStorageService
  ) {}

  ngOnInit(): void {
    this.userService.getUserId().subscribe((userId) => {
      this.userId = userId;
      this.subscriptions.push(
        this.translationStorageService.translationAdded$.subscribe(() => {
          this.checkDailyLimit();
        })
      );
      this.checkDailyLimit();
    });
  }
  

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  checkDailyLimit(): void {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe((user) => {
        const today = new Date();
        const lastTranslationDate = new Date(user.lastTranslationDate);
        if (
          today.getDate() !== lastTranslationDate.getDate() ||
          today.getMonth() !== lastTranslationDate.getMonth() ||
          today.getFullYear() !== lastTranslationDate.getFullYear()
        ) {
          user.translationCount = 0;
        }
        this.remainingTranslations = user.translationCount;
      });
    }
  }
}
