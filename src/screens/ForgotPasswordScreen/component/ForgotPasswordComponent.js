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

const ForgotPasswordComponent = ({
  onPressLeftContent,
  onSubmitEditingEmail,
  onEmailChange,
  state,
  onSubmit,
  isLoading,
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
        <Text type={'h3'}>{strings('login.FORGOT_PASSWORD_LABEL')}</Text>
        <Spacing size="xs" />
        <Text type={'body1'} textAlign={'center'}>
          {strings('login.FORGOT_PASSWORD_DESCRIPTION', {
            ORGANISATION_NAME: 'Zamerat Chat',
          })}
        </Text>
      </View>
      <Spacing size="xl2" />
      <Input
        label={strings('login.EMAIL_LABEL')}
        placeholder={'abc@abc.com'}
        isError={!state?.isErrEmail}
        errorMsg={state?.emailErrMsg}
        value={state?.email}
        keyboardType={'email-address'}
        onChangeText={onEmailChange && onEmailChange}
        returnKeyType="done"
        onSubmitEditing={onSubmitEditingEmail && onSubmitEditingEmail}
      />
      <Spacing size="xl" />
      <Button
        bg={theme.colors.brandColor.blue}
        buttonText={strings('button.SEND_ME_INSTRUCTIONS_BUTTON')}
        onPress={onSubmit}
      />
    </KeyboardAvoidingScrollView>
    <Loader loading={isLoading} />
  </FlexContainer>
);

export default ForgotPasswordComponent;
