import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Mascota, EstadoMascota, TipoMascota } from '../types/mascota';

type Props = {
  usuarioActualId: string;
  onAddMascota: (mascota: Mascota) => void;
  onCancel: () => void;
};

export default function MascotaForm({ usuarioActualId, onAddMascota, onCancel }: Props) {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<TipoMascota>('Perro');
  const [estado, setEstado] = useState<EstadoMascota>('Perdido');
  const [zona, setZona] = useState('');
  const [contacto, setContacto] = useState('');
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const pickImageFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permiso requerido', 'Se necesitan permisos para acceder a la galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImagen(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      Alert.alert('Error', 'No se pudo cargar la imagen de la galería.');
    }
  };

  const takePhotoWithCamera = async () => {
      try {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        
        if (!permissionResult.granted) {
          Alert.alert('Permiso requerido', 'Se necesitan permisos para utilizar la cámara.');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.4,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          setImagen(result.assets[0].uri);
        }
      } catch (error) {
        console.error('Error al tomar la foto:', error);
        Alert.alert('Error', 'No se pudo capturar la fotografía.');
      }
    };

  const getLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requiere permiso de ubicación para usar el GPS.');
        setLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const calle = address.street || address.name || 'Ubicación actual';
        const numero = address.streetNumber ? ` ${address.streetNumber}` : '';
        const ciudad = address.subregion || address.city || '';
        
        const direccionAmigable = `${calle}${numero}${ciudad ? `, ${ciudad}` : ''}`;
        setZona(direccionAmigable);
        Alert.alert('¡Ubicación detectada!', `Zona cargada: ${direccionAmigable}`);
      } else {
        setZona(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
        Alert.alert('¡Ubicación obtenida!', 'Se cargaron las coordenadas GPS.');
      }
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener la dirección exacta.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = () => {
    if (!titulo || !zona || !contacto) {
      Alert.alert('Campos incompletos', 'Por favor completa el título, la zona y el contacto.');
      return;
    }

    if (!imagen) {
      Alert.alert('Imagen requerida', 'Debes adjuntar o tomar una fotografía para publicar el reporte.');
      return;
    }

    const nuevaMascota: Mascota = {
      id: Date.now().toString(),
      titulo,
      tipo,
      estado,
      zona,
      contacto,
      imagen,
      descripcion,
      fecha: new Date().toLocaleDateString(),
      autorId: usuarioActualId,
    };

    onAddMascota(nuevaMascota);
  };

  return (
    <ScrollView style={styles.formContainer} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.formTitle}>Nuevo Reporte</Text>
      <Text style={styles.formSubtitle}>Completa los datos, adjunta una foto y ubica el reporte</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Título del aviso</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej: Poodle marrón perdido en Palermo" 
          placeholderTextColor="#94a3b8"
          value={titulo} 
          onChangeText={setTitulo} 
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tipo de animal</Text>
        <View style={styles.optionsRow}>
          {(['Perro', 'Gato', 'Otro'] as TipoMascota[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.optionChip, tipo === t && styles.optionChipActive]}
              onPress={() => setTipo(t)}
            >
              <Text style={[styles.optionText, tipo === t && styles.optionTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Estado del reporte</Text>
        <View style={styles.optionsRow}>
          {(['Perdido', 'Encontrado', 'En adopción'] as EstadoMascota[]).map((e) => (
            <TouchableOpacity
              key={e}
              style={[styles.optionChip, estado === e && styles.optionChipActive]}
              onPress={() => setEstado(e)}
            >
              <Text style={[styles.optionText, estado === e && styles.optionTextActive]}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Zona / Barrio (o usa GPS)</Text>
        <View style={styles.zonaRow}>
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            placeholder="Ej: Belgrano, CABA" 
            placeholderTextColor="#94a3b8"
            value={zona} 
            onChangeText={setZona} 
          />
          <TouchableOpacity style={styles.gpsBtn} onPress={getLocation} disabled={loadingLocation}>
            <Text style={styles.gpsBtnText}>{loadingLocation ? '...' : '📍 GPS'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contacto (Teléfono o Redes)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej: 11 2345-6789" 
          placeholderTextColor="#94a3b8"
          value={contacto} 
          onChangeText={setContacto} 
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fotografía del animal (Obligatorio)</Text>
        
        <View style={styles.imageButtonsRow}>
          <TouchableOpacity style={[styles.imagePickerBtn, { flex: 1 }]} onPress={takePhotoWithCamera}>
            <Text style={styles.imagePickerBtnText}>📸 Abrir Cámara</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.imagePickerBtn, { flex: 1 }]} onPress={pickImageFromGallery}>
            <Text style={styles.imagePickerBtnText}>🖼️ Galería</Text>
          </TouchableOpacity>
        </View>

        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.previewImage} />
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descripción (Opcional)</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Detalles de collar, señas particulares..." 
          placeholderTextColor="#94a3b8"
          value={descripcion} 
          onChangeText={setDescripcion} 
          multiline
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Publicar Reporte</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  optionChipActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  optionText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  zonaRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  gpsBtn: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  imageButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  imagePickerBtn: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  imagePickerBtnText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 6,
    marginTop: 10,
    resizeMode: 'cover',
  },
  buttonContainer: {
    marginTop: 8,
    gap: 8,
  },
  submitBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelBtn: {
    paddingVertical: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  cancelText: {
    color: '#64748b',
    fontWeight: '500',
    fontSize: 13,
  },
});