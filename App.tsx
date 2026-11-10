import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Alert, TouchableOpacity, Modal } from 'react-native';
import { Mascota, EstadoMascota } from './src/types/mascota';
import { INITIAL_MASCOTAS } from './src/utils/mockMascotas';
import MascotaCard from './src/components/MascotaCard';
import MascotaForm from './src/components/MascotaForm';

export default function App() {
  const [mascotas, setMascotas] = useState<Mascota[]>(INITIAL_MASCOTAS);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<EstadoMascota | 'Todos'>('Todos');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);

  const handlePressMascota = (mascota: Mascota) => {
    Alert.alert(
      mascota.titulo,
      `${mascota.descripcion || 'Sin descripción'}\n\nZona: ${mascota.zona}\nContacto: ${mascota.contacto}`
    );
  };

  const handleAddMascota = (nuevaMascota: Mascota) => {
    setMascotas([nuevaMascota, ...mascotas]);
    setMostrarFormulario(false);
  };

  const handleUpdateEstado = (id: string, nuevoEstado: EstadoMascota) => {
    setMascotas(
      mascotas.map((m) => (m.id === id ? { ...m, estado: nuevoEstado } : m))
    );
  };

  const handleDeleteMascota = (id: string) => {
    setMascotas((prevMascotas) => {
      const actualizadas = prevMascotas.filter((m) => String(m.id) !== String(id));
      return actualizadas;
    });
  };

  const mascotasFiltradas = filtroSeleccionado === 'Todos'
    ? mascotas
    : mascotas.filter(m => m.estado === filtroSeleccionado);

  const filtros: { label: string; value: EstadoMascota | 'Todos' }[] = [
    { label: 'Todos', value: 'Todos' },
    { label: '🔴 Perdidos', value: 'Perdido' },
    { label: '🟢 Encontrados', value: 'Encontrado' },
    { label: '🔵 Adopción', value: 'En adopción' },
  ];

  const totalPerdidos = mascotas.filter(m => m.estado === 'Perdido').length;
  const totalEncontrados = mascotas.filter(m => m.estado === 'Encontrado').length;
  const totalAdopcion = mascotas.filter(m => m.estado === 'En adopción').length;
  const totalPerros = mascotas.filter(m => m.tipo === 'Perro').length;
  const totalGatos = mascotas.filter(m => m.tipo === 'Gato').length;
  const totalOtros = mascotas.filter(m => m.tipo === 'Otro').length;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER REDISEÑADO CON ESTILO NATIVO MODERNO */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <View style={styles.badgeBrand}>
              <Text style={styles.badgeBrandText}>COMUNIDAD ACTIVA</Text>
            </View>
            <Text style={styles.titulo}>Red Rescate 🐾</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.menuBtn} 
            onPress={() => setMenuVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Subtítulo dinámico con conteo */}
        <Text style={styles.subtitulo}>
          {mascotas.length} reportes disponibles en la red
        </Text>

        {/* FILTROS EN FORMATO PÍLDORA (CHIPS) MÁS FLUIDOS */}
        {!mostrarFormulario && (
          <View style={styles.filtrosContainer}>
            {filtros.map((filtro) => {
              const isActive = filtroSeleccionado === filtro.value;
              return (
                <TouchableOpacity
                  key={filtro.value}
                  style={[styles.filtroChip, isActive && styles.filtroChipActivo]}
                  onPress={() => setFiltroSeleccionado(filtro.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filtroTexto, isActive && styles.filtroTextoActivo]}>
                    {filtro.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* CUERPO DE LA APLICACIÓN */}
      {mostrarFormulario ? (
        <View style={styles.bodyContainer}>
          <MascotaForm 
            onAddMascota={handleAddMascota} 
            onCancel={() => setMostrarFormulario(false)} 
          />
        </View>
      ) : (
        <FlatList
          data={mascotasFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MascotaCard 
              mascota={item} 
              onPress={handlePressMascota} 
              onDelete={handleDeleteMascota} 
              onUpdateEstado={handleUpdateEstado}
            />
          )}
          contentContainerStyle={styles.lista}
        />
      )}

      {/* MODAL MENÚ HAMBURGUESA */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menú de Navegación</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.drawerBody}>
              <TouchableOpacity 
                style={styles.drawerItem} 
                onPress={() => {
                  setMostrarFormulario(false);
                  setFiltroSeleccionado('Todos');
                  setMenuVisible(false);
                }}
              >
                <Text style={styles.drawerItemText}>🏠 Inicio / Ver Todos</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.drawerItem} 
                onPress={() => {
                  setMostrarFormulario(true);
                  setMenuVisible(false);
                }}
              >
                <Text style={styles.drawerItemText}>➕ Publicar Nuevo Reporte</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.drawerItem} 
                onPress={() => {
                  setMenuVisible(false);
                  setModalInfoVisible(true);
                }}
              >
                <Text style={styles.drawerItemText}>📊 Estadísticas de la Red</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.drawerFooter}>
              <Text style={styles.drawerFooterText}>Red Rescate TFI - 2026</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL ESTADÍSTICAS */}
      <Modal
        visible={modalInfoVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalInfoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalContent}>
            <Text style={styles.infoModalTitle}>📊 Panel de Estadísticas</Text>
            
            <Text style={styles.sectionSubtitle}>Por Estado</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>🔴 Perdidos:</Text>
              <Text style={[styles.statValue, { color: '#b91c1c' }]}>{totalPerdidos}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>🟢 Encontrados:</Text>
              <Text style={[styles.statValue, { color: '#15803d' }]}>{totalEncontrados}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>🔵 En adopción:</Text>
              <Text style={[styles.statValue, { color: '#1d4ed8' }]}>{totalAdopcion}</Text>
            </View>

            <Text style={[styles.sectionSubtitle, { marginTop: 16 }]}>Por Tipo de Animal</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>🐶 Perros:</Text>
              <Text style={styles.statValue}>{totalPerros}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>🐱 Gatos:</Text>
              <Text style={styles.statValue}>{totalGatos}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>🐾 Otros:</Text>
              <Text style={styles.statValue}>{totalOtros}</Text>
            </View>

            <TouchableOpacity 
              style={styles.infoCloseBtn} 
              onPress={() => setModalInfoVisible(false)}
            >
              <Text style={styles.infoCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  header: { 
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e2e8f0',
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  badgeBrand: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeBrandText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.8,
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitulo: { 
    fontSize: 13, 
    color: '#64748b', 
    marginBottom: 16,
    fontWeight: '500',
  },
  menuBtn: {
    backgroundColor: '#f8fafc',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  menuIcon: {
    fontSize: 18,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  filtrosContainer: { 
    flexDirection: 'row', 
    gap: 8, 
  },
  filtroChip: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, // Estilo píldora moderna
    backgroundColor: '#f8fafc', 
    borderWidth: 1, 
    borderColor: '#cbd5e1' 
  },
  filtroChipActivo: { 
    backgroundColor: '#0f172a', 
    borderColor: '#0f172a' 
  },
  filtroTexto: { 
    fontSize: 12, 
    color: '#334155', 
    fontWeight: '600', 
  },
  filtroTextoActivo: { 
    color: '#ffffff',
  },
  bodyContainer: { 
    padding: 16, 
    flex: 1 
  },
  lista: { 
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  drawerContainer: {
    width: '75%',
    height: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 16,
    marginTop: 20,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: 'bold',
  },
  drawerBody: {
    flex: 1,
    paddingVertical: 20,
    gap: 12,
  },
  drawerItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  drawerItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    alignItems: 'center',
  },
  drawerFooterText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  infoModalContent: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignSelf: 'center',
    marginTop: '25%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statLabel: {
    fontSize: 13,
    color: '#334155',
  },
  statValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  infoCloseBtn: {
    marginTop: 20,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  infoCloseText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
});