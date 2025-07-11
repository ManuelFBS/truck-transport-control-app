export enum UserRole {
        OWNER = 'Owner',
        ADMIN = 'Admin',
        EMPLOYEE = 'Empleado',
        ENTERPRISE = 'Empresa',
}

export enum UserStatus {
        ACTIVE = 'Activo',
        INACTIVE = 'Inactivo',
        BLOCKED = 'Bloqueado',
}

export class User {
        constructor(
                public id: number,
                public cedula: string,
                public usuario: string,
                public password: string,
                public roles: UserRole,
                public estado: UserStatus,
                public logged: boolean,
                public intentosFallidos: number,
                public ultimoIntento: Date,
                public createdAt: Date,
                public updatedAt: Date,
        ) {}
}
