import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import StatusChip from '../../components/StatusChip';
import BottomSheet from '../../components/BottomSheet';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { COMPLAINT_CATEGORIES } from '../../constants/roles';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { formatDate } from '../../utils/formatDate';

const Complaints = ({ navigation }) => {
  const { user } = useAuth();
  const { complaints, loadComplaints, addComplaint } = useNotifications();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => { loadComplaints(user?.id); }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    await addComplaint({
      userId: user?.id,
      userName: user?.name,
      flatNumber: 'A-101',
      title: title.trim(),
      description: description.trim(),
      category: category || 'Other',
    });
    setShowAdd(false);
    setTitle('');
    setDescription('');
    setCategory('');
  };

  const renderComplaint = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.catBadge}>
          <Icon name="wrench" size={14} color={colors.accent} />
          <Text style={styles.catText}>{item.category}</Text>
        </View>
        <StatusChip status={item.status} />
      </View>
      <Text style={styles.compTitle}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      {item.adminResponse && (
        <View style={styles.response}>
          <Icon name="reply" size={14} color={colors.info} />
          <Text style={styles.responseText}>{item.adminResponse}</Text>
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Complaints"
        onBack={() => navigation.goBack()}
        rightIcon="plus"
        onRightPress={() => setShowAdd(true)}
      />
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id}
        renderItem={renderComplaint}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="check-circle" title="No complaints" message="Raise any issues here" />}
      />
      <BottomSheet visible={showAdd} onClose={() => setShowAdd(false)} title="New Complaint" height="70%">
        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Brief subject" icon="text" />
        <Input label="Description" value={description} onChangeText={setDescription} placeholder="Describe the issue in detail" icon="text-box" multiline numberOfLines={4} />
        <Text style={styles.catLabel}>Category</Text>
        <View style={styles.catGrid}>
          {COMPLAINT_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, category === cat && styles.catChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Submit Complaint" onPress={handleSubmit} icon="send" style={{ marginTop: spacing.lg }} />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.screenHorizontal, paddingTop: spacing.md, paddingBottom: spacing.huge },
  card: { marginBottom: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  catBadge: { flexDirection: 'row', alignItems: 'center' },
  catText: { ...typography.caption, color: colors.accent, marginLeft: 4, fontWeight: '600' },
  compTitle: { ...typography.subtitle1, color: colors.textPrimary, marginBottom: 4 },
  desc: { ...typography.body2, color: colors.textSecondary, lineHeight: 22 },
  date: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  response: {
    flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.md,
    padding: spacing.md, backgroundColor: colors.infoLight, borderRadius: spacing.radiusSmall,
  },
  responseText: { ...typography.body2, color: colors.textPrimary, marginLeft: spacing.sm, flex: 1 },
  catLabel: { ...typography.subtitle2, color: colors.textSecondary, marginBottom: spacing.sm, marginTop: spacing.md },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  catChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: spacing.radiusFull,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  catChipActive: { backgroundColor: colors.primaryGlow, borderColor: colors.primary },
  catChipText: { ...typography.caption, color: colors.textMuted, fontWeight: '600' },
  catChipTextActive: { color: colors.primary },
});

export default Complaints;
