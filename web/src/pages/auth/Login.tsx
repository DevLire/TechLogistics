import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/useAuthStore.ts';
import { TechLogisticsIcon } from '@/components/TechLogisticsIcon.tsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }

    setIsPosting(true);
    setError(''); // Limpiamos errores previos al intentar
    const isValid = await login(email, password);
    console.log(isValid);

    if (isValid) {
      navigate('/dashboard');
      return;
    }

    setError('Correo y/o contraseña no válidos');
    setIsPosting(false);
  };

  return (
    <div className="flex min-h-screen font-sans selection:bg-[#2ecc71]/30 selection:text-white">
      {/* Panel izquierdo - Branding & Features */}
      <div className="relative hidden flex-1 flex-col justify-between bg-[#0f4c35] p-12 lg:flex">
        {/* Decoración sutil de fondo */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

        <div className="relative flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-md">
            <TechLogisticsIcon />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            TechLogistics
          </span>
        </div>

        <div className="relative max-w-md">
          <h2 className="mb-4 text-3xl leading-tight font-semibold tracking-tight text-white">
            Sistema de gestión de almacén
          </h2>
          <p className="text-base leading-relaxed text-white/60">
            Control de inventario, ventas y alertas de stock en tiempo real
            optimizado para entornos de alta exigencia.
          </p>
        </div>

        <div className="relative flex flex-col gap-3">
          {[
            'Alertas de stock automáticas',
            'Registro de Movimientos del almacén',
            'Panel de inventario en vivo',
            'Gestión de acceso al almacén',
          ].map((txt) => (
            <div
              key={txt}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-[#2ecc71] shadow-[0_0_8px_#2ecc71]" />
              {txt}
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho */}
      <div
        className="relative flex flex-[1.2] flex-col justify-center bg-[#0d0d0d] p-6 sm:p-12 md:p-16 lg:px-20"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #121212 25%, transparent 25%), 
            linear-gradient(-45deg, #121212 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #121212 75%), 
            linear-gradient(-45deg, transparent 75%, #121212 75%)
          `,
          backgroundSize: '10px 10px',
          backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d] opacity-60" />

        <div className="relative z-10 mx-auto w-full max-w-md">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <TechLogisticsIcon />
            <span className="text-lg font-bold text-white">TechLogistics</span>
          </div>

          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-2xl shadow-black/80 backdrop-blur-xl sm:p-8">
            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-white">
              Bienvenido
            </h1>
            <p className="mb-6 text-xs text-gray-500">
              Ingresa tus credenciales para acceder al panel administrativo.
            </p>

            {error && (
              <div className="animate-fadeIn mb-5 flex items-center gap-3 rounded-xl border border-red-950/50 bg-red-950/20 p-3.5 text-xs text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <p className="flex-1 font-medium">{error}</p>
              </div>
            )}

            <form className="flex flex-col gap-4.5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                  Correo electrónico
                </label>
                <input
                  required
                  className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-2.5 px-3.5 text-sm text-white placeholder-gray-600 transition-all outline-none focus:border-[#0f4c35] focus:bg-zinc-950 focus:ring-4 focus:ring-[#0f4c35]/15"
                  placeholder="usuario@empresa.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                  Contraseña
                </label>
                <input
                  required
                  className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-2.5 px-3.5 text-sm text-white placeholder-gray-600 transition-all outline-none focus:border-[#0f4c35] focus:bg-zinc-950 focus:ring-4 focus:ring-[#0f4c35]/15"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className={`mt-2 w-full rounded-xl py-3 text-sm font-semibold tracking-wide text-white shadow-lg transition-all duration-200 ${
                  isPosting
                    ? 'cursor-not-allowed bg-zinc-800 text-zinc-500 shadow-none'
                    : 'bg-[#0f4c35] shadow-[#0f4c35]/5 hover:bg-[#146647] active:scale-[0.99]'
                }`}
                disabled={isPosting}
                type="submit"
              >
                {isPosting ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-500 border-t-white" />
                    <span className="text-xs">Validando...</span>
                  </div>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
