import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { TodoDialogComponent } from '@boards/components/todo-dialog/todo-dialog.component';

import { ActivatedRoute } from '@angular/router';
import { BoardsService } from '@services/boards.service';
import { Board } from '@models/board.model';
import { Card } from '@models/card.model';
import {CardsService} from '@services/cards.service';
import {List} from '@models/list.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ListsService} from '@services/lists.service';
import {list} from 'postcss';
import {BACKGROUNDS} from '@models/colors.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styles: [
    `
      .cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class BoardComponent implements OnInit, OnDestroy {

  board: Board | null = null;
  inputCard = new FormControl<string>('',{
    nonNullable:true,
    validators: [Validators.required]
  });

  inputList = new FormControl<string>('',{
    nonNullable:true,
    validators: [Validators.required]
  });
  showListForm=false;
  colorBackgrounds =  BACKGROUNDS;

  private dialog =  inject(Dialog);
  private router = inject(ActivatedRoute);
  private boardService= inject(BoardsService);
  private cardService = inject(CardsService);
  private listService = inject(ListsService);


  ngOnInit(): void {
    this.router.paramMap.subscribe((params) => {
      const id = params.get('boardId');
      if (id) {
        this.getBoard(id)
      }
    });
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    const position= this.boardService.getPosition(event.container.data,event.currentIndex);
    const card = event.container.data[event.currentIndex];
    const listId = event.container.id;
    console.log(listId,'ListId')
    this.updateCard(card,position,listId);
  }

  addList() {
    const title = this.inputList.value;
    if(this.board){
      this.listService.create({
        title,
        boardId:this.board.id,
        position: this.boardService.getpositionNewItem(this.board.lists)
      }).subscribe(list=>{
        this.board?.lists.push({
          ...list,
          cards:[]
        });
        this.showListForm=true;
        this.inputList.setValue('');
      })
    }
  }

  openDialog(card: Card) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      minWidth: '300px',
      maxWidth: '50%',
      data: {
        card: card,
      },
    });
    dialogRef.closed.subscribe((output) => {
      if (output) {
        console.log(output);
      }
    });
  }

  private getBoard(id: string) {
    this.boardService.getBoards(id).subscribe((board) =>{
      this.board = board;
      //this.boardService.setBackgroundColor(this.board.backgroundColor);
    });
  }

  private updateCard(card:Card, position:number, listId: string |number){
    this.cardService.update(card.id, {position, listId}).subscribe((cardUpdate)=>{
      console.log(cardUpdate)
    })
  }

  openFormCard(list:List){
    //list.showCardForm = !list.showCardForm
    if(this.board?.lists){
      this.board.lists = this.board.lists.map(integratorList => {
        if(integratorList.id === list.id){
          return {
            ...integratorList,
            showCardForm:true,
          }
        }else{
          return {
            ...integratorList,
            showCardForm: false
          }
        }
      })
    }
  }
  createCard(list:List){
    const title = this.inputCard.value;
    if(this.board){
      this.cardService.create({
        title,
        listId:list.id,
        boardId: this.board.id,
        position:this.boardService.getpositionNewItem(list.cards),
      }).subscribe(card => {
        list.cards.push(card);
        this.inputCard.setValue('');
        list.showCardForm=false;
      })
    }
  }
  closeCardForm(list:List){
    list.showCardForm = false;
  }

  get colors(){
    if(this.board){
      const clases = this.colorBackgrounds[this.board.backgroundColor];
      return clases?clases:{}
    }
    return {}
  }
  ngOnDestroy(): void {
    this.boardService.setBackgroundColor('sky')
  }
}
