import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '@environments/environment';
import {User} from '@models/user.model';
import {checkToken} from '@interceptors/token.interceptor';
import {Board} from '@models/board.model';
import {Card} from '../models/card.model';
import {Colors} from '@models/colors.model';
import {List} from '@models/list.model';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  apiUrl = environment.API_URL;
  bufferSpace = 65535;
  backgroundColor$ = new BehaviorSubject<Colors>('sky');

  private http = inject(HttpClient);

  createBoard(title: string, backgroundColor: Colors) {
    return this.http.post<Board>(`${this.apiUrl}/api/v1/boards`, {title, backgroundColor}, {
      context: checkToken()
    })
  }

  getBoards(id: Board['id']) {
    return this.http.get<Board>(`${this.apiUrl}/api/v1/boards/${id}`, {
      context: checkToken(),
    }).pipe(
      tap(board => this.setBackgroundColor(board.backgroundColor))
    );
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
      const prePosition = cards[currentIndex - 1].position;
      const nextPosition = cards[currentIndex + 1].position;

      return (prePosition + nextPosition) / 2;
    }
    if (cards.length > 1 && currentIndex === lasIndex) {
      const bottonPosition = cards[lasIndex - 1].position;
      return bottonPosition + this.bufferSpace;
    }

    return 0;
  }

  getpositionNewItem(element: Card[] | List[]) {
    if (element.length === 0) {
      return this.bufferSpace;
    }
    const lasIndex = element.length - 1;
    const bottonPosition = element[lasIndex].position;
    return bottonPosition + this.bufferSpace;
  }

  setBackgroundColor(color: Colors) {
    this.backgroundColor$.next(color)
  }
}
