export enum TypeOfContract {
        FIJO = 'Fijo',
        INDETERMINADO = 'Indeterminado',
}

export class Employee {
        constructor(
                public id: number,
                public cedula: string,
                public nombres: string,
                public apellidos: string,
                public fecha_nacimiento: Date,
                public correo: string,
                public telefono: string,
                public fecha_inicio_contrato: Date,
                public fecha_final_contrato: Date,
                public tipo_contrato: TypeOfContract,
                public createdAt: Date,
                public updatedAt: Date,
        ) {}
}
