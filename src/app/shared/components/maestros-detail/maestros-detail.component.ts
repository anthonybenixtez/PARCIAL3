import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Maestros } from 'src/app/models/maestros.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-maestros-detail',
  templateUrl: './maestros-detail.component.html',
  styleUrls: ['./maestros-detail.component.scss'],
})
export class MaestrosDetailComponent implements OnInit {

  @Input() maestro: Maestros; // Recibe el cultivo específico
  materias: any[];
  materiaSeleccionada: any; // Declaración de la propiedad materiaSeleccionada

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) { }

  ngOnInit() {
    this.firebaseSvc.getMaterias().subscribe((materias) => {
      this.materias = materias;
    });
  }

  onSelectMateria(event) {
    const selectedMateriaId = event.target.value;
    this.materiaSeleccionada = this.materias.find(materia => materia.id === selectedMateriaId);
  }
  getMateriaNombre(materiaId: string): string {
    const materia = this.materias.find(m => m.aid === materiaId);
    return materia ? materia.name : 'Materia no encontrada';
  }

}
