import {
  addComment,
  getPostById,
  toggleLike,
  useComments,
  usePosts,
} from '@/store/posts-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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

const THEME = {
  darkBrown: '#5c2d06',
  lightBrown: '#d8b69f',
  cardBackground: '#ebd5c5',
};

export default function CommentsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const postId = (params.postId as string) || '1';

  // Subscribing to posts keeps the like count here in sync with the feed.
  const posts = usePosts();
  const post = posts.find((p) => p.id === postId) || getPostById(postId);

  const comments = useComments(postId);
  const [inputText, setInputText] = useState('');

  const handleToggleLike = () => {
    toggleLike(postId);
  };

  const handlePostComment = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    addComment(postId, trimmed);
    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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

          <TouchableOpacity
            style={styles.likeRow}
            onPress={handleToggleLike}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 20 }}>{post?.liked ? '❤️' : '🤍'}</Text>
            <Text style={styles.likeCount}>{post?.likes ?? 0}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* COMMENT LIST */}
          {comments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No comments yet. Be the first to comment!
              </Text>
            </View>
          ) : (
            comments.map((c) => (
              <View key={c.id} style={styles.commentRow}>
                <Image
                  source={
                    typeof c.avatar === 'string' ? { uri: c.avatar } : c.avatar
                  }
                  style={styles.avatar}
                />
                <View style={styles.commentBubble}>
                  <Text style={styles.commentName}>{c.name}</Text>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </View>
            ))
          )}

          {/* DECORATIVE PET AREA */}
          <View style={styles.decorativeArea}>
            <View style={styles.bellBubble}>
              <Text style={{ fontSize: 16 }}>🔔</Text>
            </View>
            <Text style={styles.dogIllustration}>🐶</Text>

            <View style={styles.pawRow}>
              <Text style={[styles.pawIcon, { opacity: 0.35 }]}>🐾</Text>
              <Text style={[styles.pawIcon, { opacity: 0.35 }]}>🐾</Text>
              <Text style={[styles.pawIcon, { opacity: 0.7 }]}>🐾</Text>
              <Text style={[styles.pawIcon, { opacity: 0.7 }]}>🐾</Text>
            </View>
          </View>
        </ScrollView>

        {/* COMMENT INPUT BAR */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor="#7c5d43"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handlePostComment}
            returnKeyType="send"
          />
          {inputText.trim().length > 0 && (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handlePostComment}
              activeOpacity={0.8}
            >
              <Text style={styles.sendButtonIcon}>➤</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.lightBrown,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: {
    padding: 4,
  },
  backArrow: {
    color: '#221000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#221000',
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    marginTop: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 12,
    color: '#6e4c31',
  },
  commentRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: THEME.darkBrown,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: THEME.darkBrown,
    borderRadius: 16,
    padding: 14,
  },
  commentName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 6,
  },
  commentText: {
    color: '#f2e3d5',
    fontSize: 13,
    lineHeight: 19,
  },
  decorativeArea: {
    marginTop: 30,
    alignItems: 'center',
  },
  bellBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3c7b3',
    borderWidth: 1.5,
    borderColor: '#bfa28f',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dogIllustration: {
    fontSize: 110,
  },
  pawRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 20,
  },
  pawIcon: {
    fontSize: 34,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.lightBrown,
  },
  commentInput: {
    flex: 1,
    backgroundColor: THEME.cardBackground,
    borderWidth: 1.5,
    borderColor: '#7d4a25',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 13,
    color: '#331800',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.darkBrown,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonIcon: {
    color: '#ffffff',
    fontSize: 16,
  },
});