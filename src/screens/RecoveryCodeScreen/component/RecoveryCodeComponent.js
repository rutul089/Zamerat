import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import images from '../../../assets/images';
import styles from '../Style';
import {
  Button,
  FlexContainer,
  Input,
  Loader,
  Spacing,
  Text,
  Header,
} from '../../../components';
import {SVG} from '../../../assets/svg';
import {strings} from '../../../locales/i18n';
import theme from '../../../util/theme';
import QRCode from 'react-native-qrcode-svg';

const TwoFactorCheckComponent = ({
  onPressLeftContent,
  onSubmit,
  state,
  onVerifyCodeChange,
  onSubmitVerifyCode,
  recoveryCodeBtnPress,
}) => (
  <FlexContainer>
    <Header
      backgroundColor={'white'}
      isRightIconHidden
      isCenterDisabled
      onPressLeftContent={onPressLeftContent}
    />
    <KeyboardAvoidingScrollView contentContainerStyle={styles.mainContainer}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <SVG.LoginLogoIcon />
        <Spacing size="xl" />
        <Text type={'h3'}>{strings('login.enter_2fa_code')}</Text>
        <Spacing size="xs" />
        <Text type={'body1'} textAlign={'center'}>
          {strings('login.2FA_TOTP_SCREEN_SUB_HEADING', {
            ORGANISATION_NAME: strings('orgName'),
          })}
        </Text>
        <Spacing size="xl2" />
      </View>
      <Input
        label={strings('login.2FA_TOTP_SCREEN_CODE_INPUT')}
        placeholder={''}
        isError={!state?.isErrOTP}
        errorMsg={state?.errOTP}
        value={state?.verifyCode}
        keyboardType={'number-pad'}
        onChangeText={onVerifyCodeChange && onVerifyCodeChange}
        returnKeyType="done"
        onSubmitEditing={onSubmitVerifyCode && onSubmitVerifyCode}
        maxLength={6}
      />
      <Spacing size="xl" />
      <Button
        bg={theme.colors.brandColor.blue}
        buttonText={strings('button.RECOVERY_SCREEN_VERIFY_BTN_TEXT')}
        onPress={onSubmit}
      />
      <Spacing size="md" />
      <TouchableOpacity
        style={{alignSelf: 'flex-start'}}
        activeOpacity={0.5}
        onPress={recoveryCodeBtnPress}>
        <Text type={'link'}>{strings('button.enter_recovery_code')}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingScrollView>
  </FlexContainer>
);

export default TwoFactorCheckComponent;
