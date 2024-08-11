export interface CreateElectricidadProps {
    onClose: () => void;
}

export interface UpdateElectricidadProps {
    id: number;
    onClose: () => void;
}

//PARA EL INDEX
export interface electricidadCollection {
    id: number;
    area: string;
    numeroSuministro: string;
    consumo: number;
    mes: string;
    anio: number;
    sede: string;
}


//PARA EL SHOW
export interface electricidadResource {
    id: number;
    areaId: number;
    numeroSuministro: string;
    consumo: number;
    mes_id: number;
    sede_id: number;
    anio_id: number;
    created_at: Date;
    updated_at: Date;
    anio: Anio;
    sede: Sede;
    mes: Mes;
    area: Area;
}

export interface Mes {
    id: number;
    nombre: string;
    created_at: Date;
    updated_at: Date;
}

export interface Anio {
    id: number;
    nombre: string;
    created_at: Date;
    updated_at: Date;
}

export interface Sede {
    id: number;
    name: string;
}

export interface Area {
    id: number;
    name: string;
}


export interface electricidadRequest {
    area_id: number;
    numeroSuministro: string;
    consumo: number;
    mes_id: number;
    sede_id: number;
    anio_id: number;
}








