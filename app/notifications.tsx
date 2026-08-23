import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const THEME = {
  darkBrown: '#5c2d06',
  lightBrown: '#d8b69f',
  cardBackground: '#ebd5c5',
  gold: '#f5c469',
};

// Local image imports
const lance = require('../assets/images/lance.png');
const yuji = require('../assets/images/yuji.png');
const nadith = require('../assets/images/nadith.png');

type NotificationItem = {
  id: string;
  avatar: any;
  names: string[];
  postTitle: string;
};

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    avatar: nadith,
    names: ['Nadith Marie'],
    postTitle: 'Our dog went Missing',
  },
  {
    id: '2',
    avatar: lance,
    names: ['Rachel Suson', 'Lance Fernandez'],
    postTitle: 'Nawagtang akong iring',
  },
  {
    id: '3',
    avatar: yuji,
    names: ['Cluwe Yuji', 'Lance Fernandez'],
    postTitle: 'Our dog went Missing',
  },
];

const PAW_DECORATIONS = [
  '🐾',
  '❤️',
  '🐾',
  '🐾',
  '❤️',
  '🐾',
  '🐾',
  '❤️',
  '🐾',
  '❤️',
  '🐾',
  '🐾',
  '❤️',
  '🐾',
  '🐾',
  '❤️',
  '🐾',
  '🐾',
];

const PET_FACES = ['🐕', '🐈', '🐺', '🐱', '🐩', '🐈‍⬛', '🐕‍🦺'];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <View style={styles.goldDot} />
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        {/* Spacer to keep title centered */}
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* NOTIFICATION LIST */}
        {NOTIFICATIONS.map((n) => (
          <View key={n.id} style={styles.notifCard}>
            {/* FIXED: local require() image */}
            <Image source={n.avatar} style={styles.avatar} />

            <Text style={styles.notifText}>
              <Text style={styles.boldName}>{n.names[0]}</Text>

              {n.names[1] && (
                <>
                  <Text style={styles.normalText}> and </Text>
                  <Text style={styles.boldName}>{n.names[1]}</Text>
                </>
              )}

              <Text style={styles.normalText}>
                {' commented on your post '}
              </Text>

              <Text style={styles.normalText}>
                "{n.postTitle}".
              </Text>
            </Text>
          </View>
        ))}

        {/* DECORATIVE PAW / HEART BACKGROUND PANEL */}
        <View style={styles.decorativeArea}>
          <View style={styles.pawGrid}>
            {PAW_DECORATIONS.map((icon, i) => (
              <Text key={i} style={styles.pawIcon}>
                {icon}
              </Text>
            ))}
          </View>

          {/* THOUGHT BUBBLE */}
          <View style={styles.bubbleWrap}>
            <View style={styles.thoughtBubble}>
              <Text style={styles.boneIcon}>🦴</Text>
            </View>

            <View style={styles.bubbleDotMed} />
            <View style={styles.bubbleDotSmall} />
          </View>

          {/* PET FACES */}
          <View style={styles.petRow}>
            {PET_FACES.map((face, i) => (
              <Text key={i} style={styles.petFace}>
                {face}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM NAV BAR */}
      <View style={styles.customBottomBar}>
        <TouchableOpacity
          style={styles.barButton}
          onPress={() => router.replace('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.barIcon}>🚪</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.barButton}
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.8}
        >
          <Text style={styles.barIcon}>🏠</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingVertical: 14,
  },
  backBtn: {
    width: 26,
    alignItems: 'flex-start',
  },
  backArrow: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 26,
  },
  goldDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: THEME.gold,
    marginRight: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    backgroundColor: THEME.lightBrown,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBackground,
    marginHorizontal: 14,
    marginTop: 10,
    padding: 14,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: '#c3a28c',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: THEME.darkBrown,
  },
  notifText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  boldName: {
    fontWeight: 'bold',
    color: '#221000',
  },
  normalText: {
    color: '#331800',
  },
  decorativeArea: {
    marginTop: 16,
    minHeight: 320,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  pawGrid: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    bottom: 60,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    opacity: 0.35,
    paddingHorizontal: 20,
  },
  pawIcon: {
    fontSize: 26,
    margin: 8,
  },
  bubbleWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  thoughtBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#e3c7b3',
    borderWidth: 1.5,
    borderColor: '#bfa28f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boneIcon: {
    fontSize: 20,
  },
  bubbleDotMed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e3c7b3',
    borderWidth: 1.5,
    borderColor: '#bfa28f',
    marginTop: 4,
  },
  bubbleDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#e3c7b3',
    borderWidth: 1,
    borderColor: '#bfa28f',
    marginTop: 3,
  },
  petRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    backgroundColor: '#c3a28c',
    paddingVertical: 10,
  },
  petFace: {
    fontSize: 30,
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