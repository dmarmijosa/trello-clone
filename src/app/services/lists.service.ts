import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {CreateListDto, List} from '@models/list.model';
import {checkToken} from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ListsService {
  apiUrl = environment.API_URL;
  private http=inject(HttpClient);

  create(dto:CreateListDto){
    return this.http.post<List>(`${this.apiUrl}/api/v1/lists`,dto,{
      context:checkToken()
    })
  }

}
