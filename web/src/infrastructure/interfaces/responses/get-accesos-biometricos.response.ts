export interface GetAccesosBiometricosResponse {
    status:     string;
    message:    string;
    data:       Datum[];
    errors:     any[];
    pagination: Pagination;
}

export interface Datum {
    id_acceso_biometrico:   number;
    fecha_hora:             Date;
    estado:                 Estado;
    metodo_acceso:          MetodoAcceso;
    dispositivo_autorizado: DispositivoAutorizado;
    usuario:                Usuario;
}

export interface DispositivoAutorizado {
    id_dispositivo_autorizado: number;
    nombre_dispositivo:        string;
    dispositivo_id:            string;
}

type Estado = {
    Denegado: "DENEGADO",
    Permitido: "PERMITIDO",
}

type MetodoAcceso = {
    Huella: "HUELLA",
    Password: "PASSWORD",
}

interface Usuario {
    id_usuario: number;
    nombre:     string;
    rol:        Rol;
}

type Rol = {
    Administrador: "ADMINISTRADOR",
    Operario: "OPERARIO",
    Supervisor: "SUPERVISOR",
}

interface Pagination {
    page:  number;
    limit: number;
    total: number;
    next:  string;
    prev:  string;
}
