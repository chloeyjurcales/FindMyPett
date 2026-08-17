import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';

// Local Theme Colors definition
const THEME = {
  darkBrown: '#5c2d06',
  lightBrown: '#d8b69f',
  cardBackground: '#ebd5c5',
};

// Mock Data
const MOCK_POSTS = [
  {
    id: 1,
    author: 'Junrel Alipogpog',
    location: 'Banban, Bogo, Cebu • 3 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
    likes: 21,
    comments: 30,
    body: 'Our dog went missing'
  }
];

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* TOP HEADER PROFILE BANNER */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder} />
            <View style={styles.onlineStatusDot} />
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.profileName}>Jurcales, Chloey Lyca</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBell}>
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
          <TouchableOpacity style={styles.photoUploadButton}>
            <Text style={styles.photoButtonText}>🖼️ Photo</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>Post or Report a missing pet</Text>
        </View>

        {/* LOOP INCOMING POSTS */}
        {MOCK_POSTS.map((post) => (
          <View key={post.id} style={styles.postCard}>
            
            {/* Post Header */}
            <View style={styles.postHeader}>
              <View style={styles.postAvatar} />
              <View style={styles.postMeta}>
                <Text style={styles.postAuthor}>{post.author}</Text>
                <Text style={styles.postTime}>{post.location}</Text>
              </View>
              <TouchableOpacity>
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
              <Text style={styles.metricItem}>👁️ {post.comments}</Text>
            </View>

            <View style={styles.divider} />

            {/* Action Bar */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>🤍 Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>💬 Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>➡️ Share</Text>
              </TouchableOpacity>
            </View>

          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.darkBrown,
  },
  header: {
    backgroundColor: THEME.darkBrown,
    paddingHorizontal: 20,
    paddingTop: 15,
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
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#9c6644',
    borderWidth: 1,
    borderColor: '#fff',
  },
  onlineStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00ff00',
    position: 'absolute',
    right: 0,
    top: 0,
    borderWidth: 1.5,
    borderColor: THEME.darkBrown,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  profileName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  notificationBell: {
    backgroundColor: '#f5c469',
    width: 36,
    height: 36,
    borderRadius: 18,
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
});