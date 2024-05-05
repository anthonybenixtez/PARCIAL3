import { Component, Input, OnInit } from '@angular/core';
import { Materias } from 'src/app/models/materias.model';

@Component({
  selector: 'app-materias-detail',
  templateUrl: './materias-detail.component.html',
  styleUrls: ['./materias-detail.component.scss'],
})
export class MateriasDetailComponent  implements OnInit {

  @Input() materias: Materias; // Recibe el cultivo específico


  constructor() { }

  ngOnInit() {}

}
