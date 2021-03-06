import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate, CanLoad {
  check$ = this.authService.user$.pipe(
    map((user) => !user),
    tap((isLoggedIn) => {
      if (!isLoggedIn) {
        this.router.navigateByUrl('/');
        return true;
      }
    })
  );

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.check$;
  }
  canLoad(): Observable<boolean> {
    return this.check$.pipe(take(1));
  }
}
