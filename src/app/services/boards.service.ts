import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@models/user.model';
import { checkToken } from '@interceptors/token.interceptor';
import { Board } from '@models/board.model';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  apiUrl = environment.API_URL;
  bufferSpace = 65535;

  constructor(private http: HttpClient) {}

  getBoards(id: Board['id']) {
    return this.http.get<Board>(`${this.apiUrl}/api/v1/boards/${id}`, {
      context: checkToken(),
    });
  }
  getPosition(cards: Card[], currentIndex: number) {
    if (cards.length === 1) {
      return this.bufferSpace;
    }
    if (cards.length > 1 && currentIndex === 0) {
      const onTopPosition = cards[1].position;
      return onTopPosition / 2;
    }
    const lasIndex = cards.length - 1;
    if (cards.length > 2 && currentIndex > 0 && currentIndex < lasIndex) {
      const prePosition = cards[currentIndex -1].position;
      const nextPosition = cards[currentIndex +1].position;

      return (prePosition + nextPosition) /2;
    }
    if (cards.length > 1 && currentIndex === lasIndex) {
      const bottonPosition = cards[lasIndex].position;
      return bottonPosition + this.bufferSpace;
    }

    return 0;
  }
}
