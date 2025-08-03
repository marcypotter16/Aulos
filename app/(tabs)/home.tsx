import PostCard from "@/components/PostCard/PostCard";
import { darkThemeColors, lightThemeColors } from "@/constants";
import { useAuth } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/ThemeContext";
import Post from "@/models/post";
import { supabase } from "@/supabase";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";

const POSTS_PER_PAGE = 10;


const FeedScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [visiblePostIds, setVisiblePostIds] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const { width: screenWidth } = Dimensions.get("window");
  const isTablet = screenWidth >= 768;
  const isLargeScreen = screenWidth >= 1024;

  const fetchPosts = async (offset: number = 0) => {
    try {
      const { data: postsData, error } = await supabase
        .from("posts")
        .select(`
          *,
          users!posts_user_id_fkey (
            user_name,
            avatar_url
          ),
          post_media (
            id,
            type,
            position,
            media_path,
            created_at
          ),
          post_likes!left (
            user_id
          )
        `)
        .eq("visibility", "public")
        .order("created_at", { ascending: false })
        .range(offset, offset + POSTS_PER_PAGE - 1);

      if (error) throw error;

      // Transform the data to match our Post interface
      const transformedPosts: Post[] = (postsData || []).map((post: any) => {
        return {
          id: post.id,
          user_id: post.user_id,
          content: post.content,
          caption: post.caption || "",
          created_at: post.created_at,
          updated_at: post.updated_at,
          visibility: post.visibility,
          likes_count: post.likes_count || 0,
          comments_count: post.comments_count || 0,
          userName: post.users?.user_name || "Unknown User",
          userProfilePicture: post.users?.avatar_url,
          post_media: (post.post_media || [])
            .map((media: any) => ({
              ...media,
              post_id: post.id,
            }))
            .sort((a: any, b: any) => a.position - b.position),
          showActions: true,
          isLikedByUser: user?.id ? post.post_likes?.some((like: any) => like.user_id === user.id) : false,
        };
      });

      return transformedPosts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  // Load initial posts
  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      const initialPosts = await fetchPosts(0);
      setPosts(initialPosts);
      setCurrentPage(1);
      setHasMore(initialPosts.length === POSTS_PER_PAGE);
      setLoading(false);
    };

    loadInitialPosts();
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const offset = currentPage * POSTS_PER_PAGE;
    const newPosts = await fetchPosts(offset);

    if (newPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setCurrentPage((prev) => prev + 1);
      setHasMore(newPosts.length === POSTS_PER_PAGE);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }, [currentPage, loading, hasMore]);

  const onEndReached = () => {
    loadMorePosts();
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const ids = viewableItems.map((item) => item.item.id);
      setVisiblePostIds(ids);
    }
  );

  const renderItem = ({ item }: { item: Post }) => (
    <PostCard post={item} isVisible={visiblePostIds.includes(item.id)} />
  );

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator
          size={isTablet ? "large" : "small"}
          color={
            theme === "dark"
              ? darkThemeColors.primary
              : lightThemeColors.primary
          }
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: isTablet ? 70 : 50,
          minimumViewTime: 300,
        }}
        contentContainerStyle={
          getStyles(theme, isTablet, isLargeScreen).container
        }
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        // For tablets, add some spacing to make it clear which post is active
        ItemSeparatorComponent={() =>
          isTablet ? <View style={{ height: 20 }} /> : null
        }
        // Pagination props
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

const getStyles = (
  theme: "dark" | "light",
  isTablet: boolean,
  isLargeScreen: boolean
) =>
  StyleSheet.create({
    container: {
      paddingVertical: isTablet ? 20 : 10,
      paddingHorizontal: isLargeScreen ? 40 : isTablet ? 20 : 0,
      backgroundColor:
        theme === "dark"
          ? darkThemeColors.background
          : lightThemeColors.background,
      flexGrow: 1,
    },
  });

export default FeedScreen;
