Ext.define('JefBox.phone.view.games.JoinView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.phoneGamesJoinView',

  viewModel: {
    data: {
      selectedGame: null,
      selectedTeam: null
    },
    formulas: {
      saveBtnDisabled: function(get) {
        return !get('selectedGame') || !get('selectedTeam');
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
  height: '100%',
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
    label: 'Teams',
    required: true,
    queryMode: 'local',
    valueField: 'Id',
    displayField: 'Name',
    store: JefBox.store.Teams,
    bind: {
      selection: '{selectedTeam}'
    }
  }],

  onClickSaveBtn: function() {
    let me = this;
    let viewModel = me.getViewModel();
    this.clickedSave = true;
    if (viewModel) {
      let selectedTeam = viewModel.get('selectedTeam');
      let selectedTeamUsers = selectedTeam && selectedTeam.getUsersStore();
      if (selectedTeamUsers) {
        let found = selectedTeamUsers.findRecord('Id', UserProfile.getId(), 0, false, true, true);
        if (!found) {
          selectedTeamUsers.add(UserProfile);
          selectedTeam.save({
            callback: function(record, operation, success) {
              if (success) {
                me.addTeamToGame(selectedTeam);
              }
            }
          });
        }
        else {
          me.addTeamToGame(selectedTeam);
        }
      }
    }
  },

  addTeamToGame: function(teamRecord) {
    let me = this;
    let viewModel = me.getViewModel();
    let selectedGame = viewModel && viewModel.get('selectedGame');
    let selectedGameTeams = selectedGame && selectedGame.getTeamsStore();
    if (selectedGameTeams && teamRecord) {
      let found = selectedGameTeams.findRecord('Id', teamRecord.getId(), 0, false, true, true);
      if (!found) {
        selectedGameTeams.add(teamRecord);
        selectedGame.save({
          callback: function(record, operation, success) {
            if (success) {
              me.close();
            }
          }
        });
      }
      else {
        me.close();
      }
    }
  }
});