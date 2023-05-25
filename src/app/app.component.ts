import { Component } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  routes: Routes;

  constructor(private router: Router) {
    this.routes = this.router.config;
  }

  getActiveRoute() {
    const activeRoute = this.routes.find(route => route.path && this.router.isActive(route.path, true));
    return activeRoute ? activeRoute : undefined;
  }

  getRouteTitle(route: any) {
    return route.data ? route.data.title : route.path;
  }

  showNavbar = true;
}
