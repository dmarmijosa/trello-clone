import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {faCheck, faPen} from '@fortawesome/free-solid-svg-icons';
import {BoardsService} from '@services/boards.service';
import {Colors} from '@models/colors.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html',
  styles: []
})
export class BoardFormComponent {
  @Output() closeOverlay = new EventEmitter<boolean>();
  form = this.formBuilder.nonNullable.group({
    title: ['',[Validators.required]],
    backgroundColor: new FormControl<Colors>( 'sky',{
    nonNullable:true,
    validators:[Validators.required]})
  })

  private boardService = inject(BoardsService);
  private router=inject(Router);
  constructor(private formBuilder: FormBuilder) {
  }



  doSave() {
    if (this.form.valid) {
      const {title, backgroundColor} = this.form.getRawValue();
      this.boardService.createBoard(title,backgroundColor).subscribe(board=> {
        this.closeOverlay.next(false);
        this.router.navigate(['/app/boards',board.id])
      } )
    } else {
      this.form.markAllAsTouched();
    }

  }

  protected readonly faPen = faPen;
  protected readonly faCheck = faCheck;

}
