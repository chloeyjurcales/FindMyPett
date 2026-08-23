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

export default function DashboardScreen() {
  const router = useRouter();
  const posts = usePosts();

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
      {/* TOP HEADER PROFILE BANNER */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => router.push('/my-profile')}
            activeOpacity={0.8}
          >
            <Image source={klowieAvatar} style={styles.avatarPlaceholder} />
            <View style={styles.onlineStatusDot} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/my-profile')}
            activeOpacity={0.8}
          >
            <View style={styles.nameWrapper}>
              <Text style={styles.welcomeText}>Welcome!</Text>
              <Text style={styles.profileName}>Jurcales, Chloey Lyca</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.notificationBell}
          activeOpacity={0.8}
          onPress={() => router.push('/notifications')}
        >
          <Text style={{ fontSize: 18 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* RENDER BODY PANEL */}
      <ScrollView
        style={styles.feedScroll}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Placement Shield Row */}
        <View style={styles.brandPanel}>
          <View style={styles.miniLogoCircle}>
            <Text style={{ fontSize: 24 }}>🐾</Text>
          </View>
          <Text style={styles.locationText}>📍 Cebu, Philippines</Text>
        </View>

        {/* Create Post Interactive Bar */}
        <View style={styles.createPostCard}>
          <TouchableOpacity
            style={styles.photoUploadButton}
            onPress={handlePickImage}
          >
            <Text style={styles.photoButtonText}>🖼️ Photo</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>Post or Report a missing pet</Text>
        </View>

        {/* LOOP INCOMING POSTS */}
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <TouchableOpacity
                style={styles.postHeaderTouchable}
                activeOpacity={post.authorAvatar ? 0.7 : 1}
                disabled={!post.authorAvatar}
                onPress={() => router.push('/my-profile')}
              >
                {post.authorAvatar ? (
                  <Image
                    source={
                      typeof post.authorAvatar === 'string'
                        ? { uri: post.authorAvatar }
                        : post.authorAvatar
                    }
                    style={styles.postAvatar}
                  />
                ) : (
                  <View style={styles.postAvatar} />
                )}
                <View style={styles.postMeta}>
                  <Text style={styles.postAuthor}>{post.author}</Text>
                  <Text style={styles.postTime}>{post.location}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePostOptions}>
                <Text style={styles.threeDots}>⋮</Text>
              </TouchableOpacity>
            </View>

            {/* Content Image */}
            <Image source={{ uri: post.imageUrl }} style={styles.postImage} />

            {/* Description Text */}
            <Text style={styles.postBodyText}>{post.body}</Text>

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
        ))}
      </ScrollView>

      {/* CUSTOM DARK BROWN NAVIGATION BAR FOR FEED */}
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
          onPress={() => router.push('/(tabs)/explore')}
          activeOpacity={0.8}
        >
          <Text style={styles.barIcon}>💬</Text>
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
    backgroundColor: THEME.darkBrown,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9c6644',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  onlineStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00ff00',
    position: 'absolute',
    right: 2,
    top: 2,
    borderWidth: 2,
    borderColor: THEME.darkBrown,
  },
  nameWrapper: {
    justifyContent: 'center',
  },
  welcomeText: {
    color: '#ebd5c5',
    fontSize: 12,
    opacity: 0.9,
  },
  profileName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 2,
  },
  notificationBell: {
    backgroundColor: '#f5c469',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedScroll: {
    flex: 1,
    backgroundColor: THEME.lightBrown,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
  },
  brandPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  miniLogoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ebd5c5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  locationText: {
    color: '#331800',
    fontWeight: 'bold',
    marginLeft: 12,
    fontSize: 13,
  },
  createPostCard: {
    backgroundColor: '#ebd5c5',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  photoUploadButton: {
    backgroundColor: '#f2e3d5',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#bfa28f',
  },
  photoButtonText: {
    color: '#331800',
    fontWeight: '500',
  },
  helperText: {
    fontSize: 10,
    color: '#6e4c31',
    marginTop: 6,
  },
  postCard: {
    backgroundColor: '#ebd5c5',
    marginHorizontal: 16,
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
  postHeaderTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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

  /* UPDATED BOTTOM BAR STYLES */
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