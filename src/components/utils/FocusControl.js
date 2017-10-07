import _ from 'lodash'
/**
 * Create Focus control to auto trigger leave when click outside the element
 * @param {Function} getElement The method to get the element to judage outside
 * @param {Function} onLeave The method to execute when focus lose, the enter value will be passed
 */
const FocusControl = function(getElements, onLeave) {
  this.focus = false;
  this.getElements = getElements;
  this.onLeave = onLeave;
}

FocusControl.prototype = {
  hook(value) {
    const self = this;
    if (self.focus) {
      return;
    }
    self.focus = true;
    self.enterValue = _.cloneDeep(value);

    const testClick = e => {
      var els = self.getElements();
      if (!_.isArray(els)) {
        els = [ els ];
      }

      var inElement = false;
      for (var i = 0; i < els.length && !inElement; i++) {
        var el = els[i].getBoundingClientRect();
        inElement = e.clientX >= el.left &&
          e.clientX <= el.right &&
          e.clientY >= el.top &&
          e.clientY <= el.bottom;
      }

      if (!inElement) {
        self.focus = false;
        document.removeEventListener('mouseup', testClick);
        self.onLeave(self.enterValue);
      }
    }

    document.addEventListener('mouseup', testClick, false);
  }
}

export default FocusControl

