import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { User } from '../models/User';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountServer: AccountService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User | null = null;
    this.accountServer.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);
    if (currentUser) {
      const user: User = currentUser;
      request = request.clone({
        setHeaders: {
          Authorization: "Bearer " + user.token
        }
      });
    }
    return next.handle(request);
  }
}
