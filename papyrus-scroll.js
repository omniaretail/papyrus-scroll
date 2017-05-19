(function () {
    "use strict";

    function PapyrusScrollDirective($timeout) {
        return {
            restrict: "A",
            scope: {
                papyrusScroll: "&papyrusScroll"
            },
            controller: PapyrusScrollDirectiveController,
            link: function (scope, element, attrs, ctrl) {
                ctrl.initContainer(element);
            }
        };
    }

    function PapyrusScrollDirectiveController($scope, $timeout) {
        var vm = this;
        vm.initContainer = initContainer;

        function initContainer(container) {
            var $container = $(container);

            requestItems(1);

            $(window).on("load", function () {
                render($container);
            });

            $container.on("scroll", function () {
                render($container);
            });
        }

        function render(container) {
            var pending = getNrOfRequestItems(container);

            if (pending > 0) {
                $scope.$apply(function () {
                    requestItems(pending);
                });
            }
        }

        function requestItems(amount) {
            if (!!$scope.papyrusScroll) {
                $scope.papyrusScroll({ $amount: amount });
            }
        }

        function getNrOfRequestItems(container) {
            var items = container.find("[papyrus-scroll-item]");

            var containerHeight = container.height() || 0;
            var containerScrollTop = container.scrollTop() || 0;

            var itemHeight = (!items.length)
                ? 0
                : ($(items[0]).height() || 0);

            if (!itemHeight) {
                return 0;
            }

            var renderedHeight = items.length * itemHeight;
            var backgroundRenderedHeight = (renderedHeight - containerScrollTop) - containerHeight;

            var diff = backgroundRenderedHeight - (containerHeight / 3);

            if (diff <= 0) {
                var nrOfItems = (Math.abs(diff) / itemHeight);

                return (isNaN(nrOfItems) || !isFinite(nrOfItems))
                    ? 0
                    : nrOfItems;
            }

            return 0;
        }
    }

    angular.module("papyrus-scroll", [])
        .directive("papyrusScroll", PapyrusScrollDirective);
})();