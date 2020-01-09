Ext.define('JefBox.phone.view.games.JoinView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.phoneGamesJoinView',

  viewModel: {
    data: {
      selectedGame: null,
      selectedTeam: null,
      saveBtnText: 'Join'
    },
    formulas: {
      gameAllowsTeams: function(get) {
        const selectedGame = get('selectedGame');
        return !Ext.isEmpty(selectedGame) && selectedGame.get('AllowTeams');
      },
      saveBtnDisabled: function(get) {
        return !get('selectedGame') || get('gameAllowsTeams') && !get('selectedTeam');
      }
    },
    stores: {
      gamesInProgressStore: {
        type: 'chained',
        source: JefBox.store.Games
      }
    }
  },

  title: 'Join Game',
  isCrudDialog: true,
  height: '50%',
  width: '100%',
  layout: {
    type: 'vbox'
  },
  items: [{
    xtype: 'combobox',
    label: 'Games In Progress',
    required: true,
    queryMode: 'local',
    valueField: 'Id',
    displayField: 'Name',
    store: JefBox.store.Games.getChainedStore([{
      property: 'Status',
      value: Enums.GameStatuses.RUNNING
    }]),
    bind: {
      selection: '{selectedGame}'
    }
  }, {
    xtype: 'combobox',
    label: 'Team',
    required: true,
    queryMode: 'local',
    valueField: 'Id',
    displayField: 'Name',
    store: JefBox.store.Teams,
    bind: {
      disabled: '{!gameAllowsTeams}',
      hidden: '{!gameAllowsTeams}',
      selection: '{selectedTeam}'
    }
  }],

  onClickSaveBtn: function() {
    const me = this;
    const viewModel = me.getViewModel();
    this.clickedSave = true;
    if (viewModel) {
      UserProfile.joinGame({
        gameId: viewModel.get('selectedGame.Id'),
        teamId: viewModel.get('selectedTeam.Id'),
        callback: function() {

        }
      });
    }
  }
});