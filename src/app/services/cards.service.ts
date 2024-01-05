import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Card, UpdateCardDto} from '@models/card.model';
import {checkToken} from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  http = inject(HttpClient);

  apiUrl = environment.API_URL;
  constructor() { }
  update(id:Card['id'], changes:UpdateCardDto ){
    return this.http.put<Card>(`${this.apiUrl}/api/v1/cards/${id}`, changes,{
      context: checkToken()
    });
  }
}
