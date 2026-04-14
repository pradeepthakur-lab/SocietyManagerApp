import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import BottomSheet from '../../components/BottomSheet';
import EmptyState from '../../components/EmptyState';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatDate } from '../../utils/formatDate';

const Notices = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const priorityColors = { high: colors.danger, medium: colors.warning, low: colors.info };
  const { notices, loadNotices, addNotice } = useNotifications();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => { loadNotices(); }, []);

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) return;
    await addNotice({ title: title.trim(), content: content.trim(), priority });
    setShowAdd(false);
    setTitle('');
    setContent('');
  };

  const renderNotice = ({ item }) => (
    <Card style={s.card}>
      <View style={s.header}>
        <View style={[s.priorityBar, { backgroundColor: priorityColors[item.priority] || colors.info }]} />
        <View style={s.info}>
          <Text style={s.noticeTitle}>{item.title}</Text>
          <Text style={s.date}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
      <Text style={s.content}>{item.content}</Text>
    </Card>
  );

  return (
    <View style={s.container}>
      <Header
        title="Notice Board"
        onBack={() => navigation.goBack()}
        rightIcon="plus"
        onRightPress={() => setShowAdd(true)}
      />
      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        renderItem={renderNotice}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="bullhorn" title="No notices" message="Post announcements for residents" />}
      />
      <BottomSheet visible={showAdd} onClose={() => setShowAdd(false)} title="New Notice" height="70%">
        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Notice title" icon="text-box" />
        <Input label="Content" value={content} onChangeText={setContent} placeholder="Notice details..." icon="text" multiline numberOfLines={4} />
        <Text style={s.priorityLabel}>Priority</Text>
        <View style={s.priorityRow}>
          {['low', 'medium', 'high'].map((p) => (
            <Button
              key={p}
              title={p.charAt(0).toUpperCase() + p.slice(1)}
              variant={priority === p ? 'primary' : 'outline'}
              size="small"
              onPress={() => setPriority(p)}
              fullWidth={false}
              style={{ marginRight: spacing.sm }}
            />
          ))}
        </View>
        <Button title="Post Notice" onPress={handleAdd} icon="send" style={{ marginTop: spacing.lg }} />
      </BottomSheet>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.screenHorizontal, paddingTop: spacing.md, paddingBottom: spacing.huge },
  card: { marginBottom: spacing.md },
  header: { flexDirection: 'row', marginBottom: spacing.sm },
  priorityBar: { width: 4, borderRadius: 2, marginRight: spacing.md },
  info: { flex: 1 },
  noticeTitle: { ...typography.subtitle1, color: colors.textPrimary },
  date: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  content: { ...typography.body2, color: colors.textSecondary, lineHeight: 22 },
  priorityLabel: { ...typography.subtitle2, color: colors.textSecondary, marginBottom: spacing.sm, marginTop: spacing.md },
  priorityRow: { flexDirection: 'row' },
});

export default Notices;
