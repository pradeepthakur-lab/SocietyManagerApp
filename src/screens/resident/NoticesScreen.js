import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { useNotifications } from '../../context/NotificationContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatDate } from '../../utils/formatDate';

const priorityColors = { high: colors.danger, medium: colors.warning, low: colors.info };

const NoticesScreen = ({ navigation }) => {
  const { notices, loadNotices } = useNotifications();

  useEffect(() => { loadNotices(); }, []);

  const renderNotice = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.priorityBar, { backgroundColor: priorityColors[item.priority] || colors.info }]} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Notices" onBack={() => navigation.goBack()} />
      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        renderItem={renderNotice}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="bullhorn" title="No notices" message="Society announcements will appear here" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.screenHorizontal, paddingTop: spacing.md, paddingBottom: spacing.huge },
  card: { marginBottom: spacing.md },
  header: { flexDirection: 'row', marginBottom: spacing.sm },
  priorityBar: { width: 4, borderRadius: 2, marginRight: spacing.md },
  info: { flex: 1 },
  title: { ...typography.subtitle1, color: colors.textPrimary },
  date: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  content: { ...typography.body2, color: colors.textSecondary, lineHeight: 22 },
});

export default NoticesScreen;
