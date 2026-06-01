-- CreateEnum
CREATE TYPE "MetodoAcceso" AS ENUM ('HUELLA', 'PASSWORD');

-- AlterTable
ALTER TABLE "Acceso_Biometrico" ADD COLUMN     "metodo_acceso" "MetodoAcceso" NOT NULL DEFAULT 'HUELLA';

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "permite_fallback_password" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "puede_registrar_dispositivo" BOOLEAN NOT NULL DEFAULT false;
