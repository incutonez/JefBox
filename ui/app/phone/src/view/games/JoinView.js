Ext.define('JefBox.phone.view.games.JoinView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.phoneGamesJoinView',
  requires: [
    'JefBox.phone.view.games.RoundView'
  ],

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
    }
  },

  title: 'Join Game',
  isCrudDialog: true,
  width: '100%',
  height: '100%',
  defaultListenerScope: true,
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
    valueField: 'Name',
    displayField: 'Name',
    store: JefBox.store.Teams,
    bind: {
      disabled: '{!gameAllowsTeams}',
      hidden: '{!gameAllowsTeams}',
      selection: '{selectedTeam}'
    },
    listeners: {
      keydown: 'onKeyDownTeamField'
    }
  }],

  joinGame: function() {
    const me = this;
    const viewModel = me.getViewModel();
    me.clickedSave = true;
    if (viewModel) {
      const gameId = viewModel.get('selectedGame.Id');
      me.setLoading(true);
      UserProfile.joinGame({
        gameId: gameId,
        teamId: viewModel.get('selectedTeam.Id'),
        teamName: viewModel.get('selectedTeam.Name'),
        callback: function(successful, response) {
          if (successful) {
            Routes.redirectTo(Routes.parseRoute(Schemas.Games.BASE_PATH_ID_UI, {Id: gameId}));
          }
          me.setLoading(false);
        }
      });
    }
  },

  onClickSaveBtn: function() {
    this.joinGame();
  },

  onKeyDownTeamField: function(field, event, eOpts) {
    if (event.isEnterKey()) {
      this.joinGame();
    }
  }
});