import { User, Menu } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface NavbarProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  onMenuClick: () => void;
}

export function Navbar({
  selectedCity,
  onCityChange,
  onMenuClick,
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 backdrop-blur-xl bg-black/40">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Mobile Menu + Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center border border-white/10"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-black p-1 rounded-md border border-white/5 shadow-inner flex items-center justify-center">
              <img src="https://res.cloudinary.com/dgrrdy6sk/image/upload/v1774677791/1546087-middle_mou8af.png" alt="SUCI Logo" className="w-8 h-8 object-contain mix-blend-screen" />
            </div>
            <h1 className="text-3xl font-bold tracking-wider text-white">
              SUCI
            </h1>
          </div>
        </div>

        {/* Center: City Selector */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
            Bangalore Hub
          </div>
        </div>

        {/* Right: Profile */}
        <button className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center border border-white/10">
          <User className="w-4 h-4 text-[#E8DCCF]" />
        </button>
      </div>
    </nav>
  );
}