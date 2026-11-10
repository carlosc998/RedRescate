import { Mascota } from '../types/mascota';

export const INITIAL_MASCOTAS: Mascota[] = [
  {
    id: '1',
    titulo: 'Perrito con collar rojo visto cerca de la plaza',
    tipo: 'Perro',
    estado: 'Perdido',
    zona: 'Palermo, CABA',
    contacto: '+541198765432',
    imagen: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
    descripcion: 'Es muy miedoso, tiene una mancha blanca en el pecho. Estaba asustado por los ruidos.',
    fecha: '2026-10-25'
  },
  {
    id: '2',
    titulo: 'Gatito naranja rescatado en cochera',
    tipo: 'Gato',
    estado: 'Encontrado',
    zona: 'Belgrano, CABA',
    contacto: '+541112345678',
    imagen: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
    descripcion: 'Apareció maullando adentro de un edificio. Es cachorro, muy cariñoso.',
    fecha: '2026-10-24'
  }
];