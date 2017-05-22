(function () {
    "use strict";

    function PapyrusScrollDirective() {
        return {
            restrict: "A",
            scope: {
                papyrusScroll: "&papyrusScroll",
                papyrusScrollThrottleMs: "=papyrusScrollThrottleMs",
                papyrusScrollPreloadViewPercentage: "=papyrusScrollPreloadViewPercentage"
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

            $(document).ready(function() {
                render($container);
            });

            $(window).on("load", function () {
                render($container);
            });

            $container.on("scroll", function () {
                render($container);
            });
            
            $scope.$on('$viewContentLoaded', function() {
                render($container);
            });

            angular.element(function () {
                render($container);
            });
        }

        var  renderBackoff = null;

        function render(container) {
            if (!!renderBackoff) {
                $timeout.cancel(renderBackoff);
            }

            renderBackoff = $timeout(function() {
                var pending = getNrOfRequestItems(container);

                if (pending > 0) {
                    $scope.$apply(function () {
                        requestItems(pending);
                    });
                }
            }, getBackoffTimeout());
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

            var diff = backgroundRenderedHeight - (containerHeight * getPreloadPercentage());

            if (diff <= 0) {
                var nrOfItems = (Math.abs(diff) / itemHeight);

                return (isNaN(nrOfItems) || !isFinite(nrOfItems))
                    ? 0
                    : nrOfItems;
            }

            return 0;
        }

        function getBackoffTimeout() {
            return $scope.papyrusScrollThrottleMs || 50;
        }

        function getPreloadPercentage() {
             return ($scope.papyrusScrollPreloadViewPercentage || 75.0) / 100.0;           
        }
    }

    PapyrusScrollDirectiveController.$inject = ["$scope", "$timeout"];

    angular.module("papyrus-scroll", [])
        .directive("papyrusScroll", PapyrusScrollDirective);
})();