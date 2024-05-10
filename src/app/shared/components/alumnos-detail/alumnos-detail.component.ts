import { Component, Input, OnInit } from '@angular/core';
import { Alumnos } from 'src/app/models/alumnos.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { NgIf } from '@angular/common';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  maestroSeleccionado: any; // Declaración de la propiedad maestroSeleccionado

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) { }

  ngOnInit() {
    this.firebaseSvc.getMaterias().subscribe((materias) => {
      this.materias = materias;
    });

    this.firebaseSvc.getMaestros().subscribe((maestros) => {
      this.maestros = maestros;
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
    const selectedMaestroId = event.detail?.value;
    if (selectedMaestroId) {
      this.maestroSeleccionado = this.maestros.find((maestro) => maestro.aid === selectedMaestroId);
      if (!this.maestroSeleccionado) {
        console.warn('Maestro no encontrado con ID:', selectedMaestroId);
      }
    } else {
      console.warn('Evento de selección no válido:', event);
    }
  }
  
  getMaestroNombre(maestroId: string): string {
    if (!maestroId || maestroId.trim() === "") {
      return "ID inválido";
    }
  
    const maestro = this.maestros.find((m) => m.aid === maestroId);
  
    return maestro ? maestro.name : "Maestro no encontrado";
  }


 // generatePdf() {
 //   pdfMake.vfs = pdfFonts.pdfMake.vfs;

  //  const documentDefinition = {
   //   content: [
  //      'Hola, este es un PDF generado desde Ionic con pdfmake.'
    //  ]
   /// };

   // pdfMake.createPdf(documentDefinition).open();
 // }

 createPDF2() {
  // Contenido del PDF

  let estado = this.alumno.promedio > 7 ? 'aprobado' : 'reprobado';

  const content = [
    { text: 'Reporte de notas', style: 'header' },
    { text: `Carnet: ${this.alumno.carnet}`, style: 'subheader' },
    { text: `Alumno: ${this.alumno.name} ${this.alumno.apellido}`, style: 'subheader' },
    { text: `Profesor: ${this.getMaestroNombre(this.alumno.maestroId)}`, style: 'subheader' },
    { text: `Ciclo: ${this.alumno.ciclo}`, style: 'subheader' },
    { text: `Materia: ${this.getMateriaNombre(this.alumno.materiaId)}`, style: 'subheader2' },
    { text: ''},
    {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*'],
        body: [
          ['Parcial I', 'Parcial II', 'Parcial III', 'Parcial IV', 'Promedio'],
          [this.alumno.nota1.toString(), this.alumno.nota2.toString(), this.alumno.nota3.toString(), this.alumno.nota4.toString(), this.alumno.promedio.toString()]
        ]
      }
    },
    { text: `Estado: ${estado}`, style: 'subheader3' }
  ];

  // Definir estilos
  const styles = {
    header: {
      fontSize: 20,
      bold: true,
      alignment: 'center',
      margin: [0, 0, 0, 20],
    },
    subheader: {
      fontSize: 14,
      bold: true,
      margin: [0, 0, 0, 5]
    },
    subheader2: {
      fontSize: 14,
      bold: true,
      margin: [0, 0, 0, 20]
    },
    subheader3: {
      fontSize: 14,
      alignment: 'center',
      bold: true,
      margin: [20, 20, 20, 20]
    }
  };

  // Definir el documento PDF
  const documentDefinition = {
    content,
    styles
  };

  // Crear y abrir el PDF
  pdfMake.createPdf(documentDefinition).open();
}


//refresh




  
}
