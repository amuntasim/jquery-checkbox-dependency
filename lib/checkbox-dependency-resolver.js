;
(function ($) {
    $.fn.chkDependencyResolver = function (options) {
        var settings = $.extend({
            notSelector: ''
        }, options);

        var parentReferenceHash = {};

        return this.each(function () {
            var $this = $(this);


            $this.find("input:checkbox").not(settings.notSelector).change(function () {
                if (!$(this).is(':checked')) {
//                    it will resolve if parent is unchecked. It will uncheck the dependants
                    resolveReverseDependency(this);
                    clearParentReference(this);

                }
                else {
                    //                    it will check the required roles
                    resolveForwardDependency(this);
//                    it will undo the unselected roles when the parent is reverted
                    selectSelectableDependants(this);
                }
            });

        })

        function checkAndShowWarning(id) {
            $('#' + id).attr('checked', true);
            if(typeof settings.notifySelected == 'function'){
                settings.notifySelected.call(this, id);
            }
        }

        function selectSelectableDependants(obj) {
            var selectableIds = $(obj).attr('selectable_role_ids') ? $(obj).attr('selectable_role_ids').split(',') : [];
            if (selectableIds.length > 0) {
                $.each(selectableIds, function (index, id) {
                    $('#' + id).attr('checked', true);
                })
            }
        }

        function storeParentReference(parent_id, child_id) {
            parentReferenceHash[parent_id] = parentReferenceHash[parent_id] || [];

            if ($.inArray(child_id, parentReferenceHash[parent_id]) < 0)
                parentReferenceHash[parent_id].push(child_id);
        }

        function clearParentReference(obj) {
            var dependencyGroup = $(obj).attr('dependency-group')
            var dependables = [];
            $.each(settings.rolesGroupDependencyMap[dependencyGroup], function (index, v) {
                dependables = $.merge(v.split('|'), dependables);
            });

            $.each(dependables, function (index, parent_id) {
                var refArray = parentReferenceHash[parent_id];
                if (refArray && $.inArray(obj.id, refArray) >= 0) {
                    parentReferenceHash[parent_id].splice($.inArray(obj.id, refArray), 1)

                    if (parentReferenceHash[parent_id].length == 0) {
                        $('#' + parent_id).attr('checked', false);
                        $('#' + parent_id).removeAttr('selectable_role_ids');

                        if(typeof settings.notifyDeselected == 'function'){
                            settings.notifyDeselected.call(this, parent_id);
                        }
                    }
                }

            });


        }


        function resolveForwardDependency(obj) {
            var $obj_id = $(obj).attr('id');
            var dependencyGroup = $(obj).attr('dependency-group')
            $.each(settings.rolesGroupDependencyMap[dependencyGroup], function (index, v) {
                var orDependencies = v.split('|');
                if (orDependencies.length > 1) {
                    var orDependencyChecked = false;
                    $.each(orDependencies, function (index, dependency) {
                        if ($('#' + dependency).is(':checked')) {
                            orDependencyChecked = true;
                            if (parentReferenceHash[dependency])
                                storeParentReference(dependency, $obj_id);
                            //#return false;
                        }
                    });
                    if (!orDependencyChecked) {
                        //if no sibling is checked, then check the last required role
                        checkAndShowWarning(orDependencies[0]);
                        storeParentReference(orDependencies[0], $obj_id);
                    }
                }
                else if (!$('#' + v).is(':checked')) {
                    //check the  required role
                    checkAndShowWarning(v);
                    storeParentReference(v, $obj_id);
                }
                else if (parentReferenceHash[v])
                    storeParentReference(v, $obj_id);

            });
        }

        function resolveReverseDependency(obj) {
            var dependencyGroup = $(obj).attr('dependency-group');
            var objectId = $(obj).attr('id');
            var dependantIds = [];

            $.each(settings.rolesGroupDependencyMap, function (key, dependencies) {
                var dependencySiblingChecked = false;
                var groupFound = false;
                var dependencySiblings = [];
                $.each(dependencies, function (index, v) {
                    var orDependencies = v.split('|');
                    if (orDependencies.length > 1) {
                        $.each(orDependencies, function (key, dependencyId) {
                            if (objectId == dependencyId) {
                                groupFound = true;
                            }
                            else {
                                dependencySiblings.push(dependencyId);
                            }
                            if ($('#' + dependencyId).is(':checked')) {
                                dependencySiblingChecked = true;
                                return false;
                            }
                        });
                    }
                    else {
                        if (objectId == v) {
                            groupFound = true
                        }
                        if ($('#' + v).is(':checked')) {
                            dependencySiblingChecked = true;
                            return false;
                        }
                    }
                });
                if (groupFound && !dependencySiblingChecked) {
                    $.each($('[dependency-group=' + dependencyGroup + ']:checked:not([id=' + objectId + '])'), function (index, dependant) {
                        dependantIds.push($(this).attr('id'));
                        $(dependant).attr('checked', false);
                    });

                    $.each($('[dependency-group=' + key + ']:checked'), function (index, dependant) {
                        dependantIds.push($(this).attr('id'));
                        $(dependant).attr('checked', false);
                    });

                    if (dependantIds.length > 0) {
                        if(typeof settings.notifyDeselected == 'function'){
                            settings.notifyDeselected.call(this, dependantIds);
                        }

                        $(obj).attr('selectable_role_ids', dependantIds.join(','))
//                        $.each(dependencySiblings, function (index, id) {
//                            $('#' + id).attr('selectable_role_ids', dependantIds.join(','));
//                        })
                    }
                }
            });
        }
    };
}(jQuery));
