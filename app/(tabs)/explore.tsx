import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';

const THEME = {
  darkBrown: '#5c2d06',
  lightBrown: '#d8b69f',
  cardBackground: '#ebd5c5',
  emptyCardBg: '#c3a28c',
  inputBg: '#d8b69f',
};

type ChatUser = {
  id: string;
  name: string;
  time: string;
  message: string;
  avatar: string;
  isUnread: boolean;
  activeStatus?: string;
};

const MOCK_CHATS: ChatUser[] = [
  {
    id: '1',
    name: 'Nadith Marie',
    time: '12:00 AM',
    message: 'You: 👍',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isUnread: false,
    activeStatus: 'Active 5 hours ago',
  },
  {
    id: '2',
    name: 'Cluwe Yuji',
    time: '1:51 PM',
    message: 'You: 👍',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isUnread: false,
    activeStatus: 'Active 1 hour ago',
  },
  {
    id: '3',
    name: 'Lance Fernandez',
    time: '1:52 PM',
    message: 'You: 👍',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isUnread: false,
    activeStatus: 'Active 30 mins ago',
  },
  {
    id: '4',
    name: 'Rachel Suson',
    time: '1:21 PM',
    message: 'You: 👍',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    isUnread: false,
    activeStatus: 'Active now',
  },
  {
    id: '5',
    name: 'Junrel Alipogpog',
    time: '1:59 PM',
    message: 'You: 👍',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    isUnread: false,
    activeStatus: 'Active 2 hours ago',
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  
  // Track active filter state
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Unread' | 'Homescreen'>('All');
  
  // Track active individual chat screen (null = list view)
  const [activeChat, setActiveChat] = useState<ChatUser | null>(null);

  // Big Thumbs-Up reaction state
  const [showThumbsUp, setShowThumbsUp] = useState(false);

  const filteredChats = MOCK_CHATS.filter((chat) => {
    if (selectedFilter === 'Unread') return chat.isUnread;
    return true;
  });

  const handleFilterPress = (filterName: 'All' | 'Unread' | 'Homescreen') => {
    setSelectedFilter(filterName);
    if (filterName === 'Homescreen') {
      router.push('/(tabs)');
    }
  };

  const handleSendThumbsUp = () => {
    setShowThumbsUp(true);
    setTimeout(() => setShowThumbsUp(false), 2000); // Auto-hide big thumb after 2 seconds
  };

  return (
    <View style={styles.container}>
      
      {/* ========================================== */}
      {/* VIEW 1: INDIVIDUAL CHAT SCREEN (IF SELECTED) */}
      {/* ========================================== */}
      {activeChat ? (
        <View style={{ flex: 1 }}>
          {/* CHAT HEADER WITH BACK BUTTON */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setActiveChat(null)} activeOpacity={0.8} style={{ paddingRight: 10 }}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            <Image source={{ uri: activeChat.avatar }} style={styles.headerAvatar} />

            <View style={styles.headerMeta}>
              <Text style={styles.chatHeaderTitle}>{activeChat.name}</Text>
              <Text style={styles.chatHeaderStatus}>{activeChat.activeStatus || 'Active recently'}</Text>
            </View>
          </View>

          {/* CHAT BODY PANEL WITH PROFILE PREVIEW */}
          <View style={styles.chatBodyPanel}>
            <ScrollView contentContainerStyle={styles.chatContentContainer} showsVerticalScrollIndicator={false}>
              {/* CENTER PROFILE BADGE */}
              <View style={styles.centerProfileCard}>
                <Image source={{ uri: activeChat.avatar }} style={styles.largeAvatar} />
                <Text style={styles.largeProfileName}>{activeChat.name}</Text>
                <TouchableOpacity style={styles.viewProfileBtn} activeOpacity={0.8}>
                  <Text style={styles.viewProfileText}>View profile</Text>
                </TouchableOpacity>
              </View>

              {/* BIG THUMBS UP EFFECT */}
              {showThumbsUp && (
                <View style={styles.thumbsUpOverlay}>
                  <Text style={{ fontSize: 90 }}>👍</Text>
                </View>
              )}
            </ScrollView>

            {/* CHAT INPUT BAR */}
            <View style={styles.chatInputRow}>
              <TouchableOpacity style={styles.mediaButton} activeOpacity={0.8}>
                <Text style={{ fontSize: 20 }}>🖼️</Text>
              </TouchableOpacity>

              <TextInput 
                style={styles.messageInput} 
                placeholder="Message" 
                placeholderTextColor="#6e4c31" 
              />

              <TouchableOpacity style={styles.likeButton} onPress={handleSendThumbsUp} activeOpacity={0.8}>
                <Text style={{ fontSize: 22 }}>👍</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        /* ========================================== */
        /* VIEW 2: MAIN CHAT LIST SCREEN              */
        /* ========================================== */
        <View style={{ flex: 1 }}>
          {/* TOP HEADER */}
          <View style={styles.header}>
            <View style={styles.profileRow}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarPlaceholder} />
                <View style={styles.onlineStatusDot} />
              </View>
              <Text style={styles.profileName}>Jurcales, Chloey Lyca</Text>
            </View>
            <TouchableOpacity style={styles.notificationBell} activeOpacity={0.8}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </TouchableOpacity>
          </View>

          {/* FILTER CHIPS */}
          <View style={styles.filterRow}>
            {(['All', 'Unread', 'Homescreen'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
                onPress={() => handleFilterPress(filter)}
                activeOpacity={0.8}
              >
                <Text style={selectedFilter === filter ? styles.filterTextActive : styles.filterText}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CHAT LIST PANEL */}
          <ScrollView
            style={styles.chatListPanel}
            contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {selectedFilter === 'Unread' && filteredChats.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyTitle}>No unread chats</Text>
                <Text style={styles.emptySubtext}>
                  When you have unread chats, you'll see them here.
                </Text>
              </View>
            ) : (
              filteredChats.map((chat) => (
                <TouchableOpacity 
                  key={chat.id} 
                  style={styles.chatCard} 
                  activeOpacity={0.8}
                  onPress={() => setActiveChat(chat)} // Open chat when profile or card clicked
                >
                  <Image source={{ uri: chat.avatar }} style={styles.chatAvatar} />
                  <View style={styles.chatMeta}>
                    <View style={styles.chatTopRow}>
                      <Text style={styles.chatName}>{chat.name}</Text>
                      <Text style={styles.chatTime}>{chat.time}</Text>
                    </View>
                    <Text style={styles.chatMessage}>{chat.message}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}

      {/* CUSTOM BOTTOM NAVIGATION BAR */}
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
          onPress={() => {
            setActiveChat(null);
            router.push('/(tabs)');
          }}
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

  /* HEADER & LIST STYLES */
  header: {
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
  profileName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notificationBell: {
    backgroundColor: '#f5c469',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterChip: {
    backgroundColor: THEME.lightBrown,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#ffffff',
  },
  filterText: {
    color: '#4a2c11',
    fontWeight: '600',
    fontSize: 13,
  },
  filterTextActive: {
    color: THEME.darkBrown,
    fontWeight: 'bold',
    fontSize: 13,
  },
  chatListPanel: {
    flex: 1,
    backgroundColor: THEME.lightBrown,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  chatCard: {
    backgroundColor: THEME.cardBackground,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatMeta: {
    flex: 1,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#331800',
  },
  chatTime: {
    fontSize: 11,
    color: '#6e4c31',
  },
  chatMessage: {
    fontSize: 13,
    color: '#6e4c31',
  },

  /* EMPTY STATE */
  emptyStateCard: {
    backgroundColor: THEME.emptyCardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#5c2d06',
    padding: 30,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80%',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a2c11',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#5c3a21',
    textAlign: 'center',
  },

  /* CHAT DETAIL SCREEN STYLES */
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.darkBrown,
  },
  backArrow: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginLeft: 6,
    marginRight: 10,
  },
  headerMeta: {
    justifyContent: 'center',
  },
  chatHeaderTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatHeaderStatus: {
    color: '#ebd5c5',
    fontSize: 10,
    opacity: 0.8,
  },
  chatBodyPanel: {
    flex: 1,
    backgroundColor: THEME.lightBrown,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  chatContentContainer: {
    alignItems: 'center',
    paddingTop: 30,
    flexGrow: 1,
  },
  centerProfileCard: {
    alignItems: 'center',
  },
  largeAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#5c2d06',
    marginBottom: 12,
  },
  largeProfileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#331800',
    marginBottom: 8,
  },
  viewProfileBtn: {
    backgroundColor: THEME.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#bfa28f',
  },
  viewProfileText: {
    fontSize: 11,
    color: '#4a2c11',
    fontWeight: '500',
  },
  thumbsUpOverlay: {
    position: 'absolute',
    right: 25,
    bottom: 30,
  },

  /* CHAT INPUT BAR */
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: THEME.lightBrown,
  },
  mediaButton: {
    marginRight: 8,
  },
  messageInput: {
    flex: 1,
    height: 40,
    backgroundColor: THEME.cardBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#bfa28f',
    fontSize: 13,
    color: '#331800',
  },
  likeButton: {
    marginLeft: 10,
  },

  /* BOTTOM NAVIGATION BAR */
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