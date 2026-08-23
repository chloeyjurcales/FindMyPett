import { toggleLike, usePosts } from '@/store/posts-store';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const klowieAvatar = require('@/assets/images/klowe.png');

const THEME = {
  darkBrown: '#5c2d06',
  lightBrown: '#d8b69f',
  cardBackground: '#ebd5c5',
};

export default function MyProfileScreen() {
  const router = useRouter();
  const posts = usePosts();

  // Only show posts authored by Chloey (posts created through the app).
  const myPosts = posts.filter((p) => p.authorAvatar);

  const handleToggleLike = (postId: string) => {
    toggleLike(postId);
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow photo library access to add a photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      router.push({
        pathname: '/new-post',
        params: { imageUri: result.assets[0].uri },
      });
    }
  };

  const handlePostOptions = () => {
    Alert.alert('Post options', undefined, [
      {
        text: 'Report post',
        style: 'destructive',
        onPress: () => Alert.alert('Reported', "Thanks, we'll take a look."),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleShare = async (body: string, author: string) => {
    try {
      await Share.share({
        message: `${author} on FindMyPetApp: ${body}`,
      });
    } catch {
      // Share sheet dismissed or unavailable — nothing to do.
    }
  };

  return (
    <View style={styles.container}>
      {/* SCROLLABLE CONTENT (header + posts scroll together, nav bar stays fixed) */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationBell}
            activeOpacity={0.8}
            onPress={() => router.push('/notifications')}
          >
            <Text style={{ fontSize: 18 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* AVATAR + NAME SECTION */}
        <View style={styles.avatarSection}>
          <View
            style={[
              styles.decorDot,
              { top: 4, left: 26, width: 8, height: 8 },
            ]}
          />
          <View
            style={[styles.decorDot, { top: 28, left: 8, width: 6, height: 6 }]}
          />
          <View
            style={[
              styles.decorDot,
              { top: 4, right: 26, width: 8, height: 8 },
            ]}
          />
          <View
            style={[
              styles.decorDot,
              { top: 28, right: 8, width: 6, height: 6 },
            ]}
          />
          <View
            style={[
              styles.decorDot,
              { bottom: 6, left: 20, width: 6, height: 6 },
            ]}
          />
          <View
            style={[
              styles.decorDot,
              { bottom: 6, right: 20, width: 6, height: 6 },
            ]}
          />
          <Text style={[styles.pawDecor, { left: 6, top: 46 }]}>🐾</Text>
          <Text style={[styles.pawDecor, { right: 6, top: 46 }]}>🐾</Text>
          <Text style={[styles.pawDecor, { left: 30, bottom: -4 }]}>🐾</Text>
          <Text style={[styles.pawDecor, { right: 30, bottom: -4 }]}>🐾</Text>

          <View style={styles.avatarRing}>
            <Image source={klowieAvatar} style={styles.avatarImage} />
            <View style={styles.onlineDot} />
          </View>

          <Text style={styles.nameText}>Jurcales, Chloey Lyca</Text>
        </View>

        {/* BODY PANEL */}
        <View style={styles.bodyPanel}>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={handlePickImage}
            activeOpacity={0.8}
          >
            <Text style={styles.photoButtonText}>🖼️ Photo</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>Post or Report a missing pet</Text>

          <View style={styles.sectionDivider} />
          <Text style={styles.allPostsTitle}>All posts</Text>

          {myPosts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                You haven't posted anything yet. Tap Photo to create your first
                post.
              </Text>
            </View>
          ) : (
            myPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <Image
                    source={
                      typeof post.authorAvatar === 'string'
                        ? { uri: post.authorAvatar }
                        : post.authorAvatar
                    }
                    style={styles.postAvatar}
                  />
                  <View style={styles.postMeta}>
                    <Text style={styles.postAuthor}>{post.author}</Text>
                    <Text style={styles.postTime}>{post.location}</Text>
                  </View>
                  <TouchableOpacity onPress={handlePostOptions}>
                    <Text style={styles.threeDots}>⋮</Text>
                  </TouchableOpacity>
                </View>

                {/* Content Image */}
                <Image
                  source={{ uri: post.imageUrl }}
                  style={styles.postImage}
                />

                {/* Description Text */}
                {!!post.body && (
                  <Text style={styles.postBodyText}>{post.body}</Text>
                )}

                {/* Engagement Metrics */}
                <View style={styles.metricsRow}>
                  <Text style={styles.metricItem}>❤️ {post.likes}</Text>
                  <Text style={styles.metricItem}>👁️ {post.views}</Text>
                </View>

                <View style={styles.divider} />

                {/* Action Bar */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleToggleLike(post.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        post.liked && styles.actionTextLiked,
                      ]}
                    >
                      {post.liked ? '❤️ Liked' : '🤍 Like'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      router.push({
                        pathname: '/comments',
                        params: { postId: post.id },
                      })
                    }
                  >
                    <Text style={styles.actionText}>💬 Comment</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleShare(post.body, post.author)}
                  >
                    <Text style={styles.actionText}>➡️ Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* BOTTOM NAV BAR (stays fixed, outside the scroll area) */}
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
  scrollArea: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  iconBtn: {
    padding: 4,
  },
  backArrow: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationBell: {
    backgroundColor: '#f5c469',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
    position: 'relative',
  },
  decorDot: {
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: '#c9a68c',
    opacity: 0.6,
  },
  pawDecor: {
    position: 'absolute',
    fontSize: 16,
    opacity: 0.5,
  },
  avatarRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: THEME.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarImage: {
    width: 124,
    height: 124,
    borderRadius: 62,
  },
  onlineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#00e600',
    position: 'absolute',
    right: 6,
    top: 6,
    borderWidth: 2.5,
    borderColor: THEME.darkBrown,
  },
  nameText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 17,
    marginTop: 14,
  },
  bodyPanel: {
    flex: 1,
    backgroundColor: THEME.lightBrown,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  photoButton: {
    backgroundColor: THEME.cardBackground,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#bfa28f',
  },
  photoButtonText: {
    color: '#331800',
    fontWeight: '500',
    fontSize: 14,
  },
  helperText: {
    fontSize: 11,
    color: '#4a2c11',
    textAlign: 'center',
    marginTop: 8,
  },
  sectionDivider: {
    height: 0.5,
    backgroundColor: '#9c7c62',
    marginTop: 14,
    marginBottom: 12,
  },
  allPostsTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#221000',
    marginBottom: 10,
  },
  emptyState: {
    backgroundColor: THEME.cardBackground,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyStateText: {
    fontSize: 13,
    color: '#5c3a21',
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: THEME.cardBackground,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#cdb4a4',
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
    backgroundColor: '#5c2d06',
  },
  postMeta: {
    flex: 1,
    marginLeft: 10,
  },
  postAuthor: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#331800',
  },
  postTime: {
    fontSize: 10,
    color: '#7c5d43',
  },
  threeDots: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#331800',
    paddingHorizontal: 6,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  postBodyText: {
    fontSize: 12,
    color: '#4a2c11',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  metricItem: {
    fontSize: 11,
    color: '#7c5d43',
    marginRight: 15,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#bfa28f',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#5c2d06',
    fontWeight: '500',
  },
  actionTextLiked: {
    color: '#d32f2f',
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