import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import typography from '../constants/typography';
import spacing from '../constants/spacing';

const getStatusStyles = (colors) => ({
  paid: { bg: colors.successLight, text: colors.success, label: 'Paid' },
  approved: { bg: colors.successLight, text: colors.success, label: 'Approved' },
  resolved: { bg: colors.successLight, text: colors.success, label: 'Resolved' },
  unpaid: { bg: colors.dangerLight, text: colors.danger, label: 'Unpaid' },
  rejected: { bg: colors.dangerLight, text: colors.danger, label: 'Rejected' },
  pending_verification: { bg: colors.warningLight, text: colors.warning, label: 'Pending' },
  in_progress: { bg: colors.infoLight, text: colors.info, label: 'In Progress' },
  open: { bg: colors.infoLight, text: colors.info, label: 'Open' },
});

const StatusChip = ({ status, label, style }) => {
  const { colors } = useTheme();
  const STATUS_STYLES = getStatusStyles(colors);

  const statusStyle = STATUS_STYLES[status] || {
    bg: colors.surfaceLight,
    text: colors.textSecondary,
    label: status,
  };

  return (
    <View style={[styles.chip, { backgroundColor: statusStyle.bg }, style]}>
      <View style={[styles.dot, { backgroundColor: statusStyle.text }]} />
      <Text style={[styles.text, { color: statusStyle.text }]}>
        {label || statusStyle.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.radiusFull,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});

export default StatusChip;
