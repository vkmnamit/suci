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
            <div className="w-2 h-2 rounded-full bg-[#E8DCCF]"></div>
            <h1 className="text-3xl font-bold tracking-wider text-white">
              SUCI
            </h1>
          </div>
        </div>

        {/* Center: City Selector */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
          <Select
            value={selectedCity}
            onValueChange={onCityChange}
          >
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0B0B0B] border-white/10">
              <SelectItem value="bangalore">
                Bangalore
              </SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right: Profile */}
        <button className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center border border-white/10">
          <User className="w-4 h-4 text-[#E8DCCF]" />
        </button>
      </div>
    </nav>
  );
}