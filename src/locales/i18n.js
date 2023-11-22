import ReactNative from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import I18n from 'react-native-i18n';

import en from '../../languages/en.json';
import EN from '../../languages/en.json';
import ar from '../../languages/ar.json';
import AR from '../../languages/ar.json';
import de from '../../languages/de.json';
import DE from '../../languages/de.json';
import es from '../../languages/es.json';
import ES from '../../languages/es.json';
import fr from '../../languages/fr.json';
import FR from '../../languages/fr.json';
import pt from '../../languages/pt.json';
import PT from '../../languages/pt.json';

import {LOCAL_STORAGE} from '../constants/storage';

// Should the app fallback to English if user locale doesn't exists
I18n.defaultLocale = 'en';
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en,
  EN,
  ar,
  AR,
  de,
  DE,
  es,
  ES,
  fr,
  FR,
  pt,
  PT
};

// If language selected get locale
getUserPreferableLocale();

// Uncomment this for using RTL
//const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL = true; // currentLocale.indexOf('jaJp') === 0;

// Set locale
export async function setLocale(locale) {
  I18n.locale = locale;
  await AsyncStorage.setItem(LOCAL_STORAGE.LANGUAGE, locale);
}

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
  return I18n.t(name, params);
}

// Allow persist locale after app closed
async function getUserPreferableLocale() {
  const locale = await AsyncStorage.getItem(LOCAL_STORAGE.LANGUAGE);
  if (locale) {
    I18n.locale = locale;
  }
}

export default I18n;
