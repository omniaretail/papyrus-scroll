# Papyrus
Just another infinite scrolling module for AngularJS. 
[Live demo](https://codepen.io/wichardriezebos/pen/JNwjKR)

# Features
- Efficient item buffering.
- No interuptions while scrolling.
- Adapts automatically to container it's size.

# Getting Started
- Install the module with bower:
    ```
    bower install papyrus-scroll --save
    ```
- Add script tags to document:
    ```
    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/papyrus-scroll/papyrus-scroll.js"></script>
    ```
- Add dependency to your module: 
    ```
    angular.module("yourAwesomeApp", ["papyrus-scroll"]);
    ```
- Create a function to load items:
   ```
   $scope.items = [];
   $scope.loadItems = function($amount) {
        for(var i = 0; i < $amount; i++) {
            $scope.items.push({  });
        }
   }
   ```
- Assign required attributes to the container and the item:
    ```
    <div papyrus-scroll="loadItems($amount)">
        <div ng-repeat="item in items" papyrus-scroll-item>
            <img ng-src="//lorempixel.com/400/200/" />
        </div>
    </div>
    ```
- Optional tune settings:
    ```
    papyrus-scroll-throttle-ms="50"
    papyrus-scroll-preload-view-percentage="75"
    ```