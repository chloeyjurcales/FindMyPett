import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const lance = require('../assets/images/lance.png');
const yuji = require('../assets/images/yuji.png');
const nadith = require('../assets/images/nadith.png');

const THEME = {
  darkBrown: '#5c2d06',
  lightBrown: '#d8b69f',
  cardBackground: '#ebd5c5',
  emptyCardBg: '#c3a28c',
};

// Mock data matching your user profiles
const PROFILES_DATA: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Nadith Marie',
    avatar: nadith,
    hasPosts: false,
  },
  '2': {
    id: '2',
    name: 'Cluwe Yuji',
    avatar: yuji,
    hasPosts: false,
  },
  '3': {
    id: '3',
    name: 'Lance Fernandez',
    avatar: lance,
    hasPosts: false,
  },
  '4': {
    id: '4',
    name: 'Rachel Suson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    hasPosts: false,
  },
  '5': {
    id: '5',
    name: 'Junrel Alipogpog',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    hasPosts: true,
    location: 'Banban, Bogo, Cebu • 3 hours ago',
    postImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
    likes: 21,
    views: 30,
  },
};

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Default to Nadith Marie ('1') if no profile ID is passed
  const profileId = (params.userId as string) || '1';
  const profile = PROFILES_DATA[profileId] || PROFILES_DATA['1'];

  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(profile.likes || 0);

  const handleToggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleMessagePress = () => {
    // Navigate to Explore/Chat tab and open this specific chat
    router.push({
      pathname: '/explore',
      params: { openChatId: profile.id },
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER & BACKGROUND */}
      <View style={styles.topSection}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* POLKA DOT / PAW PRINT ACCENTS */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        </View>
      </View>

      {/* PROFILE CONTENT CARD */}
      <View style={styles.profileCard}>
        <Text style={styles.profileName}>{profile.name}</Text>

        {/* MESSAGE BUTTON */}
        <TouchableOpacity
          style={styles.messageBtn}
          onPress={handleMessagePress}
          activeOpacity={0.8}
        >
          <Text style={styles.messageBtnText}>Message</Text>
        </TouchableOpacity>

        {/* POSTS AREA */}
        <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
          {profile.hasPosts ? (
            <View style={styles.postCard}>
              <Text style={styles.allPostsTitle}>All posts</Text>

              <View style={styles.postHeader}>
                <Image source={{ uri: profile.avatar }} style={styles.postAvatar} />
                <View>
                  <Text style={styles.postAuthor}>{profile.name}</Text>
                  <Text style={styles.postMeta}>{profile.location}</Text>
                </View>
              </View>

              <Image source={{ uri: profile.postImage }} style={styles.postImage} />

              <View style={styles.postStats}>
                <Text style={styles.statText}>❤️ {likeCount}</Text>
                <Text style={styles.statText}>👁️ {profile.views}</Text>
              </View>

              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleToggleLike}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.actionText, liked && styles.actionTextLiked]}>
                    {liked ? '❤️ Liked' : '👍 Like'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/comments',
                      params: { postId: profile.id, likes: String(likeCount) },
                    })
                  }
                >
                  <Text style={styles.actionText}>💬 Comment</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.noPostsCard}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
                }}
                style={styles.noPostsIcon}
              />
              <Text style={styles.noPostsText}>No posts available.</Text>
            </View>
          )}
        </ScrollView>
      </View>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.darkBrown,
    paddingTop: 35,
  },
  topSection: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    top: 15,
  },
  backArrow: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#ffffff',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileCard: {
    flex: 1,
    backgroundColor: THEME.lightBrown,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#331800',
    textAlign: 'center',
    marginBottom: 10,
  },
  messageBtn: {
    backgroundColor: THEME.cardBackground,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c3a28c',
    marginBottom: 15,
  },
  messageBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#331800',
  },
  postsContainer: {
    flex: 1,
  },
  allPostsTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#331800',
    marginBottom: 8,
  },
  noPostsCard: {
    backgroundColor: THEME.cardBackground,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  noPostsIcon: {
    width: 90,
    height: 90,
    marginBottom: 12,
    opacity: 0.7,
  },
  noPostsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5c2d06',
  },
  postCard: {
    backgroundColor: THEME.cardBackground,
    borderRadius: 16,
    padding: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  postAuthor: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#331800',
  },
  postMeta: {
    fontSize: 10,
    color: '#6e4c31',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  postStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statText: {
    fontSize: 11,
    color: '#6e4c31',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0.5,
    borderColor: '#bfa28f',
    paddingTop: 8,
  },
  actionBtn: {
    padding: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a2c11',
  },
  actionTextLiked: {
    color: '#d32f2f',
  },
  customBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: THEME.darkBrown,
    height: 70,
  },
  barButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: THEME.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barIcon: {
    fontSize: 22,
  },
});