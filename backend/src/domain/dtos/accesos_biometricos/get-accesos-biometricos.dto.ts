export class GetAccesosBiometricosDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly estado?: string
  ) {}

  static create(
    page: number = 1,
    limit: number = 10,
    estado?: any
  ): [{ [key: string]: string }?, GetAccesosBiometricosDto?] {
    const errors: { [key: string]: string } = {};

    if (isNaN(page) || page <= 0) {
      errors.page = 'La página debe ser un número mayor a 0';
    }

    if (isNaN(limit) || limit <= 0) {
      errors.limit = 'El límite debe ser un número mayor a 0';
    }

    const estadoNormalizado =
      typeof estado === 'string' ? estado.trim().toUpperCase() : undefined;

    if (
      estadoNormalizado &&
      !['PERMITIDO', 'DENEGADO'].includes(estadoNormalizado)
    ) {
      errors.estado = 'El estado debe ser PERMITIDO o DENEGADO';
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [
      undefined,
      new GetAccesosBiometricosDto(page, limit, estadoNormalizado),
    ];
  }
}
