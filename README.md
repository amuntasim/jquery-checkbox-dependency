jquery-checkbox-dependency
==========================

jQuery plugin that resolves checkbox dependency based on a predefined map(dependency dictionary)




Sample Usage
============

    $(function () {
      var selectedMessage = '____ selected.';
      var deselectedMessage = '____ deselected.';
      
      var pgRoleTitles = function(ids){
        ids = ( ids instanceof Array ) ? ids : [ids]
        var titles = [];
        $.each(ids, function(index, id){
          titles.push($('#' + id).parents('fieldset.inputs').find('legend span').html() + ' ' + $('#' +       id).next('span').find('label').html())
        });
        return titles.join(' | ');
      }
      
      $('.permission_group_roles').chkDependencyResolver({
      rolesGroupDependencyMap: {"allowance_heads":["branch_admin_home"],"markers":["branch_admin_home"],"front_desk":["front_desk_room_view|front_desk_all"],"hotel":["branch_admin_home"]},
      notifySelected: function (ids) {
        Message.showWarning(selectedMessage.replace('____', pgRoleTitles(ids)))
      },
      
      notifyDeselected: function (ids) {
        Message.showWarning(deselectedMessage .replace('____', pgRoleTitles(ids)))
      },
      notSelector: '[dependency-group=front_desk]'
      })
    }); 

