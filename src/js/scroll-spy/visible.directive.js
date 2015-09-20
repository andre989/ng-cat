const mod = angular.module('pa.scrollSpy.visible', []);

mod.directive('paVisible', ['$window', ($window) => {
    return {
        restrict: 'A',
        require: '^^paScrollContainer',
        link (scope, elem, attrs, ctrl) {
            let rect = {},
                scrollContainer,
                api = {
                    updateClientRect () {
                        let clientRect = elem[0].getBoundingClientRect();
                        rect.top = clientRect.top + scrollContainer.scrollTop;
                        rect.left = clientRect.left + scrollContainer.scrollLeft;
                        rect.width = clientRect.width;
                        rect.height = clientRect.height;
                    },
                    update (viewportRect) {
                        let isFullyVisible = (rect.top >= viewportRect.top && //Top border in viewport
                            (rect.top + rect.height) <= (viewportRect.top + viewportRect.height)) || //Bottom border in viewport
                            (rect.top < viewportRect.top && (rect.height) >= viewportRect.height), // Bigger than viewport

                            isFullyHidden = !isFullyVisible &&
                            rect.top > (viewportRect.top + viewportRect.height) || //Top border below viewport bottom
                            (viewportRect.top + viewportRect.height) < viewportRect.top; //Bottom border above viewport top


                        //Only change state when fully visible/hidden
                        if (isFullyVisible) {
                            api.setInView(true);
                        } else if (isFullyHidden) {
                            api.setInView(false);
                        }
                    },
                    getRect () {
                        return rect;
                    },
                    setInView (inView) {
                        if (scope[attrs.paVisible] !== inView) {
                            scope.$evalAsync(() => {
                                scope[attrs.paVisible] = inView;
                            });
                        }
                    }
                };
            scrollContainer = ctrl.getScrollContainer() || $window.document.body;
            ctrl.registerSpy(api);
            api.updateClientRect();
        }
    };
}]);

export default mod;