import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Mascota, EstadoMascota } from '../types/mascota';

type Props = {
  mascota: Mascota;
  usuarioActualId?: string;
  onPress: (mascota: Mascota) => void;
  onDelete: (id: string) => void;
  onUpdateEstado: (id: string, nuevoEstado: EstadoMascota) => void;
};

export default function MascotaCard({ mascota, usuarioActualId, onPress, onDelete, onUpdateEstado }: Props) {
  
  const esDueño = usuarioActualId === mascota.autorId;

  const getEstadoConfig = (estado: EstadoMascota) => {
    switch (estado) {
      case 'Perdido':
        return { label: '🔴 Perdido', color: '#b91c1c', bg: '#fef2f2' };
      case 'Encontrado':
        return { label: '🟢 Encontrado', color: '#15803d', bg: '#f0fdf4' };
      case 'En adopción':
        return { label: '🔵 En adopción', color: '#1d4ed8', bg: '#eff6ff' };
    }
  };

  const config = getEstadoConfig(mascota.estado);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(mascota)} activeOpacity={0.9}>
      <Image source={{ uri: mascota.imagen }} style={styles.imagen} />
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={[styles.badge, { backgroundColor: config.bg }]}>
            <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
          </View>
          <Text style={styles.tipoText}>{mascota.tipo}</Text>
        </View>

        <Text style={styles.titulo} numberOfLines={2}>{mascota.titulo}</Text>
        <Text style={styles.zonaText}>📍 {mascota.zona}</Text>

        {esDueño && (
          <View style={styles.footerRow}>
            <View style={styles.estadoAcciones}>
              {mascota.estado !== 'Perdido' && (
                <TouchableOpacity 
                  style={styles.actionPill} 
                  onPress={() => onUpdateEstado(mascota.id, 'Perdido')}
                >
                  <Text style={styles.actionPillText}>Marcar Perdido</Text>
                </TouchableOpacity>
              )}
              {mascota.estado !== 'Encontrado' && (
                <TouchableOpacity 
                  style={styles.actionPill} 
                  onPress={() => onUpdateEstado(mascota.id, 'Encontrado')}
                >
                  <Text style={styles.actionPillText}>Marcar Encontrado</Text>
                </TouchableOpacity>
              )}
              {mascota.estado !== 'En adopción' && (
                <TouchableOpacity 
                  style={styles.actionPill} 
                  onPress={() => onUpdateEstado(mascota.id, 'En adopción')}
                >
                  <Text style={styles.actionPillText}>Marcar Adopción</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity 
              style={styles.deleteBtn} 
              onPress={() => onDelete(mascota.id)}
            >
              <Text style={styles.deleteBtnText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imagen: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tipoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  zonaText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  estadoAcciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  actionPill: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionPillText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 6,
  },
  deleteBtnText: {
    fontSize: 16,
  },
});