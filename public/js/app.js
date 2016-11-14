angular
    .module('performance', [])
    .run(function($rootScope){

        var p = window.performance;
        var waitForLoadMax = 100;
        var waitForLoadInterval = 100;

        if( angular.element(document.readyState === "complete") ) {
            onDOMContentLoaded();
        } else {
            document.addEventListener("DOMContentLoaded", onDOMContentLoadedDefer, false);
        }


        function onDOMContentLoaded() {
            $rootScope.$apply(function(){
                printTiming(p.timing);

                var waiting = setInterval(waitForLoad, waitForLoadInterval);
                var stopCounter = 0;
                function waitForLoad() {
                    if (p.timing.loadEventEnd > 0 || (stopCounter++ > waitForLoadMax)) {
                        printTiming(p.timing);
                        clearInterval(waiting);
                    }
                }
            });
        }

        function onDOMContentLoadedDefer() {
            $rootScope.$apply(function(){
                setTimeout(onDOMContentLoaded, 1);
            });
        }

        function printTiming(t) {
            var timingContainer = document.getElementById("pm-timing");
            if (timingContainer) {
                var html = [];
                var groups = {
                    "Connection": function() {
                        return t.connectEnd - t.connectStart;
                    },
                    "Response": function() {
                        return t.responseEnd - t.responseStart;
                    },
                    "Domain Lookup": function() {
                        return t.domainLookupEnd - t.domainLookupStart;
                    },
                    "Load Event": function() {
                        return t.loadEventEnd - t.loadEventStart;
                    },
                    "Unload Event": function() {
                        return t.unloadEventEnd - t.unloadEventStart;
                    },
                    "DOMContentLoaded Event": function() {
                        return t.domContentLoadedEventEnd - t.domContentLoadedEventStart;
                    }
                };
                for (var i in groups) {
                    html.push("<span>" + i + "</span>: " + groups[i]() + "ms");
                }
                timingContainer.innerHTML = html.join("<br />");
            }
            var timingContainerRaw = document.getElementById("pm-timing-raw");
            if (timingContainerRaw) {
                var html = [];
                for (var i in t) {
                    html.push("<span>" + i + "</span>: " + t[i]);
                }
                timingContainerRaw.innerHTML = html.join("<br />");
            }
        }
    })
    .component('performanceComp', {
        controller: function() {
            var vm = this;
            vm.state = document.readyState;
            vm.PERFORMANCE_STYLES = [
                '#pm-component { z-index: 2147483647; position: absolute; top: 0; left: 0; border:rgba(0,0,0,.4) solid 2px; padding:2px; width:110px; background-color: rgba(220, 220, 220, .3); border-top:none; border-right:none; font-size:12px; font-family: Courier;}',
                '#pm-component[open] { background-color:rgb(220, 220, 220); width: 600px;  }',
                '#pm-component > summary  span { color:blue; text-decoration: underline; cursor: pointer; position:absolute; top:0; right:2px; }',
                '#pm-component details, #pm-component details > div { margin-left: 15px; }'
            ].join(' ');

        },
        templateUrl: 'public/views/templates/performance.html'
    });

