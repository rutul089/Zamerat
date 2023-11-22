import React from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import images from '../../../assets/images';
import {
  FlexContainer,
  SwitchToggle,
  Text,
  UserItem,
  Header,
  BottomSheet,
  ActionItem,
  Loader,
  OfflineNotice,
  FullScreenModal,
} from '../../../components';
import Spacing from '../../../components/Spacing';
import {strings} from '../../../locales/i18n';
import theme from '../../../util/theme';
import styles from '../Style';
import {AlertDialog, Box, Button} from 'native-base';
import {SvgUri} from 'react-native-svg';

const RenderRowItem = ({onPress, text, dropdownVale, color, dropDownClick}) => {
  return (
    <TouchableOpacity
      style={styles.rowContainer}
      onPress={onPress}
      disabled={!onPress}>
      <Text type={'body1'} color={color}>
        {text}
      </Text>
      {dropdownVale && (
        <>
          <Spacing direction="y" size="xl" />
          <TouchableOpacity
            style={styles.rightContainer}
            activeOpacity={0.7}
            onPress={dropDownClick}>
            <Text
              type={'body2'}
              color={theme.colors.typography.silver}
              style={{flex: 1}}>
              {dropdownVale}
            </Text>
            <Image
              source={images.ic_dropdown}
              style={{height: 12, width: 12}}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </>
      )}
    </TouchableOpacity>
  );
};

const SettingScreenComponent = ({
  accountDropdownValue,
  languageDropdownValue,
  onNotificationClick,
  onLogoutClick,
  onPressAccountDropdown,
  onPressLanguageDropdown,
  name,
  email,
  profilePhoto,
  isActive,
  onSwitchToggle,
  accountModalRef,
  accountList,
  onAccountListPress,
  languageModalRef,
  languageList,
  onLanguageSelected,
  logoutButtonPress,
  onClose,
  cancelRef,
  isOpen,
  account_id,
  isLoading,
  onHelpDeskClick,
  showAccountModal,
  onHideModal,
  searchValue,
  onChangeText,
  showLanguageModal,
  searchLanguageValue,
  onChangeLanguage,
  onHideLanguageModal,
}) => {
  return (
    <FlexContainer statusBarColor={theme.colors.brandColor.FAFAFA}>
      <Header isLeftIconHidden={true} isRightIconHidden={true} />
      <ScrollView contentContainerStyle={styles.container}>
        <UserItem
          name={name}
          email={email}
          uri={profilePhoto}
          isAvatar
          isOnline={isActive}
        />
        <Spacing size="md" />
        <View style={{flexDirection: 'row'}}>
          <Text type={'body1'} style={{flex: 1}}>
            {strings('settings.active_status')}
          </Text>
          <SwitchToggle
            switchOn={isActive}
            onPress={onSwitchToggle}
            circleColorOff="white"
            circleColorOn="white"
            backgroundColorOn="#13BE66"
            backgroundColorOff="#B1B8BB"
            containerStyle={{
              width: theme.sizes.xl15,
              height: theme.sizes.xl14,
              borderRadius: theme.sizes.xl5,
              padding: 5,
            }}
            circleStyle={{
              width: theme.sizes.icons.xs,
              height: theme.sizes.icons.xs,
              borderRadius: 30,
            }}
          />
        </View>
        <Text type={'body3-10'} style={{width: '60%', marginTop: 7}}>
          {strings('settings.active_status_message')}
        </Text>
        <Spacing size="md" />
        <RenderRowItem
          text={`${strings('settings.ACCOUNT_MENU')}  `}
          dropdownVale={accountDropdownValue}
          dropDownClick={onPressAccountDropdown}
        />
        <Spacing size="md" />
        <RenderRowItem
          text={strings('settings.CHANGE_LANGUAGE_LABEL')}
          dropdownVale={languageDropdownValue}
          dropDownClick={onPressLanguageDropdown}
        />
        <Spacing size="md" />
        <RenderRowItem
          text={strings('settings.NOTIFICATION_HEADER')}
          onPress={onNotificationClick}
        />
        {/* <Spacing size="md" />
        <RenderRowItem
          text={strings('settings.HELP_DESK')}
          onPress={onHelpDeskClick}
        /> */}
        <Spacing size="md" />
        <RenderRowItem
          text={strings('settings.LOGOUT')}
          color={theme.colors.typography.error}
          onPress={onLogoutClick}
        />
      </ScrollView>
      <FullScreenModal
        listData={accountList}
        lisItem={({item, index}) => (
          <ActionItem
            key={index}
            label={item?.name}
            onItemPress={() => onAccountListPress(item, index)}
            leftIcon={
              <Image
                resizeMode="contain"
                source={
                  item?.image_url?.small
                    ? {uri: item?.image_url?.small}
                    : images.ic_userprofile
                }
                style={{
                  height: theme.sizes.icons.sm * 1.5,
                  width: theme.sizes.icons.sm * 1.5,
                  alignSelf: 'center',
                  borderRadius: theme.sizes.icons.sm,
                }}
              />
            }
            rightIcon={
              item?.id === account_id ? (
                <Image
                  resizeMode="contain"
                  source={images.ic_check_mark}
                  style={{
                    height: theme.sizes.icons.sm,
                    width: theme.sizes.icons.sm,
                    tintColor: theme.colors.brandColor.blue,
                  }}
                />
              ) : null
            }
          />
        )}
        showModal={showAccountModal}
        onHideModal={onHideModal}
        placeholder={strings('SEARCH_PLACEHOLDER')}
        onChangeText={onChangeText}
        searchValue={searchValue}
        noDataPlaceholder={strings('NO_DATA_FOUND')}
      />
      <FullScreenModal
        listData={languageList}
        lisItem={({item, index}) => (
          <ActionItem
            key={index}
            label={item?.languageName}
            onItemPress={() => onLanguageSelected(item, index)}
          />
        )}
        showModal={showLanguageModal}
        onHideModal={onHideLanguageModal}
        placeholder={strings('SEARCH_PLACEHOLDER')}
        onChangeText={onChangeLanguage}
        searchValue={searchLanguageValue}
        noDataPlaceholder={strings('NO_DATA_FOUND')}
      />
      {/* <BottomSheet
        ref={accountModalRef}
        height={theme.normalize(220)}
        closeOnDragDown
        customStyles={{
          mask: {backgroundColor: 'transparent'},
          container: styles.bottomSheetStyle,
        }}>
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
          {accountList?.map((item, index) => (
            <ActionItem
              key={index}
              label={item?.name}
              onItemPress={() => onAccountListPress(item, index)}
              leftIcon={
                <Image
                  resizeMode="contain"
                  source={
                    item?.image_url?.small
                      ? {uri: item?.image_url?.small}
                      : images.ic_userprofile
                  }
                  style={{
                    height: theme.sizes.icons.sm * 1.5,
                    width: theme.sizes.icons.sm * 1.5,
                    alignSelf: 'center',
                    borderRadius: theme.sizes.icons.sm,
                  }}
                />
              }
              rightIcon={
                item?.id === account_id ? (
                  <Image
                    resizeMode="contain"
                    source={images.ic_check_mark}
                    style={{
                      height: theme.sizes.icons.sm,
                      width: theme.sizes.icons.sm,
                      tintColor: theme.colors.brandColor.blue,
                    }}
                  />
                ) : null
              }
            />
          ))}
        </ScrollView>
      </BottomSheet> */}
      {/* <BottomSheet
        ref={languageModalRef}
        height={theme.normalize(220)}
        closeOnDragDown
        customStyles={{
          mask: {backgroundColor: 'transparent'},
          container: styles.bottomSheetStyle,
        }}>
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
          {languageList?.map((item, index) => (
            <ActionItem
              key={index}
              label={item?.languageName}
              onItemPress={() => onLanguageSelected(item, index)}
            />
          ))}
        </ScrollView>
      </BottomSheet> */}
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{strings('orgName')}</AlertDialog.Header>
          <AlertDialog.Body>
            {`Are you sure, you want to logout from the ${strings('orgName')} app?`}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}>
                Cancel
              </Button>
              <Button
                variant="link"
                colorScheme="danger"
                color={'yellow.100'}
                onPress={logoutButtonPress}>
                Logout
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Loader loading={isLoading} />
    </FlexContainer>
  );
};

export default SettingScreenComponent;
