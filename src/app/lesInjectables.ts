import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, Translation } from './modelUser';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

interface DecodedToken {
    id: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private serverUrl = 'https://localhost:4443/api/users';
  private translationCountUpdated = new Subject<number>();

  constructor(private http: HttpClient) {}

  // Ajout d'un utilisateur
  addUser(user: User): Observable<any> {
    user.translationCount = 0;
    user.lastTranslationDate = new Date();
    return this.http.post(`${this.serverUrl}/register`, user).pipe(
      catchError(err => {
        console.error(err);
        return throwError('Erreur lors de l\'ajout de l\'utilisateur');
      })
    );
  }

  // Récupération de l'userId pour l'utilisateur actuel
  getUserId(): Observable<string> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<{ userId: string }>(`${this.serverUrl}/me`, { headers: headers }).pipe(
      map(res => res.userId)
    );
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.serverUrl}/${userId}`);
  }

  getTranslationCountUpdateListener() {
    return this.translationCountUpdated.asObservable();
  }

  updateTranslationCount(userId: string) {
    this.getUser(userId).subscribe((user) => {
      this.translationCountUpdated.next(user.translationCount);
    });
  }
}

// AuthService
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private serverUrl = 'https://localhost:4443/api/users';

    constructor(private http: HttpClient) {}

    // Connexion de l'utilisateur
    connexion(credentials: { pseudo: string; mot_de_passe: string }): Observable<any> {
        console.log('Credentials: ', credentials);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`${this.serverUrl}/authentificate`, credentials, { headers }).pipe(
            tap((response: any) => {
                if (response && response.token) {
                    localStorage.setItem('token', response.token);
                }
            })
        );
    }

    public getUserIdFromToken(token: string): string | null {
        try {
            const decoded: DecodedToken = jwt_decode(token) as DecodedToken;
            return decoded.id;
        } catch (error) {
            return null;
        }
    }
}


// TranslateService
@Injectable({
    providedIn: 'root'
})
export class TranslateService {
  private apiUrl = 'https://rapid-translate-multi-traduction.p.rapidapi.com/t';
  private apiKey = '4a961ef64cmsh95e9ffe136f273cp1ffbddjsn5317accd3e62';
  private apiHost = 'rapid-translate-multi-traduction.p.rapidapi.com';

  constructor(private http: HttpClient) {}

  // Traduction du texte
  public translate(from: string, to: string, text: string): Observable<any> {
      const headers = new HttpHeaders({
          'content-type': 'application/json',
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.apiHost
      });

      const body = {
          from: from,
          to: to,
          q: text
      };

      return this.http.post(this.apiUrl, body, { headers });
  }
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// TranslationStorageService
@Injectable({
  providedIn: 'root',
})
export class TranslationStorageService {
  private apiUrl = 'https://localhost:4443/api/users';
  public translationAdded$ = new Subject<void>();
  public translationDeleted$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  checkDailyLimit(userId: string): Observable<number> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() }).pipe(
      tap((user) => console.log('checkDailyLimit user:', user)),
      map((user) => user.translationCount)
    );
  }

  saveTranslation(
    userId: string,
    sourceText: string,
    translatedText: string
  ): Observable<any> {
    const translation: Translation = {
      sourceText,
      translatedText,
      userId,
      createdAt: new Date(),
    };

    return this.http.post(`${this.apiUrl}/${userId}/translations`, translation, { headers: this.getHeaders() }).pipe(
      tap(() => {
        console.log('Translation added, emitting value...');
        this.translationAdded$.next();
      }),
      catchError((error) => {
        return throwError('La limite quotidienne de 5 traductions a été atteinte.');
      })
    );
  }

  getTranslations(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/translations`, { headers: this.getHeaders() });
  }

  deleteTranslation(userId: string, translationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/translations/${translationId}`, { headers: this.getHeaders() }).pipe(
      tap(() => {
        console.log('Translation deleted, emitting value...');
        this.translationDeleted$.next();
      })
    );
  }
}



