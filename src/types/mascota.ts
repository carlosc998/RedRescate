export type TipoMascota = 'Perro' | 'Gato' | 'Otro';
export type EstadoMascota = 'Perdido' | 'Encontrado' | 'En adopción';

export interface Mascota {
  id: string;
  titulo: string;
  tipo: TipoMascota;
  estado: EstadoMascota;
  zona: string;
  contacto: string;
  imagen: string;
  descripcion?: string;
  fecha: string;
  latitud?: number;
  longitud?: number;
  autorId: string;
}