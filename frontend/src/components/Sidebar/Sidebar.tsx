import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button.tsx";
import { Home, Info, Phone } from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
    { to: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { to: "/octo-profiles", label: "Octo Profiles", icon: <Info className="w-4 h-4" /> },
    { to: "/cookies-counter", label: "Cookies Counter", icon: <Phone className="w-4 h-4" /> },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="h-screen w-64 border-r bg-muted/40 flex flex-col p-4">
            {navItems.map((item) => (
                <Button
                    key={item.to}
                    variant={location.pathname === item.to ? "secondary" : "ghost"}
                    className={cn(
                        "justify-start gap-2",
                        location.pathname === item.to && "font-semibold"
                    )}
                    asChild
                >
                    <Link to={item.to}>
                        {item.icon}
                        {item.label}
                    </Link>
                </Button>
            ))}
        </aside>
    );
}
