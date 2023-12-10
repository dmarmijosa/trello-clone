import { Card } from './card.model';
import { Colors } from './colors.model';
import { List } from './list.model';
import { User } from './user.model';

export interface Board {
  id: string;
  title: string;
  backgroundColor: Colors;
  creationAt: Date;
  updatedAt: Date;
  members: User[];
  lists: List[];
  cards: Card[];
}
