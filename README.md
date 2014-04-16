jquery-checkbox-dependency
==========================

jQuery plugin that resolves checkbox dependency based on a predefined map(dependency dictionary)




Usage
======

use dependency-group attribute in your check boxes.

You have to have a dependency dictionary.

for example:

 you have a check box foo and your requirement is to check foo it must have other two check boxes (ids are 'bar', 'dum') checked. To achieve that you will have have the following check boxes.
 
     <input type="checkbox" id="bar"> Bar
     <input type="checkbox" id="dum"> Dum
     <input type="checkbox" id="foo" dependency-group="foo"> Foo
     

JS

    $(function () {
      
      
      $('.permission_group_roles').chkDependencyResolver({
      rolesGroupDependencyMap: {"foo":["bar,dum"]},
      notifySelected: function (ids) {
        //render message
      },
      
      notifyDeselected: function (ids) {
        //render message
      },
      notSelector: '[dependency-group=front_desk]'
      })
    }); 

