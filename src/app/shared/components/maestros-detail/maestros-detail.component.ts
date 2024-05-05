import { Component, Input, OnInit } from '@angular/core';
import { Maestros } from 'src/app/models/maestros.model';

@Component({
  selector: 'app-maestros-detail',
  templateUrl: './maestros-detail.component.html',
  styleUrls: ['./maestros-detail.component.scss'],
})
export class MaestrosDetailComponent  implements OnInit {

  @Input() maestro: Maestros; // Recibe el cultivo específico


  constructor() { }


  ngOnInit() {}

}
