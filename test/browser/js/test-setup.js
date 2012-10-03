
/*

TODO:

  PageLayout & PageTemplates
  
  Destruction lifecycle validation
  
  OneWay Constraints
  
    
  
  
  RootViews
    - G.window.get('childViews')...
*/


(function() {
  var App, Box, Test, assert, chai, computed, constrain, expect, randomColorBg,
    _this = this;

  App = window.App = G.Application.create();

  constrain = G.constrain;

  computed = Em.computed;

  chai = typeof window !== "undefined" && window !== null ? window.chai : void 0;

  if (!chai) {
    chai = require('..');
  }

  assert = chai.assert;

  expect = chai.expect;

  randomColorBg = Em.Mixin.create({
    style: Em.computed(function() {
      return "background-color:" + (this.get('bgColor')) + "; width:50px; height:50px;";
    }),
    bgColor: Em.computed(function() {
      return "hsl(" + ((_.randomInt(1, 2)) * 120 - 20) + ", " + (_.randomInt(70, 90)) + "%, " + (_.randomInt(50, 70)) + "% )";
    })
  });

  Box = App.Box = G.ContainerView.extend(randomColorBg, {
    childViews: ['boxContent'],
    hasIntrinsicWidth: true,
    hasIntrinsicHeight: true,
    intrinsicSize: [50, 50],
    boxContent: G.View.extend({
      template: G.template("<h1>{{view.parentView.id}}</h1>      ")
    }),
    tagName: 'div',
    test: 'asdfasdf',
    classNameBindings: ['class'],
    classNames: ['box', "cassowary-item"]
  });

  Test = G.Test = G.Object.extend({
    title: 'test title',
    boxes: null,
    $test: Em.computed(function() {
      return $("h1:contains('" + this.title + "')");
    }).cacheable(),
    t: Em.computed(function() {
      return this.get('$test').position().top;
    }).cacheable(),
    align: function(view, viewContext) {
      var constrainFunc;
      view || (view = this.boxes[0]);
      if ((viewContext != null ? viewContext.constrain : void 0) != null) {
        constrainFunc = viewContext.constrain;
        alert('align  not done');
      }
      return constrain([
        {
          c: [this.get('t'), '<=', view.get('t')],
          strength: G.weak
        }, {
          c: [300, '<=', view.get('l')],
          strength: G.strong
        }
      ]);
    },
    init: function() {
      this._super();
      if (this.describe) {
        LOG(this.get("title") + "------------------");
        this.describe = this.describe.bind(this);
        return describe(this.title, this.describe);
      }
    }
  });

  G.ready(function() {
    return describe('MOCHA IS FUCKING UP', function() {
      return it('globals leak is stupid', function() {
        return assert.equal(1, 1);
      });
    });
  });

}).call(this);
