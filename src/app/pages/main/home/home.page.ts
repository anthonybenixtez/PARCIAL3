import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  showWelcomeContent: boolean = false;
  userRole: string = ''; 

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() {
    this.getUserRole(); 
  }

  getUserRole() {
    this.firebaseSvc.getCurrentUserWithRole().subscribe((user: User) => {
      if (user) {
        this.userRole = user.role;
      }
    });
  }

  signOut(){
    this.firebaseSvc.signOut();
  }

  toggleWelcomeContent() {
    this.showWelcomeContent = !this.showWelcomeContent;
  }
}
