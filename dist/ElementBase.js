(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Base class for defining custom elements. */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ElementBase = (function (_HTMLElement) {
  _inherits(ElementBase, _HTMLElement);

  function ElementBase() {
    _classCallCheck(this, ElementBase);

    _get(Object.getPrototypeOf(ElementBase.prototype), 'constructor', this).apply(this, arguments);
  }

  // Convert camel case fooBar name to hyphenated foo-bar.

  _createClass(ElementBase, [{
    key: 'attributeChangedCallback',

    // Handle a change to the attribute with the given name.
    value: function attributeChangedCallback(name, oldValue, newValue) {
      this.log('attribute ' + name + ' changed to ' + newValue);
      // If the attribute name corresponds to a property name, then set that
      // property.
      // TODO: This looks up the existence of the property each time. It would
      // be more efficient to, e.g., do a one-time computation of all properties
      // defined by the element (including base classes).
      // TODO: Ignore standard attribute name.
      var propertyName = attributeToPropertyName(name);
      if (hasProperty(this, propertyName)) {
        this[propertyName] = newValue;
      }
    }
  }, {
    key: 'createdCallback',
    value: function createdCallback() {
      this.log("created");
      if (this.template) {
        createShadowRootWithTemplate(this, this.template);
      }
      marshallAttributesToProperties(this);
    }

    /*
     * Create a subclass with the given members on its prototype.
     *
     * This .extend() facility is provided solely as a means to create component
     * classes in ES5. ES6 users should use "class ... extends ElementBase".
     */
  }, {
    key: 'log',
    value: function log(text) {
      console.log(this.localName + ': ' + text);
    }

    // static get behaviors() {
    //   return this._behaviors;
    // }

    /*
     * Mix the indicated properties into the class' prototype.
     * This is a destructive operation.
     * TODO: If only .extend() needs this, fold into that method.
     */
  }], [{
    key: 'extend',
    value: function extend(properties) {
      var newClass = (function (_ElementBase) {
        _inherits(newClass, _ElementBase);

        function newClass() {
          _classCallCheck(this, newClass);

          _get(Object.getPrototypeOf(newClass.prototype), 'constructor', this).apply(this, arguments);
        }

        return newClass;
      })(ElementBase);

      newClass.mixin(properties);
      return newClass;
    }
  }, {
    key: 'mixin',
    value: function mixin(properties) {
      var _this = this;

      Object.getOwnPropertyNames(properties).forEach(function (name) {
        var descriptor = Object.getOwnPropertyDescriptor(properties, name);
        Object.defineProperty(_this.prototype, name, descriptor);
      });
      return this;
    }
  }]);

  return ElementBase;
})(HTMLElement);

function attributeToPropertyName(attributeName) {
  var propertyName = attributeName.replace(/-([a-z])/g, function (m) {
    return m[1].toUpperCase();
  });
  return propertyName;
}

// Convert hyphenated foo-bar name to camel case fooBar.
function propertyToAttributeName(propertyName) {
  var attributeName = propertyName.replace(/([a-z][A-Z])/g, function (g) {
    return g[0] + '-' + g[1].toLowerCase();
  });
  return attributeName;
}

function createShadowRootWithTemplate(element, template) {
  if (typeof template === 'string') {
    // Upgrade plain string to real template.
    template = createTemplateWithInnerHTML(template);
  }
  element.log("cloning template into shadow root");
  element.root = element.createShadowRoot();
  var clone = document.importNode(template.content, true);
  element.root.appendChild(clone);
}

function createTemplateWithInnerHTML(innerHTML) {
  var template = document.createElement('template');
  // REVIEW: Is there an easier way to do this?
  // We'd like to just set innerHTML on the template content, but since it's
  // a DocumentFragment, that doesn't work.
  var div = document.createElement('div');
  div.innerHTML = innerHTML;
  while (div.childNodes.length > 0) {
    template.content.appendChild(div.childNodes[0]);
  }
  return template;
}

function hasProperty(_x4, _x5) {
  var _again2 = true;

  _function2: while (_again2) {
    var obj = _x4,
        name = _x5;
    _again2 = false;

    if (!obj) {
      return false;
    } else if (obj.hasOwnProperty(name)) {
      return true;
    } else {
      _x4 = Object.getPrototypeOf(obj);
      _x5 = name;
      _again2 = true;
      continue _function2;
    }
  }
}

function marshallAttributesToProperties(element) {
  [].forEach.call(element.attributes, function (attribute) {
    element.attributeChangedCallback(attribute.name, undefined, attribute.value);
  });
}

ElementBase.Behavior = (function () {
  function ElementBehavior() {
    _classCallCheck(this, ElementBehavior);
  }

  _createClass(ElementBehavior, null, [{
    key: 'applyBehavior',
    value: function applyBehavior(target) {
      var _this2 = this;

      var prototype = target.prototype;
      Object.getOwnPropertyNames(this.prototype).forEach(function (name) {
        if (name !== 'constructor') {
          var descriptor = Object.getOwnPropertyDescriptor(_this2.prototype, name);
          Object.defineProperty(prototype, name, descriptor);
        }
      });
      // if (!target._behaviors) {
      //   target._behaviors = [];
      // }
      // target._behaviors.push(this);
    }
  }]);

  return ElementBehavior;
})();

document.registerElement('element-base', ElementBase);

exports['default'] = ElementBase;
module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvRGV2ZWxvcGVyL1NvdXJjZS9lbGVtZW50LWJhc2Uvc3JjL0VsZW1lbnRCYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztJQ0VNLFdBQVc7WUFBWCxXQUFXOztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7K0JBQVgsV0FBVzs7Ozs7ZUFBWCxXQUFXOzs7O1dBR1Msa0NBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUU7QUFDakQsVUFBSSxDQUFDLEdBQUcsZ0JBQWMsSUFBSSxvQkFBZSxRQUFRLENBQUcsQ0FBQzs7Ozs7OztBQU9yRCxVQUFJLFlBQVksR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxVQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLEVBQUU7QUFDbkMsWUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLFFBQVEsQ0FBQztPQUMvQjtLQUNGOzs7V0FFYywyQkFBRztBQUNoQixVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BCLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixvQ0FBNEIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ25EO0FBQ0Qsb0NBQThCLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEM7Ozs7Ozs7Ozs7V0FjRSxhQUFDLElBQUksRUFBRTtBQUNSLGFBQU8sQ0FBQyxHQUFHLENBQUksSUFBSSxDQUFDLFNBQVMsVUFBSyxJQUFJLENBQUcsQ0FBQztLQUMzQzs7Ozs7Ozs7Ozs7OztXQVJZLGdCQUFDLFVBQVUsRUFBRTtVQUNsQixRQUFRO2tCQUFSLFFBQVE7O2lCQUFSLFFBQVE7Z0NBQVIsUUFBUTs7cUNBQVIsUUFBUTs7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U0FBUyxFQUFLO0FBQ2pELFdBQU8sQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDOUUsQ0FBQyxDQUFDO0NBQ0o7O0FBR0QsV0FBVyxDQUFDLFFBQVE7V0FBUyxlQUFlOzBCQUFmLGVBQWU7OztlQUFmLGVBQWU7O1dBRXRCLHVCQUFDLE1BQU0sRUFBRTs7O0FBQzNCLFVBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDakMsWUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDM0QsWUFBSSxJQUFJLEtBQUssYUFBYSxFQUFFO0FBQzFCLGNBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxPQUFLLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN2RSxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ3BEO09BQ0YsQ0FBQyxDQUFDOzs7OztLQUtKOzs7U0FkMEIsZUFBZTtJQWdCM0MsQ0FBQzs7QUFHRixRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQzs7cUJBRXZDLFdBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogQmFzZSBjbGFzcyBmb3IgZGVmaW5pbmcgY3VzdG9tIGVsZW1lbnRzLiAqL1xuXG5jbGFzcyBFbGVtZW50QmFzZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAvLyBIYW5kbGUgYSBjaGFuZ2UgdG8gdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgdGhpcy5sb2coYGF0dHJpYnV0ZSAke25hbWV9IGNoYW5nZWQgdG8gJHtuZXdWYWx1ZX1gKTtcbiAgICAvLyBJZiB0aGUgYXR0cmlidXRlIG5hbWUgY29ycmVzcG9uZHMgdG8gYSBwcm9wZXJ0eSBuYW1lLCB0aGVuIHNldCB0aGF0XG4gICAgLy8gcHJvcGVydHkuXG4gICAgLy8gVE9ETzogVGhpcyBsb29rcyB1cCB0aGUgZXhpc3RlbmNlIG9mIHRoZSBwcm9wZXJ0eSBlYWNoIHRpbWUuIEl0IHdvdWxkXG4gICAgLy8gYmUgbW9yZSBlZmZpY2llbnQgdG8sIGUuZy4sIGRvIGEgb25lLXRpbWUgY29tcHV0YXRpb24gb2YgYWxsIHByb3BlcnRpZXNcbiAgICAvLyBkZWZpbmVkIGJ5IHRoZSBlbGVtZW50IChpbmNsdWRpbmcgYmFzZSBjbGFzc2VzKS5cbiAgICAvLyBUT0RPOiBJZ25vcmUgc3RhbmRhcmQgYXR0cmlidXRlIG5hbWUuXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGF0dHJpYnV0ZVRvUHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChoYXNQcm9wZXJ0eSh0aGlzLCBwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5sb2coXCJjcmVhdGVkXCIpO1xuICAgIGlmICh0aGlzLnRlbXBsYXRlKSB7XG4gICAgICBjcmVhdGVTaGFkb3dSb290V2l0aFRlbXBsYXRlKHRoaXMsIHRoaXMudGVtcGxhdGUpO1xuICAgIH1cbiAgICBtYXJzaGFsbEF0dHJpYnV0ZXNUb1Byb3BlcnRpZXModGhpcyk7XG4gIH1cblxuICAvKlxuICAgKiBDcmVhdGUgYSBzdWJjbGFzcyB3aXRoIHRoZSBnaXZlbiBtZW1iZXJzIG9uIGl0cyBwcm90b3R5cGUuXG4gICAqXG4gICAqIFRoaXMgLmV4dGVuZCgpIGZhY2lsaXR5IGlzIHByb3ZpZGVkIHNvbGVseSBhcyBhIG1lYW5zIHRvIGNyZWF0ZSBjb21wb25lbnRcbiAgICogY2xhc3NlcyBpbiBFUzUuIEVTNiB1c2VycyBzaG91bGQgdXNlIFwiY2xhc3MgLi4uIGV4dGVuZHMgRWxlbWVudEJhc2VcIi5cbiAgICovXG4gIHN0YXRpYyBleHRlbmQocHJvcGVydGllcykge1xuICAgIGNsYXNzIG5ld0NsYXNzIGV4dGVuZHMgRWxlbWVudEJhc2Uge31cbiAgICBuZXdDbGFzcy5taXhpbihwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gbmV3Q2xhc3M7XG4gIH1cblxuICBsb2codGV4dCkge1xuICAgIGNvbnNvbGUubG9nKGAke3RoaXMubG9jYWxOYW1lfTogJHt0ZXh0fWApO1xuICB9XG5cbiAgLy8gc3RhdGljIGdldCBiZWhhdmlvcnMoKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuX2JlaGF2aW9ycztcbiAgLy8gfVxuXG4gIC8qXG4gICAqIE1peCB0aGUgaW5kaWNhdGVkIHByb3BlcnRpZXMgaW50byB0aGUgY2xhc3MnIHByb3RvdHlwZS5cbiAgICogVGhpcyBpcyBhIGRlc3RydWN0aXZlIG9wZXJhdGlvbi5cbiAgICogVE9ETzogSWYgb25seSAuZXh0ZW5kKCkgbmVlZHMgdGhpcywgZm9sZCBpbnRvIHRoYXQgbWV0aG9kLlxuICAgKi9cbiAgc3RhdGljIG1peGluKHByb3BlcnRpZXMpIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm9wZXJ0aWVzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvcGVydGllcywgbmFtZSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5wcm90b3R5cGUsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cblxuXG4vLyBDb252ZXJ0IGNhbWVsIGNhc2UgZm9vQmFyIG5hbWUgdG8gaHlwaGVuYXRlZCBmb28tYmFyLlxuZnVuY3Rpb24gYXR0cmlidXRlVG9Qcm9wZXJ0eU5hbWUoYXR0cmlidXRlTmFtZSkge1xuICBsZXQgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlTmFtZS5yZXBsYWNlKC8tKFthLXpdKS9nLCAobSkgPT4gbVsxXS50b1VwcGVyQ2FzZSgpKTtcbiAgcmV0dXJuIHByb3BlcnR5TmFtZTtcbn1cblxuLy8gQ29udmVydCBoeXBoZW5hdGVkIGZvby1iYXIgbmFtZSB0byBjYW1lbCBjYXNlIGZvb0Jhci5cbmZ1bmN0aW9uIHByb3BlcnR5VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSkge1xuICBsZXQgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS5yZXBsYWNlKC8oW2Etel1bQS1aXSkvZywgKGcpID0+IGdbMF0gKyAnLScgKyBnWzFdLnRvTG93ZXJDYXNlKCkpO1xuICByZXR1cm4gYXR0cmlidXRlTmFtZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2hhZG93Um9vdFdpdGhUZW1wbGF0ZShlbGVtZW50LCB0ZW1wbGF0ZSkge1xuICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgIC8vIFVwZ3JhZGUgcGxhaW4gc3RyaW5nIHRvIHJlYWwgdGVtcGxhdGUuXG4gICAgdGVtcGxhdGUgPSBjcmVhdGVUZW1wbGF0ZVdpdGhJbm5lckhUTUwodGVtcGxhdGUpO1xuICB9XG4gIGVsZW1lbnQubG9nKFwiY2xvbmluZyB0ZW1wbGF0ZSBpbnRvIHNoYWRvdyByb290XCIpO1xuICBlbGVtZW50LnJvb3QgPSBlbGVtZW50LmNyZWF0ZVNoYWRvd1Jvb3QoKTtcbiAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgZWxlbWVudC5yb290LmFwcGVuZENoaWxkKGNsb25lKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGVXaXRoSW5uZXJIVE1MKGlubmVySFRNTCkge1xuICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAvLyBSRVZJRVc6IElzIHRoZXJlIGFuIGVhc2llciB3YXkgdG8gZG8gdGhpcz9cbiAgLy8gV2UnZCBsaWtlIHRvIGp1c3Qgc2V0IGlubmVySFRNTCBvbiB0aGUgdGVtcGxhdGUgY29udGVudCwgYnV0IHNpbmNlIGl0J3NcbiAgLy8gYSBEb2N1bWVudEZyYWdtZW50LCB0aGF0IGRvZXNuJ3Qgd29yay5cbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuICB3aGlsZSAoZGl2LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgIHRlbXBsYXRlLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2LmNoaWxkTm9kZXNbMF0pO1xuICB9XG4gIHJldHVybiB0ZW1wbGF0ZTtcbn1cblxuZnVuY3Rpb24gaGFzUHJvcGVydHkob2JqLCBuYW1lKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBoYXNQcm9wZXJ0eShPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSwgbmFtZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFyc2hhbGxBdHRyaWJ1dGVzVG9Qcm9wZXJ0aWVzKGVsZW1lbnQpIHtcbiAgW10uZm9yRWFjaC5jYWxsKGVsZW1lbnQuYXR0cmlidXRlcywgKGF0dHJpYnV0ZSkgPT4ge1xuICAgIGVsZW1lbnQuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJpYnV0ZS5uYW1lLCB1bmRlZmluZWQsIGF0dHJpYnV0ZS52YWx1ZSk7XG4gIH0pO1xufVxuXG5cbkVsZW1lbnRCYXNlLkJlaGF2aW9yID0gY2xhc3MgRWxlbWVudEJlaGF2aW9yIHtcblxuICBzdGF0aWMgYXBwbHlCZWhhdmlvcih0YXJnZXQpIHtcbiAgICBsZXQgcHJvdG90eXBlID0gdGFyZ2V0LnByb3RvdHlwZTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLnByb3RvdHlwZSkuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgaWYgKG5hbWUgIT09ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMucHJvdG90eXBlLCBuYW1lKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvdHlwZSwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gaWYgKCF0YXJnZXQuX2JlaGF2aW9ycykge1xuICAgIC8vICAgdGFyZ2V0Ll9iZWhhdmlvcnMgPSBbXTtcbiAgICAvLyB9XG4gICAgLy8gdGFyZ2V0Ll9iZWhhdmlvcnMucHVzaCh0aGlzKTtcbiAgfVxuXG59O1xuXG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnZWxlbWVudC1iYXNlJywgRWxlbWVudEJhc2UpO1xuXG5leHBvcnQgZGVmYXVsdCBFbGVtZW50QmFzZTtcbiJdfQ==
