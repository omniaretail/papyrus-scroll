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

        var $window = $(window),
            renderBackoff = null,
            defaultPapyrusScrollThrottleMs = 50,
            defaultPapyrusScrollPreloadViewPercentage = 75;

        function initContainer(container) {
            var $container = $(container);

            var unwatch = $scope.$watch(function () {
                return findItems($container).length;
            }, function (oldValue, newValue) {
                if (newValue > 1) {
                    unwatch();
                }

                render($container);
            });

            $(document).ready(function () {
                render($container);
            });

            $window.on("load", function () {
                render($container);
            });

            $window.on("scroll", function () {
                render($container);
            });

            $container.on("scroll", function () {
                render($container);
            });

            $scope.$on("$viewContentLoaded", function () {
                render($container);
            });

            $scope.$on("$papyrusScrollItemsLoaded", function () {
                render($container);
            });

            angular.element(function () {
                render($container);
            });

            requestItems(1);
        }

        function render(container) {
            if (!!renderBackoff) {
                $timeout.cancel(renderBackoff);
            }

            renderBackoff = $timeout(function () {
                var pending = getNrOfRequestItems(container);

                if (pending > 0) {
                    $scope.$apply(function () {
                        requestItems(pending);
                    });
                }
            }, getBackoffTimeout());
        }

        function requestItems(amount) {
            if (!$scope.papyrusScroll) {
                return;
            }

            $scope.papyrusScroll({ $amount: amount });
        }

        function findItems(container) {
            return container.find("[papyrus-scroll-item]");
        }

        function getNrOfRequestItems(container) {
            var items = findItems(container);

            var containerHeight = container.height() || 0;
            var containerScrollTop = container.scrollTop() || $window.scrollTop() || 0;

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
                var nrOfItems = Math.ceil((Math.abs(diff) / itemHeight));

                return (isNaN(nrOfItems) || !isFinite(nrOfItems))
                    ? 0
                    : nrOfItems;
            }

            return 0;
        }

        function getBackoffTimeout() {
            return $scope.papyrusScrollThrottleMs || defaultPapyrusScrollThrottleMs;
        }

        function getPreloadPercentage() {
            return ($scope.papyrusScrollPreloadViewPercentage || defaultPapyrusScrollPreloadViewPercentage) / 100.0;
        }
    }

    PapyrusScrollDirectiveController.$inject = ["$scope", "$timeout"];

    angular.module("papyrus-scroll", [])
        .directive("papyrusScroll", PapyrusScrollDirective);
})();