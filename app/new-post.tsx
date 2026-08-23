import { addPost } from '@/store/posts-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const klowieAvatar = require('@/assets/images/klowe.png');

const THEME = {
  darkBrown: '#5c2d06',
  lightBrown: '#d8b69f',
  cardBackground: '#ebd5c5',
};

export default function NewPostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const imageUri = params.imageUri as string | undefined;
  const [caption, setCaption] = useState('');

  const handlePost = () => {
    if (!imageUri) {
      Alert.alert('No photo selected', 'Please choose a photo before posting.');
      return;
    }

    addPost({ imageUri, caption: caption.trim() });
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New post</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* USER ROW */}
        <View style={styles.userRow}>
          <TouchableOpacity onPress={() => router.push('/my-profile')} activeOpacity={0.8}>
            <Image source={klowieAvatar} style={styles.userAvatar} />
          </TouchableOpacity>
          <Text style={styles.userName}>Jurcales, Chloey Lyca</Text>
        </View>

        {/* BRAND PANEL */}
        <View style={styles.brandPanel}>
          <View style={styles.brandBadge}>
            <Text style={{ fontSize: 30 }}>🐾</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>FindMyPetApp</Text>
            <Text style={styles.brandLocation}>📍 Cebu, Philippines</Text>
          </View>
        </View>

        {/* COMPOSER CARD */}
        <ScrollView
          style={styles.composerCard}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            style={styles.captionInput}
            placeholder="Write something here..."
            placeholderTextColor="#7c5d43"
            value={caption}
            onChangeText={setCaption}
            multiline
          />

          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.noImagePlaceholder}>
              <Text style={styles.noImageText}>No photo selected</Text>
            </View>
          )}

          <TouchableOpacity style={styles.postButton} onPress={handlePost} activeOpacity={0.8}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* BOTTOM NAV BAR */}
        <View style={styles.customBottomBar}>
          <TouchableOpacity style={styles.barButton} onPress={() => router.replace('/')}>
            <Text style={styles.barIcon}>🚪</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.barButton} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.barIcon}>🏠</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.darkBrown,
    paddingTop: 35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeBtn: {
    width: 26,
  },
  closeIcon: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#9c6644',
    borderWidth: 1.5,
    borderColor: '#ffffff',
    marginRight: 10,
  },
  userName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  brandPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  brandBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: THEME.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  brandTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  brandLocation: {
    color: '#ebd5c5',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  composerCard: {
    flex: 1,
    backgroundColor: THEME.lightBrown,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  captionInput: {
    backgroundColor: THEME.cardBackground,
    borderBottomWidth: 1.5,
    borderColor: '#7d4a25',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: '#331800',
    borderRadius: 10,
    marginBottom: 16,
    minHeight: 44,
  },
  previewImage: {
    width: '100%',
    height: 340,
    borderRadius: 16,
    marginBottom: 20,
  },
  noImagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: THEME.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bfa28f',
    borderStyle: 'dashed',
  },
  noImageText: {
    color: '#6e4c31',
    fontSize: 13,
  },
  postButton: {
    backgroundColor: THEME.darkBrown,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: THEME.darkBrown,
    height: 75,
    paddingBottom: 8,
  },
  barButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barIcon: {
    fontSize: 24,
  },
});