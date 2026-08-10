import { regularExps } from '@techlogistics/shared/config';

export class UpdateUserDto {
  private constructor(
    public readonly id: number,
    public readonly nombre?: string,
    public readonly email?: string,
    public readonly rol?: string,
    public readonly password?: string,
    public readonly activo?: boolean,
    public readonly puede_registrar_dispositivo?: boolean,
    public readonly permite_fallback_password?: boolean
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.nombre !== undefined) returnObj.nombre = this.nombre;
    if (this.email !== undefined) returnObj.email = this.email;
    if (this.rol !== undefined) returnObj.rol = this.rol;
    if (this.password !== undefined) returnObj.password = this.password;
    if (this.activo !== undefined) returnObj.activo = this.activo;

    if (this.puede_registrar_dispositivo !== undefined)
      returnObj.puede_registrar_dispositivo = this.puede_registrar_dispositivo;
    if (this.permite_fallback_password !== undefined)
      returnObj.permite_fallback_password = this.permite_fallback_password;

    return returnObj;
  }

  static create(props: {
    [key: string]: string;
  }): [{ [key: string]: string }?, UpdateUserDto?] {
    const {
      id,
      nombre,
      email,
      rol,
      password,
      activo,
      puede_registrar_dispositivo,
      permite_fallback_password,
    } = props;
    const errors: { [key: string]: string } = {};

    if (!id || isNaN(Number(id)))
      return [{ id: 'El ID debe ser un número válido' }, undefined];

    // Validar si hay algo para actualizar
    if (
      !nombre &&
      !email &&
      !rol &&
      !password &&
      activo === undefined &&
      puede_registrar_dispositivo === undefined &&
      permite_fallback_password === undefined
    ) {
      return [{ data: 'No hay datos para actualizar' }, undefined];
    }

    if (email !== undefined) {
      if (!regularExps.email.test(email)) {
        errors.email = 'El email no es válido.';
      }
    }

    if (rol !== undefined) {
      const allowedRoles = ['ADMINISTRADOR', 'OPERARIO', 'SUPERVISOR'];
      if (!allowedRoles.includes(rol.toUpperCase().trim())) {
        errors.rol = `Roles permitidos: ${allowedRoles.join(', ')}.`;
      }
    }

    if (password !== undefined) {
      if (password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres.';
      }
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [
      undefined,
      new UpdateUserDto(
        Number(id),
        nombre?.trim(),
        email?.toLowerCase().trim(),
        rol?.toUpperCase().trim(),
        password,
        activo !== undefined ? Boolean(activo) : undefined,
        puede_registrar_dispositivo !== undefined
          ? Boolean(puede_registrar_dispositivo)
          : undefined,
        permite_fallback_password !== undefined
          ? Boolean(permite_fallback_password)
          : undefined
      ),
    ];
  }
}
