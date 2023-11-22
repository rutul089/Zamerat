import React, { forwardRef, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import images from '../../../assets/images';
import {
  ActionItem,
  BottomSheet,
  FlexContainer,
  Header,
  ImageViewer,
  Input,
  Loader,
  Text,
} from '../../../components';
import Modal from '../../../components/CustomModal/index';
import Spacing from '../../../components/Spacing';
import { CONVERSATION } from '../../../constants/global';
import { strings } from '../../../locales/i18n';
import {
  getAgentDetails,
  getChatMsgType,
  getFormChatItemWithResponse,
  userFileResponseElement,
} from '../../../util/ChatHistoryHelper';
import { getAddress } from '../../../util/ConversationListHelper';
import { bytesToSize } from '../../../util/helper';
import theme from '../../../util/theme';
import { registerVisitorTypingHandler } from '../../../websocket';
import styles from '../Style';
import AssigneeItem from './AssigneeItem';
import ButtonTeammate from './ButtonTeammate';
import ChatAppointmentBooking from './ChatComponent/ChatAppointmentBooking';
import ChatCalendar from './ChatComponent/ChatCalendar';
import ChatCardView from './ChatComponent/ChatCardView';
import ChatDateStampLabel from './ChatComponent/ChatDateStampLabel';
import ChatFileResponse from './ChatComponent/ChatFileResponse';
import ChatForm from './ChatComponent/ChatForm';
import ChatImg from './ChatComponent/ChatImg';
import ChatListView from './ChatComponent/ChatListView';
import ChatNote from './ChatComponent/ChatNote';
import ChatOptionsButton from './ChatComponent/ChatOptionsButton';
import ChatSlider from './ChatComponent/ChatSlider';
import ChatText from './ChatComponent/ChatText';
import ChatTyping from './ChatComponent/ChatTyping';
import ChatVideoView from './ChatComponent/ChatVideoView';

const ConversationComponent = (
  {
    joinConversation,
    joinConversationBtn,
    joinConversationPress,
    onPressMore,
    onPressInfo,
    moreInfoModalRef,
    onChangeAssignee,
    onCloseConversation,
    onPressLeftContent,
    joinButton,
    messageList,
    keyboardHeight,
    inputHeight,
    listRef,
    messageToSend,
    placeHolderMessage,
    updateMessageValue,
    showMenuOptions,
    onSendPress,
    attachmentBottomSheetRef,
    onSavedReplyPress,
    onCalendarPress,
    onAttachmentsPress,
    showChangeAssignee,
    onChangeAssigneeModalClose,
    onTeamMateClick,
    onTeamClick,
    isTeamSelected,
    teamMateData,
    teamData,
    itemData,
    userID,
    onTeamItemPress,
    isLoading,
    isMoreIconHidden,
    searchValue,
    onChangeText,
    messageHistory,
    users,
    isClosed,
    chatUserName,
    searchSaveReply,
    savedReply,
    onSearchSaveReply,
    showSavedReply,
    save_reply_list,
    onCloseSaveReply,
    replyLoading,
    onSaveReplyClick,
    handleLoadMore,
    isLoadMore,
    mediaData,
    onMediaPreviewCancel,
    handleLoadMore1,
    saveReplyLoadMore,
    // replyInputRef,
  },
  ref,
) => {
  const [typingData, setTypingData] = React.useState();
  const [imageModalShow, setImageModalShow] = React.useState(false);
  const [modalImg, setImageModalUrl] = React.useState();
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  const replyInputRef = React.useRef();

  React.useEffect(() => {
    replyInputRef?.current?.focus();
  }, [joinButton]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        console.log('keyboardDidShow');
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  React.useEffect(() => {
    registerVisitorTypingHandler(e => {
      if (!isLoading && itemData) {
        if (itemData?.thread_key === e?.conversation_key) {
          let newMsg = {
            ...itemData,
            type: 'typing',
            name: itemData?.title,
            key: Math.random(),
          };
          setTypingData(newMsg);
        }
      }
    });
  });

  function onToggleImageModal(img) {
    setImageModalShow(true);
    setImageModalUrl(img);
  }

  const _renderItemView = ({item, index}) => {
    let msgType = getChatMsgType(item);
    let itemWithAccountDetails =
      item.agent && !item.agent.id ? getAgentDetails(item, users) : item;
    let formResponse =
      msgType === 'form'
        ? getFormChatItemWithResponse(
            index,
            messageHistory,
            itemWithAccountDetails,
          )
        : null;

    return (
      <View style={styles.renderItem.mainContainer}>
        {renderItem(item, msgType, itemWithAccountDetails, formResponse)}
      </View>
    );
  };
  const _renderAssigneeItemView = ({item}) => {
    return (
      <AssigneeItem
        item={item}
        isTeamSelected={isTeamSelected}
        isMe={item?.id === userID}
        profileImage={item?.image_url?.small}
        onItemPress={() => onTeamItemPress && onTeamItemPress(item)}
        isDoneMarkShown={
          itemData?.assignee
            ? itemData?.assignee?.id === item?.id
            : itemData?.assignee === item?.id
        }
      />
    );
  };
  const _renderChangeAssigneeView = () => {
    return (
      <Modal
        animationType="slide"
        visible={showChangeAssignee}
        style={{backgroundColor: 'black', margin: 0}}
        onBackButtonPress={onChangeAssigneeModalClose}
        statusBarTranslucent={false}>
        <SafeAreaView
          style={{flex: 1, backgroundColor: theme.colors.brandColor.FAFAFA}}>
          <View style={{overflow: 'hidden', paddingBottom: 1}}>
            <View style={styles.assigneeHeader}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={onChangeAssigneeModalClose}>
                <Image
                  source={images.ic_cross}
                  resizeMode="contain"
                  style={styles.assigneeIcon}
                />
              </TouchableOpacity>
              <Text type={'body1'} textAlign={'center'} style={{flex: 1}}>
                {strings('chat.change_assignee')}
              </Text>
              <View style={styles.assigneeIcon} />
            </View>
          </View>
          <Input
            containerStyle={{padding: 5, backgroundColor: 'white'}}
            computedLeftIcon={images.ic_search}
            isLeftIconElementVisible
            tintColor={theme.colors.brandColor.blue}
            placeholder={`${strings('chat.SEARCH_TEAM_PLACEHOLDER')} ${strings(
              'chat.TEAMMATES_MENU',
            )} & ${strings('chat.TEAMS_MENU')}`}
            onChangeText={onChangeText}
            value={searchValue}
            leftIconDisabled
            returnKeyType="done"
            // onSubmitEditing={onSubmitEditing && onSubmitEditing}
          />
          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderColor: theme.colors.borderColor,
            }}>
            <ButtonTeammate
              tittle={strings('chat.TEAMMATES_MENU')}
              onPress={onTeamMateClick}
              isSelected={!isTeamSelected}
            />
            <ButtonTeammate
              tittle={strings('chat.TEAMS_MENU')}
              onPress={onTeamClick}
              isSelected={isTeamSelected}
            />
          </View>

          <FlatList
            stickyHeaderHiddenOnScroll={true}
            ListHeaderComponentStyle={{paddingVertical: theme.normalize(8)}}
            ref={listRef}
            contentContainerStyle={{backgroundColor: 'white', flexGrow: 1}}
            data={isTeamSelected ? teamData : teamMateData}
            renderItem={_renderAssigneeItemView}
            style={{}}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text color={theme.colors.brandColor.silver}>
                  {isTeamSelected
                    ? strings('NO_TEAM_FOUND_MESSAGE')
                    : strings('SLACK_LIVE_CHAT_PANEL_NO_TEAMMATES_FOUND')}
                </Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>
    );
  };
  const _renderJoinConversationView = () => {
    return (
      <View style={styles.bottomMainContainer}>
        <View style={styles.bottomContainer}>
          <Text type={'caption12'} style={{width: '96%'}} textAlign={'center'}>
            {joinConversation}
          </Text>
          <Spacing />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.btnStyle}
            onPress={joinConversationPress}>
            <Text type={'button2'} color={'white'}>
              {joinConversationBtn}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const _renderInputTextView = () => {
    // mediaData
    return (
      <View
        style={{
          backgroundColor: '#FEFEFE',
          padding: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 3,
          zIndex: 50000,
          // borderTopWidth: 1,
          // borderTopColor: theme.colors.typography.silver,
        }}>
        {mediaData ? (
          <View
            style={{
              backgroundColor: '#f0f2f5',
              marginBottom: 5,
              borderRadius: 8,
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 0.8}}>
              <Text numberOfLines={1} type={'body2'}>
                {mediaData?.name}
              </Text>
              <Text type={'caption12'}>{bytesToSize(mediaData?.size)} </Text>
            </View>
            <View
              style={{
                flex: 0.1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={onMediaPreviewCancel}
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  source={images.ic_cross}
                  style={{
                    tintColor: theme.colors.brandColor.silver,
                    height: theme.sizes.icons.xs,
                    width: theme.sizes.icons.xs,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              backgroundColor: '#f0f2f5',
              borderRadius: 12,
              paddingHorizontal: theme.normalize(8),
            }}>
            <TextInput
              autoFocus={false}
              focusable={true}
              ref={replyInputRef}
              placeholder={strings('PLACEHOLDER_REPLY')}
              placeholderTextColor={theme.colors.typography.silver}
              multiline
              onChangeText={updateMessageValue}
              value={messageToSend}
              style={[
                {
                  textAlignVertical: 'center',
                  color: theme.colors.black,
                  fontSize: theme.typography.fontSizes.md,
                  flex: 1,
                  // borderRadius: 12,
                  justifyContent: 'center',
                  fontFamily: theme.typography.fonts.circularStdBook,
                  maxHeight: 100,
                  minHeight: theme.normalize(35),
                  paddingVertical: theme.normalize(6),
                  // padding: theme.normalize(6),
                  lineHeight: theme.typography.lineHeights.md,
                  top: Platform.OS === 'android' ? 0 : 3,
                  // ...Platform.select({
                  //   ios: {lineHeight: 20, paddingBottom: 2, paddingTop: 13},
                  //   android: {lineHeight: 20},
                  // }),
                },
              ]}
            />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginEnd: theme.normalize(8),
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={showMenuOptions}
                style={
                  {
                    // justifyContent: 'flex-end',
                    // bottom: theme.normalize(Platform.OS === 'android' ? 11 : 5),
                  }
                }>
                <Image
                  source={images.ic_hamburger}
                  resizeMode="contain"
                  style={styles.sendMessageContainer.attachmentButton}
                />
              </TouchableOpacity>
              <View style={{width: theme.normalize(15)}} />
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={onSendPress}
                disabled={!messageToSend}
                style={
                  {
                    // justifyContent: 'flex-end',
                    // bottom: theme.normalize(Platform.OS === 'android' ? 11 : 5),
                  }
                }>
                <Image
                  source={images.ic_send}
                  resizeMode="contain"
                  style={[
                    styles.sendMessageContainer.attachmentButton,
                    {
                      tintColor: messageToSend
                        ? theme.colors.brandColor.blue
                        : undefined,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const renderItem = (item, msgType, itemWithAccountDetails, formResponse) => {
    // console.log("msgType----->",msgType)
    switch (msgType) {
      case 'file.response': {
        let files = userFileResponseElement(itemWithAccountDetails);
        return (
          <ChatFileResponse
            fileList={files}
            chatUserName={itemData?.title}
            itemWithAccountDetails={itemWithAccountDetails}
            onToggleImageModal={onToggleImageModal}
          />
        );
      }
      case 'status': {
        return (
          <ChatDateStampLabel
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
            loggedInUserId={userID}
          />
        );
      }
      case 'assigned': {
        return (
          <ChatDateStampLabel
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
            loggedInUserId={userID}
          />
        );
      }
      case 'phone':
      case 'text': {
        return (
          <ChatText
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
            onToggleImageModal={() => {}}
            chatUserName={itemData?.title}
          />
        );
      }
      case 'image': {
        return (
          <ChatImg
            chatItem={itemWithAccountDetails}
            onToggleImageModal={onToggleImageModal}
            onToggleImageModal123={e => console.log('00000')}
          />
        );
      }
      case 'document':
      case 'audio':
      case 'file': {
        return (
          <ChatText
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
          />
        );
      }
      case 'slider.response': {
        return (
          <ChatText
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
            textMsg={JSON.parse(itemWithAccountDetails.user.message.text)}
          />
        );
      }
      case 'note': {
        return (
          <ChatNote
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
            textMsg={itemWithAccountDetails.agent.note}
            onToggleImageModal={() => {}}
          />
        );
      }
      case 'slider': {
        return (
          <ChatSlider
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
          />
        );
      }
      case 'list': {
        return (
          <ChatListView
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
            // retainButtonListUponSelection={retainButtonListUponSelection}
          />
        );
      }
      case 'options': {
        return (
          <ChatOptionsButton
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
            // retainButtonListUponSelection={retainButtonListUponSelection}
          />
        );
      }
      case 'calendar': {
        return (
          <ChatCalendar
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
            textMsg={
              JSON.parse(itemWithAccountDetails.agent.message.text).title
            }
          />
        );
      }
      case 'form': {
        return (
          <ChatForm
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={formResponse ? formResponse : itemWithAccountDetails}
          />
        );
      }
      case 'cardview': {
        return (
          <ChatCardView
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
            slides={JSON.parse(itemWithAccountDetails.agent.message.text).items}
            avatar={itemWithAccountDetails.agent.avatar}
            onToggleImageModal={onToggleImageModal}
          />
        );
      }
      case 'appointment_booking': {
        return (
          <ChatAppointmentBooking
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
            avatar={itemWithAccountDetails.agent.avatar}
            onToggleImageModal={onToggleImageModal}
          />
        );
      }
      case 'video': {
        return (
          <ChatVideoView
            pos={
              itemWithAccountDetails.pos
                ? itemWithAccountDetails.pos
                : 'relative'
            }
            chatItem={itemWithAccountDetails}
          />
        );
      }
    }
  };
  const _renderSaveReplyView = () => {
    return (
      <Modal
        animationType="slide"
        visible={showSavedReply}
        style={{backgroundColor: 'black', margin: 0}}
        onBackButtonPress={onCloseSaveReply}
        statusBarTranslucent={false}>
        <SafeAreaView
          style={{flex: 1, backgroundColor: theme.colors.brandColor.FAFAFA}}>
          <View style={{overflow: 'hidden', paddingBottom: 1}}>
            <View style={styles.assigneeHeader}>
              <TouchableOpacity activeOpacity={0.5} onPress={onCloseSaveReply}>
                <Image
                  source={images.ic_cross}
                  resizeMode="contain"
                  style={styles.assigneeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Input
            containerStyle={{padding: 5, backgroundColor: 'white'}}
            computedLeftIcon={images.ic_search}
            isLeftIconElementVisible
            tintColor={theme.colors.brandColor.blue}
            placeholder={'Search'}
            onChangeText={onSearchSaveReply}
            value={searchSaveReply}
            leftIconDisabled
            returnKeyType="done"
            // onSubmitEditing={onSubmitEditing && onSubmitEditing}
          />
          {replyLoading ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator
                size="large"
                color={theme.colors.brandColor.blue}
              />
            </View>
          ) : (
            <FlatList
              stickyHeaderHiddenOnScroll={true}
              ListHeaderComponentStyle={{paddingVertical: theme.normalize(8)}}
              ref={listRef}
              contentContainerStyle={{backgroundColor: 'white', flexGrow: 1}}
              data={save_reply_list}
              renderItem={({item, index}) => (
                <ActionItem
                  label={
                    item?.title && item?.title.trim().length > 0
                      ? item?.title
                      : '-'
                  }
                  onItemPress={() => onSaveReplyClick && onSaveReplyClick(item)}
                  key={index}
                />
              )}
              style={{}}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                replyLoading ? null : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignSelf: 'center',
                      flexGrow: 1,
                    }}>
                    <Text>No saved replies found</Text>
                  </View>
                )
              }
              onEndReached={handleLoadMore1}
              maxToRenderPerBatch={10}
              scrollEventThrottle={16}
              onEndReachedThreshold={0}
              ListFooterComponent={
                <View style={{marginVertical: theme.sizes.spacing.pv}}>
                  {saveReplyLoadMore ? (
                    <ActivityIndicator
                      size="large"
                      color={theme.colors.brandColor.blue}
                    />
                  ) : null}
                </View>
              }
            />
          )}
        </SafeAreaView>

        {/* <View /> */}
      </Modal>
    );
  };

  return (
    <FlexContainer statusBarColor={theme.colors.brandColor.FAFAFA}>
      <Header
        isLeftIconHidden={false}
        centerElement={'userInput'}
        onPressMore={onPressMore}
        onPressInfo={onPressInfo}
        onPressLeftContent={onPressLeftContent}
        userItem={{
          hideStatus:
            itemData?.global_channel_name?.toLowerCase() !== 'web' || isClosed,
          name: itemData?.title,
          subTittle: getAddress(itemData),
          isOnline:
            itemData?.visitor_status === CONVERSATION.USER_STATUS.ONLINE,
        }}
        isMoreIconHidden={isClosed}
      />

      <KeyboardAvoidingView
        enabled
        style={{flex: 1}}
        keyboardVerticalOffset={
          Platform.OS === 'android'
            ? theme.normalize(!isKeyboardVisible ? 30 : -30)
            : theme.normalize(50)
        }
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
        <FlatList
          ref={listRef}
          data={messageHistory}
          renderItem={_renderItemView}
          keyExtractor={(item, index) =>
            item?.timestamp + String(messageHistory.length - index)
          }
          // ListHeaderComponent={_renderListHeaderView}
          extraData={messageList}
          style={{
            paddingHorizontal: theme.sizes.spacing.ph,
          }}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          // ListHeaderComponent={<View style={{height: 100}} />}
          ListFooterComponent={
            <View style={{marginTop: theme.sizes.spacing.pv}}>
              {isLoadMore ? (
                <ActivityIndicator
                  size="large"
                  color={theme.colors.brandColor.blue}
                />
              ) : null}
            </View>
          }
          inverted
          ListEmptyComponent={
            isLoading ? null : (
              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                  flexGrow: 1,
                }}>
                <Text>{strings('No conversation found')}</Text>
              </View>
            )
          }
          // maxToRenderPerBatch={35}
          // scrollEventThrottle={16}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
        <ChatTyping
          typingMsg={typingData}
          style={{paddingHorizontal: theme.sizes.spacing.ph, marginBottom: 5}}
        />
        {isLoading
          ? null
          : isClosed
          ? null
          : joinButton
          ? _renderJoinConversationView()
          : _renderInputTextView()}
      </KeyboardAvoidingView>

      <BottomSheet
        ref={moreInfoModalRef}
        height={theme.normalize(160)}
        closeOnDragDown
        customStyles={styles.bottomSheetContainer.mainContainer}>
        <ScrollView scrollEnabled={false}>
          <ActionItem
            label={strings('chat.change_assignee')}
            onItemPress={onChangeAssignee}
          />
          <ActionItem
            label={strings('chat.MARK_DONE')}
            onItemPress={onCloseConversation}
          />
        </ScrollView>
      </BottomSheet>
      <BottomSheet
        ref={attachmentBottomSheetRef}
        height={theme.normalize(180)}
        closeOnDragDown={false}
        customStyles={styles.bottomSheetContainer.mainContainer}>
        <ScrollView
          style={{flexGrow: 1}}
          contentContainerStyle={{paddingTop: 10}}>
          <ActionItem
            label={strings('chat.saved_reply')}
            onItemPress={onSavedReplyPress}
            leftIcon={
              <Image
                source={images.ic_save}
                resizeMode="contain"
                style={styles.bottomSheetContainer.actionItemIcon}
              />
            }
          />
          {/* <ActionItem
            label={strings('chat.calendar')}
            onItemPress={onCalendarPress}
            leftIcon={
              <Image
                source={images.ic_calendar}
                resizeMode="contain"
                style={styles.bottomSheetContainer.actionItemIcon}
              />
            }
          /> */}
          <ActionItem
            label={strings('chat.attachment')}
            onItemPress={onAttachmentsPress}
            leftIcon={
              <Image
                source={images.ic_attach}
                resizeMode="contain"
                style={styles.bottomSheetContainer.actionItemIcon}
              />
            }
          />
        </ScrollView>
      </BottomSheet>
      {_renderChangeAssigneeView()}
      {_renderSaveReplyView()}
      <ImageViewer
        modalShow={imageModalShow}
        modalImg={modalImg}
        onRequestClose={() => setImageModalShow(false)}
      />
      <Loader loading={isLoading} />
    </FlexContainer>
  );
};

export default forwardRef(ConversationComponent);
