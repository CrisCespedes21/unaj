import { TipoCombustibleFactorCollection } from "@/components/tipoCombustible/services/tipoCombustibleFactor.interface";

export interface TipoActivo {
  id: number;
  nombre: string;
  unidad: string;
  descripcionId: number;
  categoriaId: number;
  grupoId: number;
  procesoId: number;
  descripcion: string;
  categoria: string;
  grupo: string;
  proceso: string;
}

export interface TipoActivoCollectionItem {
  id: number;
  nombre: string;
  unidad: string;
  descripcionId: number;
  categoriaId: number;
  grupoId: number;
  procesoId: number;
  descripcion: string;
  categoria: string;
  grupo: string;
  proceso: string;
  rn: number;
}

export interface TipoActivoCollectionPaginate {
  data: TipoActivoCollectionItem[];
  meta: Meta;
}

interface Meta {
  page: number;
  perPage: number;
  totalRecords: number;
  totalPages: number;
}

export interface TipoActivoCollection {
  id: number;
  nombre: string;
  unidad: string;
  descripcionId: number;
  categoriaId: number;
  grupoId: number;
  procesoId: number;
  descripcion: string;
  categoria: string;
  grupo: string;
  proceso: string;
}

export interface TipoActivoResource {
  id: number;
  nombre: string;
  unidad: string;
  descripcionId: number;
  categoriaId: number;
  grupoId: number;
  procesoId: number;
  descripcion: string;
  categoria: string;
  grupo: string;
  proceso: string;
}

export interface TipoActivoRequest {
  nombre: string;
  unidad: string;
  categoriaId: number;
  peso: number;
  fuente?: string;
  costoUnitario?: number;
}

export interface CreateTipoActivoProps {
  onClose: () => void;
}

export interface UpdateTipoActivoProps {
  onClose: () => void;
  id: number;
}
