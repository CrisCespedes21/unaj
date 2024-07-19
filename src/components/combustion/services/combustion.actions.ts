import api from "../../../../config/api";
import {
    CombustionCollection,
    CombustionRequest,
} from "./combustion.interface";
import {AxiosRequestConfig} from "axios";

export async function getCombustion(
    tipo: string = "estacionario",
    sedeId?: number,
    sort?: string,
    direction?: string,
    anioId?: number,
): Promise<CombustionCollection[]> {
    const config: AxiosRequestConfig = {
        params: {
            tipo,
            sedeId,
            sort,
            direction,
            anioId,
        },
    };
    const {data} = await api.get<CombustionCollection[]>(
        "/api/combustion",
        config
    );
    return data;
}

export async function createCombustion(body: CombustionRequest) {
    const {data} = await api.post("/api/combustion", body);
    return data;
}
