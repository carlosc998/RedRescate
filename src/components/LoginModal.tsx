import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, ScrollView } from 'react-native';
import { Usuario } from '../types/usuario';
import { INITIAL_USUARIOS } from '../utils/mockUsuarios';

type Props = {
  visible: boolean;
  usuarioActual: Usuario | null;
  onSelectUsuario: (usuario: Usuario) => void;
  onLogout: () => void;
  onClose: () => void;
};

export default function LoginModal({ visible, usuarioActual, onSelectUsuario, onLogout, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>👤 Simulación de Usuarios</Text>
          <Text style={styles.modalSubtitle}>
            Selecciona una cuenta para probar los permisos de autoría (crear, editar y eliminar solo lo propio):
          </Text>

          {usuarioActual && (
            <View style={styles.currentSessionBox}>
              <Text style={styles.currentLabel}>Sesión activa actual:</Text>
              <Text style={styles.currentName}>✨ {usuarioActual.nombre} ({usuarioActual.email})</Text>
              <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.sectionTitle}>Cambiar a otro usuario de prueba:</Text>
          <ScrollView style={styles.userList}>
            {INITIAL_USUARIOS.map((u) => (
              <TouchableOpacity 
                key={u.id} 
                style={[styles.userCard, usuarioActual?.id === u.id && styles.userCardActive]}
                onPress={() => {
                  onSelectUsuario(u);
                  onClose();
                }}
              >
                <Image source={{ uri: u.avatar }} style={styles.avatar} />
                <View>
                  <Text style={styles.userName}>{u.nombre}</Text>
                  <Text style={styles.userEmail}>{u.email}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Volver a la App</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  currentSessionBox: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  currentLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  currentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginVertical: 4,
  },
  logoutBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  logoutBtnText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  userList: {
    maxHeight: 220,
    marginBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  userCardActive: {
    borderColor: '#0f172a',
    backgroundColor: '#f1f5f9',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
  },
  closeBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});