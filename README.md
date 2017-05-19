# Papyrus
Just another infinite scrolling module for AngularJS. 

# Features
- Efficient item buffering.
- No interuptions while scrolling.
- Adapts automatically to container it's size.

# Getting Started
- [Download](papyrus-scroll.js) the script.
- Add dependency to your Angular Module. 
    ```
    angular.module("myApp", ["papyrus-scroll"]);
    ```
- Create a function to load items.
   ```
   $scope.loadItems = function($amount) {
        for(var i = 0; i < $amount; i++) {
            $scope.items.push({ /* can be anything */ });
        }
   }
   ```
- Assign required attributes to the container.
    ```
    <div papyrus-scroll="loadItems($amount)">
        <div ng-repeat="item in items" papyrus-scroll-item>
            <img ng-src="//lorempixel.com/400/200/" />
        </div>
    </div>
    ```