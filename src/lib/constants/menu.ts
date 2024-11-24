import {
    Home,
    Truck,
    Flame,
    Droplet,
    Zap,
    FileText,
    Bean,
    Car,
    Scroll,
    Sprout,
    Settings,
    MapPinned,
    Droplets,
    CarTaxiFront,
    UserRound,
    Gauge,
    FlaskConical,
    PlugZap,
    Milk,
    StretchHorizontal,
    FireExtinguisher,
    Plane,
    Bus,
    Fuel,
    Calendar,
    LampDesk,
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
    Scroll,
    Sprout,
    Settings,
    MapPinned,
    Droplets,
    CarTaxiFront,
    UserRound,
    Gauge,
    FlaskConical,
    PlugZap,
    Milk,
    StretchHorizontal,
    FireExtinguisher,
    Plane,
    Bus,
    Fuel,
    Calendar,
    LampDesk,
};

export const STEP_NUMBER = 0.00000000000000001;

export const menu: MenuItem[] = [
    {
        title: "Resumen",
        icon: "Home",
        href: "/home",
    },
    {
        title: "Categoria 1",
        icon: "Flame",
        href: "/",
        items: [
            {
                title: "Combustión Móvil",
                icon: "Fuel",
                href: "/combustion-movil",
            },
            {
                title: "Combustión Estacionaria",
                icon: "Flame",
                href: "/combustion-estacionaria",
            },
            {
                title: "Fertilizante",
                icon: "Bean",
                href: "/fertilizante",
            },
            {
                title: "Extintores",
                icon: "FireExtinguisher",
                href: "/extintor",
            },
        ],
    },
    {
        title: "Categoria 2",
        icon: "Zap",
        href: "/",
        items: [
            {
                title: "Consumo de Energía",
                icon: "Zap",
                href: "/electricidad",
            },
        ],
    },
    {
        title: "Categoria 3",
        icon: "CarTaxiFront",
        href: "/",
        items: [
            {
                title: "Transporte Aéreo",
                icon: "Plane",
                href: "/transporte-aereo",
            },
            {
                title: "Transporte Terrestre",
                icon: "Bus",
                href: "/transporte-terrestre",
            },
            {
                title: "Taxis",
                icon: "CarTaxiFront",
                href: "/taxi",
            },
            {
                title: "Transporte Casa-Trabajo",
                icon: "Car",
                href: "/transporte-casa-trabajo",
            },
        ],
    },
    {
        title: "Categoria 4",
        icon: "FileText",
        href: "/",
        items: [
            {
                title: "Consumo de Papel",
                icon: "FileText",
                href: "/papel",
            },
            {
                title: "Consumo de Agua",
                icon: "Droplets",
                href: "/consumo-agua",
            },
            {
                title: "Activos Fijos",
                icon: "LampDesk",
                href: "/activos-fijos",
            },
            {
                title: "Consumibles Generales",
                icon: "Milk",
                href: "/consumible",
            },
        ],
    },
    {
        title: "Factores",
        icon: "FlaskConical",
        href: "/",
        items: [
            {
                title: "Factores de Combustibles",
                icon: "Flame",
                href: "/tipo-combustible-factor",
            },
            {
                title: "Factor de Fertilizante",
                icon: "Sprout",
                href: "/fertilizante-factor",
            },
            {
                title: "Factor de Emision SEIN",
                icon: "PlugZap",
                href: "/factor-emision-SEIN",
            },
            {
                title: "Factores de Consumibles",
                icon: "Milk",
                href: "/tipo-consumible-factor",
            },
            {
                title: "Factores de Activos",
                icon: "LampDesk",
                href: "/tipo-activo-factor",
            },
            {
                title: "Factor de Transporte Aereo",
                icon: "Plane",
                href: "/transporte-aereo-factor",
            },
            {
                title: "Factor de Transporte Terrestre",
                icon: "Bus",
                href: "/transporte-terrestre-factor",
            },
            {
                title: "Factor de Vehículo",
                icon: "Car",
                href: "/tipo-vehiculo-factor",
            },
            {
                title: "Factor de Extintor",
                icon: "Car",
                href: "/extintor-factor",
            },
        ],
    },
    {
        title: "Configuraciones",
        icon: "Settings",
        href: "/settings",
        items: [
            {
                title: "Tipos de Activos",
                icon: "LampDesk",
                href: "/tipo-activo",
            },
            {
                title: "Tipo de Papel",
                icon: "Scroll",
                href: "/tipo-papel",
            },
            {
                title: "Tipos de Combustible",
                icon: "Flame",
                href: "/tipo-combustible",
            },
            {
                title: "Tipos de Vehículo",
                icon: "Car",
                href: "/tipo-vehiculo",
            },
            {
                title: "Tipos de Consumible",
                icon: "Milk",
                href: "/tipo-consumible",
            },
            {
                title: "Tipos de Fertilizantes",
                icon: "Sprout",
                href: "/tipo-fertilizante",
            },
            {
                title: "Area",
                icon: "MapPinned",
                href: "/area",
            },
            {
                title: "GPW",
                icon: "Gauge",
                href: "/gpw",
            },
            {
                title: "Usuarios",
                icon: "UserRound",
                href: "/user",
            },
            {
                title: "Años",
                icon: "Calendar",
                href: "/anio",
            },
        ],
    },
];
