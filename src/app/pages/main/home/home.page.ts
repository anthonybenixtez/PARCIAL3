import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

//IMPORTAR
import { ChartDataset, ChartOptions } from 'chart.js';
type Label = string | string [];

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

  public barChartOptions: ChartOptions = {
    responsive: true,
  }

  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010']
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset<'bar'>[]= [
    {data: [65, 59, 80, 81, 56], label: 'Series A'},
    {data: [28, 48, 40, 19, 86], label: 'Series A'},
 
  ]


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
