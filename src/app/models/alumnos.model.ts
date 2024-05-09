export interface Alumnos {
    aid:string;
    carnet:string;
    name:string;
    apellido:string;
    email:string;
    ciclo: number;
    nota1:number; //vale 20%
    nota2:number; //vale 20%
    nota3:number; //vale 20%
    nota4:number; //vale 40%
    promedio:number; // nota1,2y3*0.20 y nota 4 * 0.40 / 4 = promedio
    materiaId: string;
    maestroId: string;
  }