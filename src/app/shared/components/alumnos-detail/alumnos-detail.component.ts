import { Component, Input, OnInit } from '@angular/core';
import { Alumnos } from 'src/app/models/alumnos.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-alumnos-detail',
  templateUrl: './alumnos-detail.component.html',
  styleUrls: ['./alumnos-detail.component.scss'],
})
export class AlumnosDetailComponent  implements OnInit {

  @Input() alumno: Alumnos; // Recibe el cultivo específico
  materias: any[];
  maestros: any[];
  materiaSeleccionada: any; // Declaración de la propiedad materiaSeleccionada
  maestroSeleccionado: any; // Declaración de la propiedad materiaSeleccionada



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


  onSelectMaestro(event: any) {
    const selectedMaestroId = event.detail?.value; // Uso de `event.detail.value` para obtener el valor seleccionado
    if (selectedMaestroId) {
      this.maestroSeleccionado = this.materias.find((maestro) => maestro.aid === selectedMaestroId); // Compara con `aid`
      if (!this.maestroSeleccionado) {
        console.warn('Maestro no encontrada con ID:', selectedMaestroId);
      }
    } else {
      console.warn('Evento de selección no válido:', event);
    }
  }
  
  getMaestroNombre(maestroId: string): string {
    if (!maestroId || maestroId.trim() === "") {
      return "ID inválido";
    }
  
    const maestro = this.maestros.find((m) => m.aid === maestroId); // Asegúrate de comparar con la propiedad correcta
  
    return maestro ? maestro.name : "Materia no encontrada";
  }
  
  
  
}
