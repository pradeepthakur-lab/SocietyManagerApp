import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import typography from '../constants/typography';
import spacing from '../constants/spacing';

const BottomSheet = ({
  visible,
  onClose,
  title,
  children,
  height = '50%',
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={s.overlay} />
      </TouchableWithoutFeedback>
      <View style={[s.sheet, { maxHeight: height, paddingBottom: insets.bottom + spacing.base }]}>
        <View style={s.handle} />
        <View style={s.header}>
          <Text style={s.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={s.closeButton}>
            <Icon name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.content}
        >
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.radiusLarge,
    borderTopRightRadius: spacing.radiusLarge,
    paddingHorizontal: spacing.screenHorizontal,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderLight,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingBottom: spacing.base,
  },
});

export default BottomSheet;
