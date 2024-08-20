import api from "../../../../config/api";

import { AxiosRequestConfig, AxiosResponse } from "axios";
import { TaxiCollection, TaxiRequest } from "./taxi.interface";

export async function getTaxi(
  sedeId?: string,
  anioId?: string,
  mesId?: string,
  sort?: string,
  direction?: string
): Promise<TaxiCollection[]> {
  const config: AxiosRequestConfig = {
    params: {
      sedeId,
      anioId,
      mesId,
      sort,
      direction,
    },
  };
  const { data } = await api.get<TaxiCollection[]>("/api/taxi", config);
  return data;
}

export async function getTaxiById(id: number) {
  const { data } = await api.get(`/api/taxi/${id}`);
  return data;
}

export async function createTaxi(
  body: TaxiRequest
): Promise<AxiosResponse<Response>> {
  return await api.post("/api/taxi", body);
}

export async function updateTaxi(
  id: number,
  body: TaxiRequest
): Promise<AxiosResponse<Response>> {
  return await api.put(`/api/taxi/${id}`, body);
}

export async function deleteTaxi(id: number): Promise<AxiosResponse<Response>> {
  return await api.delete(`/api/taxi/${id}`);
}
