import {
  Home,
  Truck,
  Flame,
  Droplet,
  Zap,
  FileText,
  Bean,
  Car,
} from "lucide-react";

export interface MenuItem {
  title: string;
  icon: string;
  href: string;
  items?: MenuItem[];
}

export const iconComponents: Record<string, any> = {
  Home,
  Flame,
  Truck,
  Droplet,
  Zap,
  FileText,
  Bean,
  Car,
};

export const menu: MenuItem[] = [
  {
    title: "Inicio",
    icon: "Home",
    href: "/home",
  },
  {
    title: "Combustión Estacionaria",
    icon: "Flame",
    href: "/combustion-estacionaria",
    items: [
      {
        title: "Cálculos",
        icon: "Flame",
        href: "/combustion-estacionaria/calculos",
      },
    ],
  },
  {
    title: "Combustión Móvil",
    icon: "Car",
    href: "/combustion-movil",
  },
  {
    title: "Fertilizante",
    icon: "Bean",
    href: "/fertilizante",
  },
  {
    title: "Consumo de Electricidad",
    icon: "Zap",
    href: "/electricidad",
  },
  {
    title: "Consumo de Papel",
    icon: "FileText",
    href: "/papel",
  },
  {
    title: "Taxis Contratados",
    icon: "FileText",
    href: "/taxi",
  },
];
