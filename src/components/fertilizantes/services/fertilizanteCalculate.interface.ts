export interface FertilizanteCalc {
  tipofertilizanteId: number;
  consumoTotal: number;
  cantidadAporte: number;
  emisionDirecta: number;
  totalEmisionesDirectas: number;
  emisionGEI: number;
  // anioId: number;
  sedeId: number;
  periodoCalculoId: number;
}

export interface FertilizanteCalcRequest {
  sedeId: number;
  // anioId: number;
  from: string;
  to: string;
}

export interface FertilizanteCalcResponse {
  id: number;
  consumo: number;
  tipoFertilizante: string;
  unidad: string;
  clase: string;
  porcentajeNitrogeno: number;
  cantidadAporte: number;
  emisionDirecta: number;
  totalEmisionesDirectas: number;
  emisionGEI: number;
}
