import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/src/store/useAppStore';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/src/theme/colors';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAppStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasMinLength = password.length >= 6;
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const canProceedStep1 = name.trim().length > 0 && isValidEmail;
  const canProceedStep2 = hasMinLength && hasLowercase && hasNumber && passwordsMatch;

  const handleStep1 = useCallback(() => {
    if (canProceedStep1) setStep(2);
  }, [canProceedStep1]);

  const handleStep2 = useCallback(() => {
    if (canProceedStep2) {
      signUp(name.trim(), email.trim());
      router.replace('/upsell');
    }
  }, [canProceedStep2, signUp, name, email, router]);

  const ValidationIndicator = ({ valid, label }: { valid: boolean; label: string }) => (
    <View style={styles.validationRow}>
      <Text style={[styles.validationDot, valid ? styles.validGreen : styles.invalidRed]}>
        {valid ? '🟢' : '🔴'}
      </Text>
      <Text style={styles.validationText}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.header}>
          {step === 2 ? (
            <TouchableOpacity onPress={() => setStep(1)}>
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
          <Text style={styles.headerTitle}>Sign Up</Text>
          <Text style={styles.stepIndicator}>{step}/2</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {step === 1 ? (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholderTextColor={Colors.textLight}
              />
              {email.length > 0 && !isValidEmail && (
                <Text style={styles.helperError}>Please enter a valid email address</Text>
              )}

              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                autoComplete="name"
                placeholderTextColor={Colors.textLight}
              />

              <Text style={styles.termsText}>
                Terms, Privacy Policy, Subscription Terms
              </Text>

              <PrimaryButton
                title="Get started"
                onPress={handleStep1}
                disabled={!canProceedStep1}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor={Colors.textLight}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁' : '👁‍🗨'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.validationContainer}>
                <ValidationIndicator valid={hasMinLength} label="At least 6 characters" />
                <ValidationIndicator valid={hasLowercase} label="At least one lowercase letter (a-z)" />
                <ValidationIndicator valid={hasNumber} label="At least one number (0-9)" />
              </View>

              <Text style={styles.label}>Confirmation password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry={!showPassword}
                placeholderTextColor={Colors.textLight}
              />

              <PrimaryButton
                title="Get started"
                onPress={handleStep2}
                disabled={!canProceedStep2}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backText: {
    fontSize: 32,
    color: Colors.text,
  },
  placeholder: {
    width: 20,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  stepIndicator: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  helperError: {
    fontSize: FontSizes.sm,
    color: Colors.error,
    marginBottom: Spacing.sm,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  eyeButton: {
    padding: Spacing.md,
  },
  eyeIcon: {
    fontSize: 20,
  },
  validationContainer: {
    marginBottom: Spacing.md,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  validationDot: {
    fontSize: 12,
    marginRight: Spacing.sm,
  },
  validGreen: {
    color: Colors.success,
  },
  invalidRed: {
    color: Colors.error,
  },
  validationText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  termsText: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
});
