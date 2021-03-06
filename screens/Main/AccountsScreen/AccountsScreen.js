import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Alert } from 'react-native';
import { Icon } from 'expo';
import {
  Appbar,
  Text,
  Button,
  TouchableRipple,
  Caption
} from 'react-native-paper';

import { ScrollView, BackgroundView } from '../../../components/View';

import { Theme } from '../../../constants';
import Chains from '../../../constants/Chains';
import { AccountEmptyState } from '../AccountScreen';

@inject('accountStore', 'networkStore')
@observer
export class AccountsScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  changeAccount = (accoundId, chainId) => {
    this.props.accountStore.changeCurrentAccount(accoundId, chainId);
    this.moveScreen('Account');
  };

  confirmRemoveAccount = accoundId => {
    Alert.alert(
      'Confirm Remove Account',
      'Are you sure you want to remove account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => this.removeAccount(accoundId) }
      ]
    );
  };

  removeAccount = accoundId => {
    const { navigation, accountStore } = this.props;

    navigation.navigate('ConfirmPin', {
      pinProps: {
        description: 'Confirm password to remove account.'
      },
      cb: async () => {
        accountStore.removeAccount(accoundId);
      }
    });
  };

  render() {
    const { accountStore, navigation } = this.props;
    const { accounts, currentAccount } = accountStore;

    return (
      <BackgroundView>
        <Appbar.Header
          style={{ backgroundColor: Theme.header.backgroundColor }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack(null)} />
          <Appbar.Content title="Accounts" />
        </Appbar.Header>

        {!accounts.length ? (
          <AccountEmptyState />
        ) : (
          <React.Fragment>
            <ScrollView>
              {accounts.map(({ id, name, chainId }) => (
                <TouchableRipple
                  key={id}
                  style={{
                    paddingHorizontal: Theme.innerPadding,
                    paddingVertical: 15
                  }}
                  onPress={() => this.changeAccount(id, chainId)}
                  onLongPress={() => this.confirmRemoveAccount(id)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text>{name}</Text>
                      <Caption>
                        {Chains.find(({ id }) => id === chainId).name}
                      </Caption>
                    </View>
                    {currentAccount &&
                      name === currentAccount.name &&
                      chainId === currentAccount.chainId && (
                        <Icon.Ionicons
                          name="md-checkmark"
                          color={Theme.palette.primary}
                          size={25}
                        />
                      )}
                  </View>
                </TouchableRipple>
              ))}
            </ScrollView>

            <Button
              style={{ margin: 20, padding: 5 }}
              mode="contained"
              onPress={() => this.moveScreen('ImportAccount')}
            >
              Import account
            </Button>
          </React.Fragment>
        )}
      </BackgroundView>
    );
  }
}
