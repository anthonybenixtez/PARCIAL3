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

  @Input() maestro: Maestros; // Recibe el maestro específico
  materias: any[];
  materiaSeleccionada: any; // Declaración de la propiedad materiaSeleccionada

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) { }

  ngOnInit() {
    this.firebaseSvc.getMaterias().subscribe((materias) => {
      this.materias = materias;
    });
  }

  onSelectMateria(event: any) {
    const selectedMateriaId = event.detail?.value; // Uso de `event.detail.value` para obtener el valor seleccionado
    if (selectedMateriaId) {
      this.materiaSeleccionada = this.materias.find((materia) => materia.aid === selectedMateriaId); // Compara con `aid`
      if (!this.materiaSeleccionada) {
        console.warn('Materia no encontrada con ID:', selectedMateriaId);
      }
    } else {
      console.warn('Evento de selección no válido:', event);
    }
  }
  
  getMateriaNombre(materiaId: string): string {
    if (!materiaId || materiaId.trim() === "") {
      return "ID inválido";
    }
  
    const materia = this.materias.find((m) => m.aid === materiaId); // Asegúrate de comparar con la propiedad correcta
  
    return materia ? materia.name : "Materia no encontrada";
  }
  
  
}
