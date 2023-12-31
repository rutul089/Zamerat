import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {
  FlexContainer,
  Header,
  Spacing,
  SwitchToggle,
  Text,
  UserItem,
  ChatItem,
} from '../../../components';
import theme from '../../../util/theme';
import images from '../../../assets/images';
import {styles as textStyle} from '../../../components/Text/style';
import {Tab, TabView} from '@rneui/themed';
import YouTab from '../container/YouTab';
import ConversationListTab from '../container/ConversationListTab';
import {useSelector} from 'react-redux';
import styles from '../Style';
import {CONVERSATION} from '../../../constants/global';
import {getDayDifference, getMiniFromTime, showSLA} from '../../../util/helper';
// import {isValidJSON,getMessage} from '../../../util/JSONOperations';
import {
  getMessage,
  messageParser,
  convertTextMessage,
  unEscape,
  getGlobalChannelIcon,
  getAssigneeName,
  getAddress,
} from '../../../util/ConversationListHelper';
import {Box} from 'native-base';
import {registerVisitorTypingHandler} from '../../../websocket';
import {contains} from 'react-native-redash';
import {strings} from '../../../locales/i18n';

const renderTabView = (label, onPress, isSelected, isDisable) => {
  return (
    <TouchableOpacity
      disabled={isDisable}
      style={
        isSelected ? styles.selectedTanContainerStyle : styles.tabContainerStyle
      }
      onPress={onPress}>
      <Text
        textAlign={'center'}
        type={'body2'}
        color={
          isSelected
            ? theme.colors.typography.link
            : theme.colors.typography.black
        }>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const ChatScreenComponent = ({
  currentTab,
  onSelectTab,
  tabValues,
  open_status,
  onSearchClick,
  navigation,
  conversations,
  isLoading,
  onConversationClick = () => {},
  onRefresh = () => {},
  isRefreshing,
  moreLoading,
  loadMoreData = () => {},
  onEndReach,
  isTyping,
  isSLAEnable,
  slaTime,
  users,
  slaDurationInMs,
}) => {
  const [index, setIndex] = React.useState(0);
  const [typingData, setTypingData] = React.useState();
  const [percentage, setPercentage] = React.useState();
  const [showErr, setErr] = React.useState(false);
  const conversation_summary = useSelector(
    state => state.conversationReducer?.conversation_summary?.open_status,
  );
  const close_conversation_count = useSelector(
    state => state.conversationReducer?.closeConversationsCount,
  );
  const tabLabels = [
    strings('tab.You'),
    strings('tab.Assigned'),
    strings('tab.Unassigned'),
    strings('tab.Closed'),
  ];
  let tickerInterval = null;

  const animationRef = React.createRef();
  React.useEffect(() => {
    registerVisitorTypingHandler(e => {
      setTypingData(e);
    });
  });

  const getSalTime = (itemData, currentTab, slaTime, isSLAEnable) => {
    // console.log('------', showSLA(itemData?.sla_start_at, slaTime));
    if (
      currentTab === CONVERSATION.CLOSE ||
      !isSLAEnable ||
      itemData?.sla_start_at === null
    ) {
      return true;
    }
    return !showSLA(itemData?.sla_start_at, slaTime);
  };

  const showSlaEnd = (itemData, currentTab, slaTime, isSLAEnable) => {
    if (
      currentTab === CONVERSATION.CLOSE ||
      !isSLAEnable ||
      itemData?.sla_start_at === null
    ) {
      return true;
    }

    return showSLA(itemData?.sla_start_at, slaTime);
  };

  const getPrefillValue = (itemData, slaTime) => {
    let currentMin = getMiniFromTime(itemData?.sla_start_at);
    let percentage = (100 * currentMin) / slaTime;
    setPercentage(percentage);
    // console.log('percentage', percentage);
    return percentage;
  };

  React.useEffect(() => {
    animationRef?.current?.animate(percentage);
  }, percentage);

  const getListItemCustomization = item => {
    const date = item?.sla_start_at ? new Date(item?.sla_start_at) : new Date();
    let lastMessageAt = '';
    const checkLastMessageBy =
      !item?.last_message_by || checkForUser(item?.last_message_by);

    if (
      item.status_id !== 2 &&
      (!item?.assignee || (item?.assignee && item?.assignee?.type_id !== 2)) &&
      checkLastMessageBy
    ) {
      lastMessageAt = date;
    }

    return {
      ...item,
      lastMessageAt,
    };
  };

  const checkForUser = id => {
    let value = '';
    users?.forEach(element => {
      value = element?.id === id ? element?.user_type?.id === 2 : false;
    });
    return value;
  };

  const renderList = ({item, index}) => {
    const customization = getListItemCustomization(item);
    return (
      <ChatItem
        key={item?.assignee?.id}
        name={item?.title}
        // email={`${item?.assignee?.name ? item?.assignee?.name + ' | ' : ''}${
        //   item?.city_name
        // },${item?.country_name}`}
        email={getAddress(item)}
        uri={item?.assignee?.image_url}
        isOnline={item?.visitor_status === CONVERSATION.USER_STATUS.ONLINE}
        unreadCount={item?.unread_messages_count}
        lastMessageDay={getDayDifference(item?.last_message_at)}
        subTittle={
          item?.message === ''
            ? unEscape(item?.note)
            : `${
                item?.last_message_by === 0
                  ? ''
                  : item?.conversation_mode === 'BOT' &&
                    item?.closed_by?.first_name !== 'System'
                  ? '<b>Bot: </b>'
                  : getAssigneeName(users, item?.last_message_by)
              }${getMessage(item)}`
        }
        onPress={() => onConversationClick(item)}
        item={item}
        isClosedMode={item?.status_id === 2}
        rating={item?.rating}
        hideRating={
          currentTab !== CONVERSATION.CLOSE ||
          item?.global_channel_name !== 'Web' ||
          item?.rating === 0
        }
        hideUnreadCount={
          currentTab === CONVERSATION.CLOSE || item?.unread_messages_count == 0
        }
        hideStatusIcon={
          currentTab === CONVERSATION.CLOSE ||
          item?.global_channel_name?.toLowerCase() !== 'web'
        }
        paddingHorizontal={theme.sizes.spacing.ph}
        backgroundColor={'white'}
        duration={slaTime}
        itemData={item}
        borderBottomWidth={1}
        isLoading={isLoading}
        typingData={typingData}
        channelIcon={getGlobalChannelIcon(
          item?.global_channel_name,
          item?.browser,
        )}
        hideSlaErr={
          !(percentage >= 100) ||
          showSlaEnd(item, currentTab, slaTime, isSLAEnable) ||
          customization?.lastMessageAt === ''
        }
        prefill={getPrefillValue(item, slaTime)}
        animation={animationRef}
        onAnimationComplete={() => setErr(true)}
        // comparisonTime={customization?.lastMessageAt}
        comparisonTime={customization?.lastMessageAt}
        slaDurationInMs={slaDurationInMs}
        hideAnimation={customization?.lastMessageAt === ''}
        shouldNotUpdate={
          getMiniFromTime(customization?.lastMessageAt) > slaDurationInMs
        }
      />
    );
  };

  return (
    <FlexContainer statusBarColor={theme.colors.brandColor.FAFAFA}>
      <Header
        isLeftIconHidden={true}
        rightIcon={
          <View style={{flexDirection: 'row'}}>
            <Spacing size="md" direction="x" />
            <TouchableOpacity onPress={onSearchClick} style={{}}>
              <Image
                source={images.ic_search}
                style={{
                  height: theme.sizes.icons.lg,
                  width: theme.sizes.icons.lg,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
        }
      />
      <View
        style={{
          height: theme.normalize(36),
          backgroundColor: theme.colors.brandColor.FAFAFA,
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderTabView(
            `(${conversation_summary?.you}) ${tabLabels[0]}`,
            () => onSelectTab(CONVERSATION.YOU),
            currentTab === CONVERSATION.YOU,
            isLoading,
          )}
          {renderTabView(
            `(${conversation_summary?.assigned}) ${tabLabels[1]}`,
            () => onSelectTab(CONVERSATION.ASSIGNED),
            currentTab === CONVERSATION.ASSIGNED,
            isLoading,
          )}
          {renderTabView(
            `(${conversation_summary?.unassigned}) ${tabLabels[2]}`,
            () => onSelectTab(CONVERSATION.UNASSIGNED),
            currentTab === CONVERSATION.UNASSIGNED,
            isLoading,
          )}
          {renderTabView(
            `${tabLabels[3]}`,
            () => onSelectTab(CONVERSATION.CLOSE),
            currentTab === CONVERSATION.CLOSE,
            isLoading,
          )}
        </ScrollView>
      </View>
      <SafeAreaView flex={1}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.brandColor.blue}
            style={{alignSelf: 'center', flex: 1}}
          />
        ) : (
          <FlatList
            data={conversations}
            renderItem={renderList}
            keyExtractor={(_it, index) => `${_it?.thread_key} ${index}`}
            contentContainerStyle={{
              flexGrow: 1,
              // paddingVertical: 5,
              // padding: theme.sizes.spacing.ph,
            }}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text color={theme.colors.brandColor.silver}>
                  {strings('No conversation found')}
                </Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.brandColor.blue]}
              />
            }
            onEndReached={({distanceFromEnd}) => onEndReach(distanceFromEnd)}
            // onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter(moreLoading)}
            maxToRenderPerBatch={16}
            scrollEventThrottle={16}
            onEndReachedThreshold={0.9}
          />
        )}
      </SafeAreaView>
    </FlexContainer>
  );
};

const renderFooter = moreLoading => {
  return moreLoading ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
      }}>
      <ActivityIndicator color={theme.colors.brandColor.blue} />
    </View>
  ) : (
    <></>
  );
};

export default ChatScreenComponent;
