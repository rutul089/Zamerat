//Lib
import React, {useMemo} from 'react';
import {View} from 'react-native';
import {Text} from '../../../../../components';
import ChatMsgInfo from '../ChatMsgInfo';
import {
  getTimeStamp,
  unEscape,
} from '../../../../../util/ConversationListHelper';
import {styles as chatBubbleStyle} from '../ChatStyle/chatBubbleStyle';
import RenderHTML from 'react-native-render-html';

function ChatCalendar(props) {
  return useMemo(
    () => (
      <View style={chatBubbleStyle.bubbleWrapper}>
        <View style={chatBubbleStyle.bubbleContainer}>
          <Text
            type={'body2'}
            style={chatBubbleStyle.textStyle}
            color={'white'}>
            {unEscape(props.textMsg)}
          </Text>
        </View>
        <ChatMsgInfo
          timeStampRight
          time={getTimeStamp(props.chatItem.agent.timestamp).timestamp}
          userData={props.chatItem}
        />
      </View>
    ),
    [props.chatItem, props.pos],
  );
}

export default ChatCalendar;
