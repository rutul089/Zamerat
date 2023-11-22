import React, {Component} from 'react';
import {connect} from 'react-redux';
import {API, Headers} from '../../../apiService';
import {LOCAL_STORAGE} from '../../../constants/storage';
import {setLocale, strings} from '../../../locales/i18n';
import {
  navigate,
  navigateAndSimpleReset,
} from '../../../navigator/NavigationUtils';
import {
  fetchAccounts,
  fetchUserPreference,
  userLogin,
} from '../../../store/actions';
import {
  getItemFromStorage,
  setItemToStorage,
} from '../../../util/DeviceStorageOperations';
import {handleFailureCallback} from '../../../util/apiHelper';
import {VALIDATION_REGEX} from '../../../util/helper';
import SignInScreenComponent from '../component/SignInScreenComponent';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

class SignInScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isErrEmail: false,
      isErrPwd: false,
      isPwdVisible: false,
      emailErrMsg: '',
      pwdErrMsg: '',
      isLoading: false,
    };
    this.emailInputRef = React.createRef();
    this.passWordInputRef = React.createRef();
    this.scrollViewRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId:
        '386340205536-97h70dpce42jbg0hofb8f13ho6gsfdo3.apps.googleusercontent.com',

      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }

  onEmailChange = text => {
    this.setState({email: text, emailErrMsg: ''});
  };

  onPwdChange = text => {
    this.setState({password: text, pwdErrMsg: ''});
    this.scrollViewRef?.current?.scrollToEnd({animated: true});
  };

  rightIconClick = () => {
    this.setState({isPwdVisible: !this.state.isPwdVisible});
  };

  onSubmit = () => {
    API.getInstance().setHeaders([
      {
        key: 'app_version',
        value: '1.0.1',
      },
    ]);

    let state = this.state;
    if (this.isValidEmail() && this.isValidPassword()) {
      this.setState({
        emailErrMsg: strings('error.EMAIL_VALIDATION_MESSAGE'),
        pwdErrMsg: strings('error.PASSWORD_VALIDATION_MESSAGE'),
      });
      return;
    }
    if (this.isValidEmail()) {
      this.setState({
        emailErrMsg: strings('error.EMAIL_VALIDATION_MESSAGE'),
      });
      return;
    }

    if (this.isValidPassword()) {
      this.setState({
        pwdErrMsg: strings('error.PASSWORD_VALIDATION_MESSAGE'),
      });
      return;
    }
    let param = {
      email: state.email?.toLocaleLowerCase(),
      password: state.password,
    };
    this.setLoading(true);
    this.props.userLogin(param, {
      SuccessCallback: res => {
        if (res?.ok && res?.two_factor_auth === undefined) {
          setItemToStorage(LOCAL_STORAGE?.IS_LOGIN, 'true');
          this.callFetchUserPreference();
          return;
        }
        setItemToStorage(LOCAL_STORAGE?.AUTH_TOKEN, res?.access_token);
        API.getInstance().setHeader(
          Headers.AUTHORIZATION,
          `Bearer ${res?.access_token}`,
        );
        if (res?.two_factor_auth === 'QR_CODE') {
          this.setLoading(false);
          return navigate('TwoFactorAuthScreen');
        } else if (res?.two_factor_auth === 'TOTP_VERIFY') {
          this.setLoading(false);
          return navigate('TwoFactorCheckScreen');
        } else {
          setItemToStorage(LOCAL_STORAGE?.IS_LOGIN, 'true');
          this.callFetchUserPreference();
        }
      },
      FailureCallback: res => {
        this.setLoading(false);
        handleFailureCallback(res, true, true);
      },
    });

    // navigate('MainNavigator');
  };

  isValidEmail = () => {
    let state = this.state;
    return !(state.email && VALIDATION_REGEX.email.test(state.email));
  };

  isValidPassword = () => {
    let state = this.state;
    return !(
      state.password &&
      state.password.length > 5 &&
      !VALIDATION_REGEX.hasEmoji.test(state.password)
    );
  };

  onForgotPwdClick = () => {
    navigate('ForgotPasswordScreen');
    // navigate('TwoFactorAuthScreen')
  };

  _googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing in');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.log(
          'Some other error happened',
          error.message + ' ' + error.code,
        );
      }
    }
  };

  callFetchUserPreference = async () => {
    this.props.fetchUserPreference(null, {
      SuccessCallback: async res => {
        setItemToStorage(LOCAL_STORAGE?.USER_PREFERENCE, res);
        setLocale(res?.language?.code);
        this.cllFetchAccounts()
          .then(data => {
            this.setLoading(false);
            if (data) {
              navigateAndSimpleReset('MainNavigator');
            } else {
              console.log('Something went wrong');
            }
          })
          .catch(() => {
            console.log('Something went wrong');
          });
      },
      FailureCallback: res => {
        this.setLoading(false);
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
          this.setLoading(false);
          handleFailureCallback(res, false, false, false);
          reject(res);
        },
      });
    });
  };

  setLoading = value => {
    this.setState({isLoading: value});
  };

  render() {
    let state = this.state;
    return (
      <>
        <SignInScreenComponent
          state={this.state}
          onEmailChange={this.onEmailChange}
          onPwdChange={this.onPwdChange}
          emailInputRef={this.emailInputRef}
          passWordInputRef={this.passWordInputRef}
          onSubmitEditingEmail={() => {
            this.passWordInputRef?.current?.focus(),
              this.scrollViewRef?.current?.scrollToEnd({animated: true});
          }}
          isPwdVisible={state.isPwdVisible}
          rightIconClick={this.rightIconClick}
          onSubmit={this.onSubmit}
          scrollViewRef={this.scrollViewRef}
          isLoading={this.state.isLoading}
          onForgotPwdClick={this.onForgotPwdClick}
          _googleSignIn={this._googleSignIn}
        />
      </>
    );
  }
}

const mapActionCreators = {
  userLogin,
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
)(SignInScreenContainer);
