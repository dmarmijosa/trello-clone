import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';

import {AuthService} from '@services/auth.service';
import {BoardsService} from '@services/boards.service';
import {Colors, NAVBARBACKGROUNDS} from '@models/colors.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;
  isOpenCreateBoards = false;


  user$ = this.authService.user$;

  private boardService = inject(BoardsService);
  navbarBackgroundColor: Colors = 'sky';
  NavbarColors=NAVBARBACKGROUNDS;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.boardService.backgroundColor$.subscribe(color => {
      this.navbarBackgroundColor = color
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  close($event: boolean) {
    this.isOpenCreateBoards = $event;
  }
  get colors(){
    const classes = this.NavbarColors[this.navbarBackgroundColor];
    return classes ?  classes:{}
  }

  protected readonly NAVBARBACKGROUNDS = NAVBARBACKGROUNDS;
}
