import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

//IMPORTAR
import { ChartDataset, ChartOptions } from 'chart.js';
import { Alumnos } from 'src/app/models/alumnos.model';
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

  public barChartLabels: Label[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset<'bar'>[] = [
    { data: [], label: 'Promedio' }
  ]


  ngOnInit() {
    this.getUserRole(); 
    this.loadChartData();

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

  loadChartData() {
    this.firebaseSvc.getAlumnos().subscribe((alumnos: Alumnos[]) => {
      const labels = alumnos.map(alumno => `${alumno.name} ${alumno.apellido}`);
      const data = alumnos.map(alumno => alumno.promedio);

      this.barChartLabels = labels;
      this.barChartData = [{ data, label: 'Promedio' }];
    });
  }
}
