const purplePayBlue = {
  blue: '#006E96',
  darkBlue: '#0B3471',
  deepDarkBlue: '#0C3471',
  brightBlue: '#008ABC',
  lightBlue: '#F0F8FE',
  darkestBlue: '#1a5064',
  lightestBlue: '#cbe8f2',
  skyBlue: '#76BED8',
  primaryDark: '#1F1D35',
};

const wotnotColor = {
  blue: '#00c8fa',
  // blue: '#00c8fa',
  darkestBlue: '#1a5064',
  lightestBlue: '#cbe8f2',
  skyBlue: '#76BED8',
  FAFAFA: '#F4F4F4',
  green: '#00B600',
  silver: '#858585',
  lightGreen: '#13BE66',
  yellow: '#F1B000',
  borderColor: '#DCDCDC',
  lavenderBlue: '#BEDBFC',
  lightBlue: '#2a7cff29',
  visitorAvatarColor: '#f5f5f5',
};

const gray = {
  lightGray: '#BFC1C4',
  gray: '#EBEBEB',
  darkGray: '#9A9A9A',
  gray1: '#AFAFAF',
  darkGray: '#2D2D2D',
  gray2: '#9B9B9B',
  gray3: '#D2D2D2',
};

const typography = {
  dark: '#101010',
  secondary: '#858585',
  placeHolder: '#DDDDDD',
  secondaryLight: 'rgba(130, 130, 130, 0.7)',
  white: '#ffffff',
  black: '#000000',
  light: '#CCCCCC',
  gray1: gray.gray1,
  darkGray: gray.darkGray,
  error: '#FF0000',
  blue1: '#EBDAFF',
  blue2: '#B7A5CD',
  _475569: '#475569',
  link: '#2A7CFF',
  silver: '#858585',
};

const pentairBlue = {
  blue: '#006E96',
  darkBlue: '#0B3471',
  deepDarkBlue: '#0C3471',
  brightBlue: '#008ABC',
  lightBlue: '#F0F8FE',
  darkestBlue: '#1a5064',
  lightestBlue: '#cbe8f2',
  skyBlue: '#76BED8',
};

const colors = {
  // Singleton colors
  white: '#FFFFFF',
  black: '#000000',
  buttonColor: '#1F1D35',
  // Primary colors
  brandColor: {
    ...purplePayBlue,
    ...wotnotColor,
  },
  card: {
    background: '#F4F4F4',
    shadow: gray.gray,
  },
  borderColor: '#EEEFF3',
  focusBorderColor: '#DDDDDD',
  typography,
  gray,
  drawerActive: '#141322',
  drawerInActive: '#1F1D35',
  334155: '#334155',
  F0F0F0: '#F0F0F0',
  pentair: {
    ...pentairBlue,
  },
  white: '#ffffff',
  red: '#ff0000',
  clear_blue: '#166ffe',
  cool_blue: '#2a7cff',
  light_clear_blue: '#bedbfc',
  blue: '#23527c',
  charcoal_grey: '#2d2f39',
  pale_grey: '#e8e9ef',
  cool_grey: '#afb2b3',
  bluish_grey: '#828d93',
  black: '#000000',
  green: '#13BE66',
  background_grey: '#F4F5F6',
  right_arrow: '#A5ACB7',
  setting_text_subtitle: '#697387',
  notification_button_color: '#0366FF',
  switch_color: '#0366FE',
  dragable_icon_color: '#E4E4E8',
  checkbox_color: '#0766FE',
  yellow: '#faa404',
  bubbleBackgroundColor: '#00c8fa',
};

export default colors;
