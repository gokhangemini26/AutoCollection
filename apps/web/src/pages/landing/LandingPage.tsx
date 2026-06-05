import { useNavigate } from "react-router-dom"
import ShaderBackground from "../../components/ui/shader-background"

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ShaderBackground />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="text-center space-y-6 px-4">
          <p className="text-purple-300 text-xs tracking-[0.4em] uppercase">
            Fashion Intelligence Platform
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-widest text-white drop-shadow-lg">
            VIBE<span className="text-purple-300">ERP</span>
          </h1>
          <p className="text-purple-200 text-sm tracking-widest uppercase">
            Koleksiyon · Tasarım · Strateji
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-10 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-3 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-purple-100 transition-colors"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-3 border border-white text-white font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors"
            >
              Kayıt Ol
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
        <p className="text-purple-900 text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} YZ Koleksiyon
        </p>
      </div>
    </div>
  )
}
