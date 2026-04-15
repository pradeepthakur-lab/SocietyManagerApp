import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import api from '../../services/api';

const ServerSettings = ({ navigation }) => {
  const { colors } = useTheme();
  const s = makeStyles(colors);
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const [host, setHost] = useState('');
  const [port, setPort] = useState('3000');
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadSavedHost();
  }, []);

  const loadSavedHost = async () => {
    try {
      const saved = await api.getApiHost();
      setHost(saved.host);
      setPort(saved.port);
    } catch (e) {
      console.warn('Failed to load host:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!host.trim()) {
      showToast('Please enter a host address', 'error');
      return;
    }
    setTesting(true);
    try {
      const testUrl = `http://${host.trim()}:${port.trim() || '3000'}/api/health`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(testUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (response.ok) {
        showToast('Connection successful!', 'success');
      } else {
        showToast(`Server responded with status ${response.status}`, 'warning');
      }
    } catch (e) {
      showToast('Connection failed. Check host and port.', 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!host.trim()) {
      showToast('Please enter a host address', 'error');
      return;
    }
    try {
      await api.setApiHost(host.trim(), port.trim() || '3000');
      showToast('Server settings saved!', 'success');
      navigation.goBack();
    } catch (e) {
      showToast('Failed to save settings', 'error');
    }
  };

  if (loading) {
    return (
      <View style={[s.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backButton}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Server Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={s.content}>
        {/* Info Card */}
        <View style={s.infoCard}>
          <Icon name="information-outline" size={20} color={colors.primary} />
          <Text style={s.infoText}>
            Configure the API server address. Use your computer's local IP for physical devices, or 10.0.2.2 for Android emulator.
          </Text>
        </View>

        {/* Host Input */}
        <Input
          label="Host / IP Address"
          value={host}
          onChangeText={setHost}
          placeholder="e.g. 192.168.1.100"
          icon="server-network"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Port Input */}
        <Input
          label="Port"
          value={port}
          onChangeText={(text) => setPort(text.replace(/\D/g, ''))}
          placeholder="e.g. 3000"
          icon="numeric"
          keyboardType="number-pad"
          maxLength={5}
        />

        {/* Current URL Preview */}
        <View style={s.previewCard}>
          <Text style={s.previewLabel}>API URL</Text>
          <Text style={s.previewUrl}>http://{host || '...'}:{port || '3000'}/api</Text>
        </View>

        {/* Test Connection */}
        <Button
          title={testing ? 'Testing...' : 'Test Connection'}
          onPress={handleTestConnection}
          loading={testing}
          icon="lan-connect"
          style={s.testButton}
          variant="outline"
        />

        {/* Save */}
        <Button
          title="Save & Apply"
          onPress={handleSave}
          icon="content-save-check"
          style={s.saveButton}
        />
      </View>
    </View>
  );
};

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.base,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryGlow,
    borderRadius: spacing.cardRadius,
    padding: spacing.base,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.2)',
    gap: spacing.sm,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.base,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  previewUrl: {
    ...typography.body1,
    color: colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  testButton: {
    marginBottom: spacing.md,
  },
  saveButton: {
    marginTop: spacing.xs,
  },
});

export default ServerSettings;
