import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {
  goBack,
  navigate,
  navigateAndSimpleReset,
} from '../../../navigator/NavigationUtils';
import TwoFactorCheckComponent from '../component/TwoFactorCheckComponent';
import {
  twoFactorCode,
  verifyTFAOTP,
  fetchUserPreference,
  fetchAccounts,
} from '../../../store/actions';
import {handleFailureCallback} from '../../../util/apiHelper';
import {setLocale, strings} from '../../../locales/i18n';
import {LOCAL_STORAGE} from '../../../constants/storage';
import AsyncStorage from '@react-native-community/async-storage';
import {
  getItemFromStorage,
  setItemToStorage,
} from '../../../util/DeviceStorageOperations';

class TwoFactorCheckContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyCode: '',
      qr_code: '',
      isErrOTP: false,
      errOTP: '',
    };
  }

  componentDidMount() {}

  onPressLeftContent = () => {
    goBack();
  };

  onVerifyCodeChange = text => {
    this.setState({
      verifyCode: text,
      errOTP: '',
    });
  };

  onVerifyCodePress = () => {
    const {verifyCode} = this.state;
    if (verifyCode === '' || verifyCode === null) {
      this.setState({
        errOTP: strings('error.2FA_SETUP_SCREEN_SETUP_CODE_INPUT_ERROR'),
      });
      return;
    }

    if (verifyCode && verifyCode.length < 6) {
      this.setState({
        errOTP: strings('error.2FA_SETUP_SCREEN_SETUP_CODE_INPUT_LENGTH_ERROR'),
      });
      return;
    }

    let param = {
      totp: verifyCode,
    };
    this.props.verifyTFAOTP(param, {
      SuccessCallback: res => {
        if (res?.ok) {
          this.apiFetchUserPreference();
        }
      },
      FailureCallback: res => {
        handleFailureCallback(res, true, true, true);
      },
    });
  };

  recoveryCodeBtnPress = () => {
    navigate('RecoveryCodeScreen');
  };

  apiFetchUserPreference = () => {
    this.props.fetchUserPreference(null, {
      SuccessCallback: res => {
        AsyncStorage.setItem(
          LOCAL_STORAGE.USER_PREFERENCE,
          JSON.stringify(res),
        );
        AsyncStorage.setItem(LOCAL_STORAGE.IS_LOGIN, 'true');
        setLocale(res?.language?.code)

        this.cllFetchAccounts()
          .then(data => {
            navigateAndSimpleReset('MainNavigator');
          })
          .catch(() => {
          });
      },
      FailureCallback: res => {
        handleFailureCallback(res);
      },
    });
  };

  cllFetchAccounts = () => {
    return new Promise((resolve, reject) => {
      this.props.fetchAccounts({
        SuccessCallback: async res => {
          await setItemToStorage(
            LOCAL_STORAGE?.AGENT_ACCOUNT_LIST,
            res?.account_info,
          );
          resolve(
            getItemFromStorage(LOCAL_STORAGE?.AGENT_ACCOUNT_LIST) ?? undefined,
          );
        },
        FailureCallback: res => {
          handleFailureCallback(res, false, false, false);
          reject(res);
        },
      });
    });
  };

  render() {
    let state = this.state;
    return (
      <>
        <TwoFactorCheckComponent
          onPressLeftContent={this.onPressLeftContent}
          onVerifyCodeChange={this.onVerifyCodeChange}
          onSubmitVerifyCode={this.onVerifyCodePress}
          state={state}
          onSubmit={this.onVerifyCodePress}
          recoveryCodeBtnPress={this.recoveryCodeBtnPress}
          tittle={strings('login.2FA_TOTP_SCREEN_HEADING')}
          tittle2={strings('login.2FA_TOTP_SCREEN_SUB_HEADING', {
            ORGANISATION_NAME:strings('orgName'),
          })}
          inputLabel={strings('login.2FA_TOTP_SCREEN_CODE_INPUT')}
          btnLabel={strings('button.RECOVERY_SCREEN_VERIFY_BTN_TEXT')}
          showRecoveryLabel={true}
          isLoading={this.props.isLoading}
        />
      </>
    );
  }
}

const mapActionCreators = {
  twoFactorCode,
  verifyTFAOTP,
  fetchUserPreference,
  fetchAccounts,
};
const mapStateToProps = state => {
  return {
    isLoading: state.global.loading,
  };
};
export default connect(
  mapStateToProps,
  mapActionCreators,
)(TwoFactorCheckContainer);
