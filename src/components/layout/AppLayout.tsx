import { Link, useLocation } from "react-router-dom";
import obLogo from "../../assets/logo/ob_logo_color.svg";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isNew = location.pathname === "/new";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F7F5" }}>
      <header className="bg-white border-b border-black/8 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-8 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center">
            <img src={obLogo} alt="Office Buddie" className="h-5.5" />
          </Link>
          <nav className="flex items-center gap-3">
            {!isNew && (
              <Link
                to="/new"
                className="flex items-center gap-1.5 bg-black text-white text-[13px] font-medium px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors"
              >
                <span className="text-base leading-none">+</span>새 견적서
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-10">{children}</main>
    </div>
  );
}
