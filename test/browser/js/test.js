
/*

TODO:

  PageLayout & PageTemplates
  
  Destruction lifecycle validation
  
  OneWay Constraints
  
    
  
  
  RootViews
    - G.window.get('childViews')...
*/


(function() {
  var Box, Test, assert, chai, computed, constrain, expect, randomColorBg,
    _this = this;

  constrain = G.constrain;

  computed = Em.computed;

  chai = typeof window !== "undefined" && window !== null ? window.chai : void 0;

  if (!chai) {
    chai = require('..');
  }

  assert = chai.assert;

  expect = chai.expect;

  Box = App.Box;

  Test = G.Test;

  randomColorBg = Em.Mixin.create({
    style: Em.computed(function() {
      return "background-color:" + (this.get('bgColor')) + "; width:50px; height:50px;";
    }),
    bgColor: Em.computed(function() {
      return "hsl(" + ((_.randomInt(1, 2)) * 120 - 20) + ", " + (_.randomInt(70, 90)) + "%, " + (_.randomInt(50, 70)) + "% )";
    })
  });

  G.ready(function() {
    describe('Existential', function() {
      return describe('GRAIL', function() {
        return it('G or GRAIL', function() {
          assert.ok(GRAIL);
          return assert.ok(G);
        });
      });
    });
    Test.create({
      title: "Ember Sanity Check",
      describe: function() {
        it("passing computed properties with context", function(done) {
          var name, obj, prop;
          name = null;
          prop = computed(function() {
            return name = this.name;
          }).cacheable();
          obj = Em.Object.create({
            name: 'billybob'
          });
          Ember.defineProperty(obj, 'prop', prop);
          obj.get('prop');
          assert.equal(name, 'billybob', 'computed prop was passed with context');
          return done();
        });
        it("applying mixins after init", function(done) {
          var mixin, name, obj;
          name = null;
          mixin = Em.Mixin.create({
            prop: computed(function() {
              return name = this.name;
            }).cacheable()
          });
          obj = Em.Object.create({
            name: 'billybob'
          });
          mixin.apply(obj);
          obj.get('prop');
          assert.equal(name, 'billybob');
          return done();
        });
        return it("inheritance integrity of null values", function(done) {
          var Clazz, inst1, inst2;
          Clazz = Em.Object.extend({
            prop: null
          });
          inst1 = Clazz.create({
            prop: 'inst1'
          });
          inst2 = Clazz.create();
          inst1.set("prop", 'inst1 has prop');
          assert.notEqual(inst2.get('prop'), 'inst1 has prop');
          return done();
        });
      }
    });
    Test.create({
      title: "Layout Variables",
      describe: function() {
        var view;
        window.fuck = true;
        view = G.View.create();
        return it('aliases', function() {
          assert.equal(view.get('x'), view.get('left'), 'x - left');
          assert.equal(view.get('x'), view.get('l'), 'x - l');
          assert.equal(view.get('y'), view.get('top'), 'y - top');
          assert.equal(view.get('y'), view.get('t'), 'y - t');
          assert.equal(view.get('w'), view.get('width'), 'w - width');
          return assert.equal(view.get('h'), view.get('height'), 'h - height');
          /* volatile!
          assert.equal view.get('r'),view.get('right'), 'r - right'
          assert.equal view.get('b'),view.get('bottom'), 'b - bottom'
          assert.equal view.get('cx'),view.get('centerX'), 'cx - centerX'
          assert.equal view.get('cy'),view.get('centerY'), 'cy - centerY'
          */

        });
      }
    });
    Test.create({
      title: "Primitive Pool",
      describe: function() {
        var pool,
          _this = this;
        pool = G.primitivePool;
        it('Constraint triggered primitive life and death in pool', function() {
          var cn, li, v;
          v = G.View.create();
          li = pool.get('length');
          cn = constrain({
            c: [v.get('h'), '==', 100, '==', v.get('w')]
          });
          assert.equal(li + 2, pool.get('length'), 'added to pool');
          cn.destroy();
          return assert.equal(li, pool.get('length'), 'removed from pool');
        });
        return it('View triggered primitive death in pool', function() {
          var cn, li, v;
          v = G.View.create();
          li = pool.get('length');
          cn = constrain({
            c: [v.get('h'), '==', 100, '==', v.get('w')]
          });
          assert.equal(li + 2, pool.get('length'), 'added to pool');
          v.destroy();
          return assert.equal(li, pool.get('length'), 'removed from pool');
        });
      }
    });
    Test.create({
      title: "Framed Views",
      describe: function() {
        var frame1, frame1_solver, frame2, frame2_solver, panel1, panel1_solver, panel2, panel3, panel3_solver, _ref,
          _this = this;
        frame1 = G.ContainerView.create(randomColorBg, {
          id: 'frame1',
          isFrame: true,
          classNames: ['frame'],
          childViews: ['panel1', 'panel2'],
          panel1: App.Box.create({
            id: 'panel1',
            classNames: ['panel']
          }),
          panel2: App.Box.create({
            id: 'panel2',
            classNames: ['panel']
          })
        }).append();
        frame2 = G.ContainerView.create({
          isFrame: true,
          classNames: ['frame'],
          childViews: ['panel3', 'panel4'],
          panel3: G.View.create({
            classNames: ['panel']
          }),
          panel4: G.View.create({
            classNames: ['panel']
          })
        }).append();
        panel1 = G.V$("#panel1").die()[0];
        panel2 = frame1.panel2;
        panel3 = frame2.panel3;
        _ref = [frame1, frame2, panel1, panel3].invoke('get', 'solver'), frame1_solver = _ref[0], frame2_solver = _ref[1], panel1_solver = _ref[2], panel3_solver = _ref[3];
        it('View hierarchy', function(done) {
          var count;
          count = 0;
          frame1.get('childViews').forEach(function(view) {
            count++;
            return assert.equal(view.get('id'), "panel" + count);
          });
          return done();
        });
        it('Solver hierarchy', function() {
          assert.equal(frame1_solver, panel1_solver, "frame1.solver is panel1.solver");
          assert.equal(frame2_solver, panel3_solver, "frame2.solver is panel3.solver");
          assert.notEqual(frame1_solver, G.window.get('solver'), "frame1.solver isnt window.solver");
          assert.ok(frame1_solver.isChildOf(G.window.get('solver')), "frame1.solver isChildOf window.solver");
          assert.notEqual(frame1_solver, frame2_solver, "frame1.solver isnt frame2.solver");
          assert.notEqual(frame1_solver, panel3_solver, "frame1.solver isnt panel3.solver");
          assert.ok(frame2_solver.isChildOf(G.window.get('solver')), "frame2.solver isChildOf window.solver");
          return assert.ok(frame2_solver.isSiblingOf(frame1_solver), "frame1.solver isSiblingOf frame2.solver");
        });
        it("Constraints of Framed View", function() {
          var cn, cnSolver;
          cn = constrain({
            c: [frame1.get('w'), '==', 200, '==', frame1.get('h')]
          });
          cnSolver = cn.get('solver');
          _this.align(frame1);
          return assert.equal(cnSolver, G.window.get('solver'), "constraint.solver is window.solver");
        });
        return it("Constraints within Framed View", function(done) {
          var cn, cnSolver;
          cn = frame1.constrain({
            v: ['|', 50, [panel1, ['==', panel2.get('h')]], 10, [panel2], 50, '|'],
            contain: true,
            containGap: 10,
            strength: G.reqiured
          });
          cnSolver = cn.get('solver');
          assert.equal(cnSolver, frame1_solver, "constraint.solver is frame1.solver");
          frame1.constrain({
            c: [frame1.get('w'), '==', 400, '==', frame1.get('h')]
          });
          G.one('didRender', function() {
            assert.equal(frame1.get('w').value(), 200, "External frame constraints overpower internal ones");
            assert.equal(panel1.get('b').value() + 10, panel2.get('t').value(), "Panels aligned ");
            assert.equal(frame1.get('t').value() + 50, panel1.get('t').value(), "Panels aligned within frame");
            return done();
          });
          return G.render();
        });
      }
    });
    Test.create({
      title: "Grid v2.0",
      describe: function() {
        var box;
        box = App.Box.create({
          id: 'agridv2-parent',
          childViews: ['child'],
          child: App.Box.create(),
          grid: {
            template: ["112", "333"],
            gap: [10, 10],
            gaps: {
              h: 10,
              v: 10,
              top: 20,
              "1-2": 30
            }
          }
        });
        return it('box.grid.template.1', function(done) {
          var slot1;
          slot1 = box.get('grid.template.1');
          assert.ok(slot1);
          return done();
        });
      }
    });
    Test.create({
      title: 'Stay Constraints',
      boxes: App.Box.create([
        {
          id: 'stay-c0',
          "class": 'stay-c'
        }, {
          id: 'stay-c1',
          "class": 'stay-c'
        }, {
          id: 'stay-c2'
        }
      ]).invoke('append'),
      describe: function() {
        var b0, b1, b2, test, _ref;
        test = this;
        _ref = this.boxes, b0 = _ref[0], b1 = _ref[1], b2 = _ref[2];
        it('single view', function(done) {
          var _this = this;
          constrain([
            {
              c: [b2.get('r'), '==', 500]
            }, {
              c: [b2.get('y'), '>=', G.plus(test.get('t'), 28)]
            }, {
              stay: [b2.get('x')]
            }
          ]);
          G.render();
          return _.defer(function() {
            assert.equal(b2.get('w').value(), 500);
            assert.equal(b2.get('x').value(), 0);
            return done();
          });
        });
        it('class selector', function(done) {
          test.classConstraints = constrain([
            {
              equal: [['r', 'y'], [V$('.stay-c'), b2]],
              strength: G.required
            }, {
              stay: [V$('.stay-c').get('x')]
            }
          ]);
          G.render();
          return _.defer(function() {
            assert.equal(b0.get('w').value(), b2.get('w').value());
            assert.equal(b0.get('x').value(), b2.get('x').value());
            assert.equal(b1.get('w').value(), b2.get('w').value());
            assert.equal(b1.get('x').value(), b2.get('x').value());
            return done();
          });
        });
        return it('asynchronous additions', function(done) {
          var ab0,
            _this = this;
          ab0 = App.Box.create({
            id: 'astay0',
            "class": 'stay-c'
          }).append();
          return _.defer(function() {
            G.render();
            assert.equal(ab0.get('w').value(), b2.get('w').value());
            assert.equal(ab0.get('x').value(), b2.get('x').value());
            return done();
          });
        });
      }
    });
    Test.create({
      title: "Basic View Destruction",
      describe: function() {
        it('destroy view', function() {
          var v;
          v = G.View.create({
            bob: true,
            id: 'destroyedView',
            "class": 'destroyable'
          });
          assert.ok(v.destroy != null);
          return v.destroy();
        });
        it('destroy box', function() {
          var b;
          b = App.Box.create({
            id: 'destroyedBox1',
            "class": 'destroyable'
          });
          return b.destroy();
        });
        it('destroy constrained box before solver resolution', function(done) {
          var b, c1, c2, w;
          b = App.Box.create({
            id: 'destroyedBox2',
            "class": 'destroyable'
          });
          w = b.get('w');
          c1 = constrain({
            c: [w, '>=', 100]
          });
          c2 = constrain({
            c: [b.get('h'), '>=', 100]
          });
          assert.equal(b.get('constraintVariables.length'), 2, 'constraintVariables.length == 2');
          assert.equal(b.get('constraintPrimitives.length'), 2, 'constraintPrimitives.length == 2');
          assert.ok(G.get('solver').containsVariable(w), 'solver contains var');
          b.destroy();
          G.solve();
          G.resolve();
          return _.defer(function() {
            assert.ok(!(b.get('constraintVariables.length') != null), 'shouldnt even get vars');
            assert.ok(b.isDestroyed, '.isDestroyed');
            __WARN("assert.ok !G.get('solver').containsVariable(w), 'solver does not contain var'");
            return done();
          });
        });
        it('destroy constrained box after solver resolution', function(done) {
          var b;
          b = App.Box.create({
            id: 'destroyedBox3',
            "class": 'destroyable'
          });
          constrain({
            c: [b.get('w'), '>=', 100]
          });
          constrain({
            c: [b.get('h'), '>=', 100]
          });
          assert.ok(b.get('constraintVariables.length') > 0);
          G.resolve();
          return _.defer(function() {
            b.destroy();
            assert.ok(b.isDestroyed);
            return done();
          });
        });
        it('destroy constrained box after appended and solver resolution', function(done) {
          var b;
          b = App.Box.create({
            id: 'destroyedBox4',
            "class": 'destroyable'
          }).append();
          constrain({
            c: [b.get('w'), '>=', 100]
          });
          constrain({
            c: [b.get('h'), '>=', 100]
          });
          assert.ok(b.get('constraintVariables.length') > 0);
          G.render();
          return _.defer(function() {
            b.destroy();
            assert.ok(b.isDestroyed);
            return _.defer(function() {
              G.render();
              return done();
            });
          });
        });
        return it("V('.destroyable') query should be empty...", function(done) {
          assert.equal(V$('.destroyable').length, 0);
          return done();
        });
      }
    });
    Test.create({
      title: "Implicit VFL View Destruction",
      describe: function() {
        var boxes, boxesV$, containerV$,
          _this = this;
        boxes = App.Box.create([
          {
            id: 'vfl-destroy-1',
            "class": 'vfl-destroy'
          }, {
            id: 'vfl-destroy-2',
            "class": 'vfl-destroy'
          }, {
            id: 'vfl-destroy-3',
            "class": 'vfl-destroy'
          }, {
            "class": 'vfl-destroy-container'
          }
        ]).invoke('append');
        boxesV$ = V$('.vfl-destroy');
        containerV$ = V$('.vfl-destroy-container');
        it('layout', function(done) {
          _this.align(containerV$[0]);
          constrain({
            h: boxesV$,
            contain: true,
            "super": containerV$
          });
          G.render();
          return _.defer(function() {
            assert.ok(boxesV$[0].get('r').value() < boxesV$[1].get('l').value(), "layout works");
            assert.ok(boxesV$[1].get('r').value() < boxesV$[2].get('l').value(), "layout works");
            return done();
          });
        });
        it('destroy', function(done) {
          var box, _i, _len;
          for (_i = 0, _len = boxesV$.length; _i < _len; _i++) {
            box = boxesV$[_i];
            box.destroy();
          }
          G.render();
          return _.defer(function() {
            assert.equal(containerV$[0].get('w').value(), 50, "constraints were removed from container");
            assert.equal(boxesV$.length, 0, 'view query is emptied');
            return done();
          });
        });
        it('recreate boxes', function(done) {
          var newBoxes;
          newBoxes = App.Box.create([
            {
              id: 'vfl-destroy-b-1',
              "class": 'vfl-destroy'
            }, {
              id: 'vfl-destroy-b-2',
              "class": 'vfl-destroy'
            }, {
              id: 'vfl-destroy-b-3',
              "class": 'vfl-destroy'
            }
          ]).invoke('append');
          return _.defer(function() {
            assert.equal(boxesV$.length, 3, 'view query filled again');
            assert.ok(boxesV$[0].get('r').value() < boxesV$[1].get('l').value(), "layout works");
            assert.ok(boxesV$[1].get('r').value() < boxesV$[2].get('l').value(), "layout works");
            return done();
          });
        });
        it('destroyed second time', function(done) {
          var box, _i, _len;
          for (_i = 0, _len = boxesV$.length; _i < _len; _i++) {
            box = boxesV$[_i];
            box.destroy();
          }
          G.render();
          return _.defer(function() {
            assert.equal(containerV$[0].get('w').value(), 50, "constraints were removed from container");
            assert.equal(boxesV$.length, 0, 'view query is emptied');
            return done();
          });
        });
        it('recreate boxes second time', function(done) {
          var newBoxes;
          newBoxes = App.Box.create([
            {
              id: 'vfl-destroy-c-1',
              "class": 'vfl-destroy'
            }, {
              id: 'vfl-destroy-c-2',
              "class": 'vfl-destroy'
            }, {
              id: 'vfl-destroy-c-3',
              "class": 'vfl-destroy'
            }
          ]).invoke('append');
          return _.defer(function() {
            assert.equal(boxesV$.length, 3, 'view query filled again');
            assert.ok(boxesV$[0].get('r').value() < boxesV$[1].get('l').value(), "layout works");
            assert.ok(boxesV$[1].get('r').value() < boxesV$[2].get('l').value(), "layout works");
            return done();
          });
        });
        it('destroyed third time', function(done) {
          var box, _i, _len;
          for (_i = 0, _len = boxesV$.length; _i < _len; _i++) {
            box = boxesV$[_i];
            box.destroy();
          }
          G.render();
          return _.defer(function() {
            assert.equal(containerV$[0].get('w').value(), 50, "constraints were removed from container");
            assert.equal(boxesV$.length, 0, 'view query is emptied');
            return done();
          });
        });
        return it('recreate boxes  third time with same ids', function(done) {
          var newBoxes;
          newBoxes = App.Box.create([
            {
              id: 'vfl-destroy-c-1',
              "class": 'vfl-destroy'
            }, {
              id: 'vfl-destroy-c-2',
              "class": 'vfl-destroy'
            }, {
              id: 'vfl-destroy-c-3',
              "class": 'vfl-destroy'
            }
          ]).invoke('append');
          _.defer(function() {
            assert.equal(boxesV$.length, 3, 'view query filled again');
            assert.ok(boxesV$[0].get('r').value() < boxesV$[1].get('l').value(), "layout works");
            assert.ok(boxesV$[1].get('r').value() < boxesV$[2].get('l').value(), "layout works");
            return done();
          });
          return 'fuck you';
        });
      }
    });
    Test.create({
      title: "Equal Constraint View Destruction",
      describe: function() {
        return it('should work', function(done) {
          return assert.ok(false);
        });
      }
    });
    Test.create({
      title: "Ready For Each Ember Mixin",
      describe: function() {
        return describe("Census", function() {
          var censusCallBack, people,
            _this = this;
          censusCallBack = function(person) {
            return this.names.pushObject(person.name);
          };
          people = Em.ArrayController.create(Em.ReadyForEachMixin, {
            content: [
              {
                name: 'frank'
              }, {
                name: 'joe'
              }
            ],
            names: []
          });
          it('census is registered', function(done) {
            people.readyForEach(censusCallBack);
            assert.equal(people.get('readyForEachCallBacks')[0], censusCallBack);
            assert.equal(people.get('readyForEachCallBacks').length, 1);
            return done();
          });
          it('census applied to initial population', function() {
            assert.equal(people.names.length, 2);
            assert.equal(people.names[0], 'frank');
            return assert.equal(people.names[1], 'joe');
          });
          return it('new people register', function(done) {
            people.pushObject({
              name: 'bob'
            });
            assert.equal(people.names.length, 3);
            assert.equal(people.names[2], 'bob');
            return done();
          });
        });
      }
    });
    Test.create({
      id: 'solver',
      title: 'Solver',
      describe: function() {
        var b1, b2, s1, s1c1, s1c2, s2, s2c1, s2c2, x1, x2, _ref;
        this.s1 = s1 = G.Solver.create();
        this.s2 = s2 = G.Solver.create();
        s1.autoSolve = true;
        s2.autoSolve = true;
        _ref = App.Box.create([
          {
            id: 'ss-1'
          }, {
            id: 'ss-2'
          }
        ]), b1 = _ref[0], b2 = _ref[1];
        this.x1 = x1 = b1.get('x');
        this.x2 = x2 = b2.get('x');
        this.s1c1 = s1c1 = constrain({
          c: [x1, '==', 100],
          solver: s1,
          strength: G.required
        });
        s1c2 = constrain({
          c: [x2, '==', 100],
          solver: s1,
          strength: G.required
        });
        s2c1 = constrain({
          c: [x1, '==', 10],
          solver: s2,
          strength: G.required
        });
        s2c2 = constrain({
          c: [x2, '==', 10],
          solver: s2,
          strength: G.required
        });
        return it('solver overrides', function() {
          s1.resolve();
          assert.equal(x1.value(), 100);
          s2.resolve();
          assert.equal(x1.value(), 10);
          s1.resolve();
          return assert.equal(x1.value(), 100);
        });
      }
    });
    Test.create({
      boxes: App.Box.create({
        id: 'subs-container-nonasync',
        "class": 'subs-container',
        childViews: ['subs-child1', 'subs-child2', 'subs-child3'],
        'subs-child1': App.Box.create({
          "class": 'subs-child1'
        }),
        'subs-child2': App.Box.create({
          "class": 'subs-child2'
        }),
        'subs-child3': App.Box.create({
          "class": 'subs-child3'
        })
      }).append(),
      title: 'constraining via contextual view queries and readyForEach API',
      describe: function() {
        var _this = this;
        it("readyForEach constraints for one view", function(done) {
          var containerV$;
          assert.ok(true);
          containerV$ = V$('.subs-container');
          constrain([
            {
              c: [containerV$.get('w'), '>=', 200]
            }, {
              c: [containerV$.get('h'), '>=', 200]
            }
          ]);
          _this.align(containerV$);
          containerV$.controller.readyForEach(function(view) {
            var V$, child1, child2, child3;
            V$ = _.bind(view.V$, view);
            child1 = V$('.subs-child1');
            child2 = V$('.subs-child2');
            child3 = V$('.subs-child3');
            return constrain([
              {
                h: ['|', [child1], '-', [child2], '-', [child3], '|'],
                "super": view,
                equal: ['w', [child1, child2, child3]]
              }, {
                v: ['|', [child1], '-', [child2], '-', [child3], '|'],
                "super": view,
                equal: ['h', [child1, child2, child3]]
              }
            ]);
          });
          return done();
        });
        return describe("readyForEach constraints for class of views", function() {
          var i, _i,
            _this = this;
          for (i = _i = 1; _i <= 3; i = ++_i) {
            App.Box.create({
              id: "subs-container-" + i,
              "class": 'subs-container',
              childViews: ['subs-child1', 'subs-child2', 'subs-child3'],
              'subs-child1': App.Box.create({
                id: "subs-child1-" + i,
                "class": 'subs-child1'
              }),
              'subs-child2': App.Box.create({
                "class": 'subs-child2'
              }),
              'subs-child3': App.Box.create({
                "class": 'subs-child3'
              })
            }).append();
          }
          it("contextual view query V$('.subs-child1', '#subs-container-1')", function(done) {
            var _this = this;
            return _.defer(function() {
              var subViewByStrings;
              subViewByStrings = V$('.subs-child1', "#subs-container-1");
              assert.equal(subViewByStrings[0].get('id'), 'subs-child1-1');
              return done();
            });
          });
          it("contextual view query V$('.subs-child1', view)", function(done) {
            var subViewByViewContext, view;
            view = V$('#subs-container-1')[0];
            subViewByViewContext = V$('.subs-child1', view);
            assert.equal(subViewByViewContext[0].get('id'), 'subs-child1-1');
            return done();
          });
          it("contextual view query view.V$('.subs-child1')", function(done) {
            var subViewBySubQuery, view;
            view = V$('#subs-container-1')[0];
            subViewBySubQuery = view.V$('.subs-child1');
            assert.equal(subViewBySubQuery[0].get('id'), 'subs-child1-1');
            return done();
          });
          it("the 4 containers should align ", function(done) {
            return _.defer(function() {
              var views;
              assert.ok(true);
              views = V$('.subs-container');
              assert.equal(views[0].get('x').value(), views[1].get('x').value());
              assert.equal(views[1].get('x').value(), views[2].get('x').value());
              assert.equal(views[2].get('x').value(), views[3].get('x').value());
              assert.equal(views[0].get('y').value(), views[1].get('y').value());
              assert.equal(views[1].get('y').value(), views[2].get('y').value());
              assert.equal(views[2].get('y').value(), views[3].get('y').value());
              return done();
            });
          });
          return it("the children of the 4 containers should align ", function(done) {
            return _.defer(function() {
              var views;
              assert.ok(true);
              views = V$('.subs-container .subs-child3');
              assert.equal(views[0].get('x').value(), views[1].get('x').value());
              assert.equal(views[1].get('x').value(), views[2].get('x').value());
              assert.equal(views[2].get('x').value(), views[3].get('x').value());
              assert.equal(views[0].get('y').value(), views[1].get('y').value());
              assert.equal(views[1].get('y').value(), views[2].get('y').value());
              assert.equal(views[2].get('y').value(), views[3].get('y').value());
              assert.equal(V$('.subs-container')[0].get('r').value(), views[3].get('r').value());
              assert.equal(V$('.subs-container')[0].get('b').value(), views[3].get('b').value());
              return done();
            });
          });
        });
      }
    });
    Test.create({
      title: 'Implicit VFL Stacks with Containment',
      boxes: App.Box.create([
        {
          id: 'stack'
        }, {
          id: 'stackitem1',
          "class": 'stackitem'
        }, {
          id: 'stackitem2',
          "class": 'stackitem'
        }
      ]).invoke('append'),
      describe: function() {
        var gap, stackContainerV$, stackItemsV$,
          _this = this;
        stackContainerV$ = V$('#stack');
        stackItemsV$ = V$('.stackitem');
        gap = 10;
        it('should setup', function(done) {
          constrain({
            h: stackItemsV$,
            gap: gap,
            superGap: 20,
            contain: true,
            "super": stackContainerV$
          });
          _this.align(stackContainerV$);
          assert.ok(true);
          return done();
        });
        it('should apply to initial views', function(done) {
          G.resolve();
          assert.equal(V$('#stackitem1')[0].get('r').value() + gap, V$('#stackitem2')[0].get('l').value());
          assert.equal(V$('#stackitem1')[0].get('t').value(), V$('#stackitem2')[0].get('t').value());
          return done();
        });
        it('async setup', function(done) {
          return _.defer(function() {
            App.Box.create([
              {
                id: 'stackitem3',
                "class": 'stackitem'
              }, {
                id: 'stackitem4',
                "class": 'stackitem'
              }
            ]).invoke('append');
            return done();
          });
        });
        return it('should apply to asyncly added views', function(done) {
          return _.defer(function() {
            assert.equal(V$('#stackitem2')[0].get('r').value() + gap, V$('#stackitem3')[0].get('l').value());
            assert.equal(V$('#stackitem3')[0].get('t').value(), V$('#stackitem2')[0].get('t').value());
            return done();
          });
        });
      }
    });
    Test.create({
      title: 'G.View',
      describe: function() {
        it('there can only be one highlander', function() {
          G.View.create({
            id: 'asdf'
          });
          return assert.throws(function() {
            return G.View.create({
              id: 'asdf'
            });
          });
        });
        describe('id-elementId binding', function() {
          it('id set', function() {
            var b;
            b = G.View.create({
              id: 'idBind1'
            });
            return assert.equal(b.get('id'), b.get('elementId'));
          });
          it('elementId set', function() {
            var b;
            b = G.View.create({
              elementId: 'idBind2'
            });
            return assert.equal(b.get('id'), b.get('elementId'));
          });
          it('both set', function() {
            var b;
            b = G.View.create({
              id: 'idBind3',
              elementId: 'idBind4'
            });
            assert.equal(b.get('id'), 'idBind4');
            return assert.equal(b.get('elementId'), 'idBind4');
          });
          return it('neither set', function() {
            var b;
            b = G.View.create();
            assert.equal(b.get('id'), b.get('elementId'));
            assert.equal(typeof b.get('id'), "string");
            return assert.equal(typeof b.get('elementId'), "string");
          });
        });
        return describe('solver', function() {
          it('window solver', function() {
            assert.ok(G.get('solver'));
            assert.ok(G.window.get('solver'));
            return assert.equal(_.getUniqueId(G.get('solver')), _.getUniqueId(G.window.get('solver')));
          });
          return it('deferred instantiation', function() {});
        });
      }
    });
    Test.create({
      title: 'V$',
      boxes: App.Box.create([
        {
          id: 'query1',
          "class": 'query',
          isVisible: false
        }, {
          id: 'query2',
          "class": 'query',
          isVisible: false
        }, {
          id: 'query3',
          "class": 'query',
          isVisible: false
        }
      ]).invoke('append'),
      describe: function() {
        var b1, b2, b3, _ref,
          _this = this;
        _ref = this.get('boxes'), b1 = _ref[0], b2 = _ref[1], b3 = _ref[2];
        it('V$ window', function() {
          assert.equal(V$(window), G.window);
          assert.equal(V$('window'), G.window);
          return assert.equal(V$(V$('window')), G.window);
        });
        it('V$ document', function() {
          assert.equal(V$(document), G.document);
          assert.equal(V$('document'), G.document);
          return assert.equal(V$(V$('document')), G.document);
        });
        it('V$ string id', function() {
          return assert.equal(V$('#query1')[0], b1);
        });
        it('V$ pass view through', function() {
          return assert.equal(V$(b1), b1);
        });
        it('V$ pass array of views', function(done) {
          var vs;
          vs = V$([b1, b2, b3]);
          assert.equal(vs[0], b1);
          assert.equal(vs[1], b2);
          assert.equal(vs[2], b3);
          return done();
        });
        it('V$ pass array of views and id strings: TBD !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', function() {
          return assert.ok(true);
        });
        it("V$('.query') returns Array w/ query", function() {
          var q;
          q = V$('.query');
          assert.ok(q.isV$);
          assert.ok(q.query);
          return assert.ok(_.isArray(q));
        });
        it("V$('.queryNothing') returns empty Array w/ query", function() {
          var q;
          q = V$('.queryNothing');
          assert.ok(q.query);
          return assert.ok(_.isArray(q));
        });
        it("V$('.query') returns Array of views in existence", function() {
          var q;
          q = V$('.query');
          assert.equal(q[0], b1);
          assert.equal(q[1], b2);
          return assert.equal(q[2], b3);
        });
        it("V$ $('.query')", function() {
          var bs;
          bs = V$($('.query'));
          assert.ok(!bs.query);
          assert.equal(bs[0], b1);
          assert.equal(bs[1], b2);
          return assert.equal(bs[2], b3);
        });
        it("pass view query through", function() {
          var q, q2;
          q = V$('.query');
          q2 = V$(q);
          return assert.equal(_.getUniqueId(q), _.getUniqueId(q2));
        });
        it("V$('#ElementThatWillNotExist') ok if view !exists", function() {
          return assert.ok(V$('#ElementThatWillNotExist'));
        });
        it("V$('.repeated') always returns same query object", function(done) {
          var uid1, uid2, uid3;
          uid1 = _.getUniqueId(V$('.repeated'));
          uid2 = _.getUniqueId(V$('.repeated'));
          uid3 = _.getUniqueId(V$('.repeated'));
          assert.equal(uid1, uid2);
          assert.equal(uid2, uid3);
          return done();
        });
        describe("V$ plugins", function() {
          return it("V$.fn", function() {
            G.V$.fn.returnContent = function() {
              return this.get('content');
            };
            assert.notEqual(_.getUniqueId(V$('.whatever').returnContent()), _.getUniqueId(V$('.whatever2').returnContent()));
            return assert.equal(_.getUniqueId(V$('.whatever').returnContent()), _.getUniqueId(V$('.whatever').returnContent()));
          });
        });
        return describe("V$('.async-query')", function() {
          var q,
            _this = this;
          q = V$('.async-query');
          it('should be empty', function() {
            return assert.equal(q.length, 0);
          });
          return it('should have 1 view', function(done) {
            var b,
              _this = this;
            b = App.Box.create({
              id: 'aq1',
              "class": 'async-query',
              isVisible: false
            });
            b.append();
            return _.defer(function() {
              assert.equal(q.length, 1);
              assert.equal(_.getUniqueId(q[0]), _.getUniqueId(b));
              return done();
            });
          });
        });
      }
    });
    Test.create({
      title: 'Constraint Operators',
      describe: function() {
        describe('Binary operators where e1 is Number, e2 is Number', function() {
          it('1 + 1 = 2', function() {
            return assert.equal(G.plus(1, 1), 2);
          });
          it('2 - 1 = 1', function() {
            return assert.equal(G.minus(2, 1), 1);
          });
          it('10 * 10 = 100 // G.times', function() {
            return assert.equal(G.times(10, 10), 100);
          });
          it('10 * 10 = 100 // G.multiply', function() {
            return assert.equal(G.multiply(10, 10), 100);
          });
          return it('1 / 2 = .5', function() {
            return assert.equal(G.divide(1, 2), .5);
          });
        });
        return describe('prop._viewIds', function() {
          var b, b2,
            _this = this;
          b = G.View.create({
            id: 'track-id'
          });
          b2 = G.View.create({
            id: 'track-id2'
          });
          it('w', function() {
            return assert.equal(b.get('w')._viewIds[0], 'track-id');
          });
          it('h', function() {
            return assert.equal(b.get('h')._viewIds[0], 'track-id');
          });
          it('x', function() {
            return assert.equal(b.get('x')._viewIds[0], 'track-id');
          });
          it('y', function() {
            return assert.equal(b.get('y')._viewIds[0], 'track-id');
          });
          it('cx', function() {
            return assert.equal(b.get('cx')._viewIds[0], 'track-id');
          });
          it('cy', function() {
            return assert.equal(b.get('cy')._viewIds[0], 'track-id');
          });
          it('plus', function() {
            assert.equal(G.plus(b.get('w'), 10)._viewIds[0], 'track-id');
            assert.equal(G.plus(b.get('w'), b2.get('w'))._viewIds[1], 'track-id2');
            return assert.equal(G.plus(G.plus(b.get('w'), b2.get('w')), G.plus(b.get('w'), b2.get('w')))._viewIds.length, 2);
          });
          it('minus', function() {
            return assert.equal(G.minus(b.get('w'), 10)._viewIds[0], 'track-id');
          });
          it('times', function() {
            return assert.equal(G.times(b.get('w'), 10)._viewIds[0], 'track-id');
          });
          return it('divide', function() {
            return assert.equal(G.divide(b.get('w'), 10)._viewIds[0], 'track-id');
          });
        });
      }
    });
    Test.create({
      title: 'Equal Constraints',
      boxes: App.Box.create([
        {
          id: 'equal-c0',
          "class": 'equal-c'
        }, {
          id: 'equal-c1',
          "class": 'equal-c'
        }, {
          id: 'equal-c2',
          "class": 'equal-c'
        }, {
          id: 'equal-c3'
        }, {
          id: 'equal-c4'
        }
      ]).invoke('append'),
      describe: function() {
        var b0, b1, b2, b3, b4, primitiveTestForClassSelector, test, that, _ref,
          _this = this;
        _ref = this.boxes, b0 = _ref[0], b1 = _ref[1], b2 = _ref[2], b3 = _ref[3], b4 = _ref[4];
        that = this;
        test = this;
        it('should setup', function(done) {
          return _.defer(function() {
            assert.ok(_this.align(b0));
            return done();
          });
        });
        it('single equal works', function() {
          var c;
          c = constrain({
            equal: ['t', [b0]]
          });
          return assert.equal(c.get('primitives.length'), 1);
        });
        describe('should work with id selectors', function() {
          it("id selectors & mutliple equals", function(done) {
            _this.idConstraints = constrain([
              {
                equal: [['t', 'l'], [b0, '#equal-c3', b4]],
                strength: G.required
              }, {
                equal: ['w', [b0, '#equal-c3', b4]],
                strength: G.required
              }
            ]);
            G.render();
            return _.defer(function() {
              var target;
              target = _this.get('t');
              assert.equal(b0.get('t').value(), target);
              assert.equal(b3.get('t').value(), target);
              assert.equal(b4.get('t').value(), target);
              return done();
            });
          });
          return it("primitives.length", function(done) {
            assert.equal(_this.idConstraints[0].get('primitives.length'), 6);
            assert.equal(_this.idConstraints[1].get('primitives.length'), 3);
            return done();
          });
        });
        primitiveTestForClassSelector = function(done) {
          var cs, inDomCount;
          inDomCount = $('.equal-c').length;
          cs = test.classConstraints;
          assert.equal(cs[0].get('primitives.length'), inDomCount * 3);
          return done();
        };
        describe('should work with class selectors', function() {
          var _this = this;
          it("values", function(done) {
            test.classConstraints = constrain([
              {
                equal: [['t', 'w', 'l'], ['.equal-c']],
                strength: G.required
              }
            ]);
            G.render();
            return _.defer(function() {
              var target;
              target = that.get('t');
              assert.equal(b0.get('t').value(), target);
              assert.equal(b1.get('t').value(), target);
              assert.equal(b2.get('t').value(), target);
              return done();
            });
          });
          return it("primitives.length", function(done) {
            return primitiveTestForClassSelector(done);
          });
        });
        describe('should handle asynchronous DOM addition', function() {
          it("values", function(done) {
            var ab1,
              _this = this;
            ab1 = App.Box.create({
              id: 'a-equal-1',
              "class": 'equal-c'
            }).append();
            return _.defer(function() {
              var target;
              G.render();
              target = that.get('t');
              assert.equal(ab1.get('t').value(), target);
              assert.equal(ab1.get('w').value(), b0.get('w').value());
              return done();
            });
          });
          return it("primitives.length", function(done) {
            return primitiveTestForClassSelector(done);
          });
        });
        describe('should handle many asynchronous DOM additions', function() {
          it("values", function(done) {
            var ab2, ab3, ab4, _ref1,
              _this = this;
            _ref1 = App.Box.create([
              {
                "class": 'equal-c'
              }, {
                "class": 'equal-c'
              }, {
                "class": 'equal-c'
              }
            ]).invoke('append'), ab2 = _ref1[0], ab3 = _ref1[1], ab4 = _ref1[2];
            return _.defer(function() {
              var target;
              G.render();
              target = that.get('t');
              assert.equal(ab2.get('t').value(), target);
              assert.equal(ab3.get('t').value(), target);
              assert.equal(ab3.get('t').value(), target);
              assert.equal(ab4.get('t').value(), target);
              assert.equal(ab2.get('w').value(), b0.get('w').value());
              return done();
            });
          });
          return it("primitives.length", function(done) {
            return primitiveTestForClassSelector(done);
          });
        });
        return describe('should handle asynchronous DOM removal', function() {
          return it("values", function(done) {
            return done();
          });
        });
        /*
                it 'equal constraint should work with class selector', ->
                  _.defer =>
                    constrain 
                      equal: ['t',['.equal-c']]
                    assert.ok true
        */

      }
    });
    Test.create({
      title: "Constraint Equations & Inequalities w/ Async Id Selectors",
      boxes: App.Box.create([
        {
          id: 'async-id-0'
        }
      ]).invoke('append'),
      describe: function() {
        var test;
        test = this;
        it('setup constraints', function(done) {
          assert.ok(constrain([
            {
              c: [V$('#async-id-0').get('y'), '==', test.get('t'), '==', V$('#async-id-1').get('t')]
            }, {
              c: [V$('#async-id-0').get('x'), '>=', 500, '<=', V$('#async-id-1').get('x')]
            }
          ]));
          return done();
        });
        it('view w/ ID is added, get correct values', function(done) {
          return _.defer(function() {
            var b1;
            b1 = App.Box.create({
              id: 'async-id-1'
            }).append();
            return _.defer(function() {
              G.render();
              assert.equal(b1.get('x').value(), 500);
              assert.equal(b1.get('y').value(), test.get('t'));
              return done();
            });
          });
        });
        it('required center constraint with document to view that will not exist', function(done) {
          assert.ok(constrain({
            c: [G.get(V$("#will-never-exist"), "cx"), "==", G.get(V$("#document"), "cx")],
            strength: G.required
          }));
          return done();
        });
        it('VFL constraint with doc to view that will not exist', function(done) {
          assert.ok(constrain({
            h: ["|", "-", [V$("#will-never-exist")], "-", "|"],
            "super": V$("#document")
          }));
          return done();
        });
        return it('VFL constraint views that will not exist', function(done) {
          assert.ok(constrain({
            h: ["|", "-", [V$("#will-never-exist")], "-", "|"],
            "super": V$("#will-never-exist-2")
          }));
          return done();
        });
      }
    });
    Test.create({
      title: "Equations & Inequalities w/ Class Selectors",
      boxes: App.Box.create([
        {
          id: 'b-eq-0'
        }, {
          id: 'b-eq-1',
          "class": 'b-eq'
        }, {
          id: 'b-eq-2',
          "class": 'b-eq'
        }
      ]).invoke('append'),
      describe: function() {
        var b0, b1, b2, test, _ref,
          _this = this;
        _ref = this.boxes, b0 = _ref[0], b1 = _ref[1], b2 = _ref[2];
        test = this;
        it('setup constraints', function(done) {
          assert.ok(test.cs = constrain([
            {
              c: [b0.get('y'), '==', test.get('t'), '==', V$('.b-eq').get('t')]
            }, {
              c: [b0.get('x'), '>=', 500, '<=', V$('.b-eq').get('x')]
            }
          ]));
          return done();
        });
        it('values', function(done) {
          G.render();
          return _.defer(function() {
            var targetY;
            targetY = test.get('t');
            assert.equal(b0.get('y').value(), targetY);
            assert.equal(b1.get('y').value(), targetY);
            assert.equal(b2.get('y').value(), targetY);
            return done();
          });
        });
        return it('async dom additions', function(done) {
          var b3, b4, _ref1;
          _ref1 = App.Box.create([
            {
              id: 'b-eq-3',
              "class": 'b-eq'
            }, {
              id: 'b-eq-4',
              "class": 'b-eq'
            }
          ]).invoke('append'), b3 = _ref1[0], b4 = _ref1[1];
          return _.defer(function() {
            var targetY;
            G.render();
            targetY = test.get('t');
            assert.equal(b3.get('y').value(), targetY);
            assert.equal(b4.get('y').value(), targetY);
            return done();
          });
        });
      }
    });
    Test.create({
      title: 'Constraint Layout Internals',
      describe: function() {
        var boxStatic1, constraint, el, h_o, l_o, t_o, w,
          _this = this;
        el = $('#boxStatic1');
        h_o = el.height();
        l_o = el.position().left;
        t_o = el.position().top;
        boxStatic1 = V$('#boxStatic1')[0];
        w = boxStatic1.get('w');
        constraint = constrain({
          c: [500, '<=', w, "<=", 1000]
        });
        describe('Internal flow with DOM elment:\n 500 <= #boxStatic1.w <= 1000', function() {
          it('grail element should exist', function() {
            return assert.ok(boxStatic1);
          });
          it('constraint var should exist', function() {
            return assert.ok(w);
          });
          it('c.primitives.length is 2', function() {
            return assert.equal(constraint.get('primitives.length'), 2);
          });
          it('cExpressions.length is 3', function() {
            return assert.equal(constraint.cExpressions.length, 3);
          });
          it('boxStatic1.w is 500', function() {
            G.render();
            return assert.equal(w.value(), 500);
          });
          it('boxStatic1 should retain original height if not constrained', function() {
            return assert.equal(boxStatic1.get('h').value(), h_o);
          });
          return it('boxStatic1 should retain original position if x or y are not constrained', function() {
            return assert.equal(boxStatic1.get('l').value(), l_o);
          });
        });
        return describe('Testing Strengths', function() {
          it('should setup', function(done) {
            var _this = this;
            this.boxStrengthTest = App.Box.create({
              'elementId': 'boxStrengthTest'
            }).append();
            constrain([
              {
                c: [1000, '<=', this.boxStrengthTest.get('w')],
                strength: G.weak
              }, {
                c: [200, '>=', this.boxStrengthTest.get('w')],
                strength: G.strong
              }, {
                c: [1000, '<=', this.boxStrengthTest.get('h')],
                weight: 0
              }, {
                c: [200, '>=', this.boxStrengthTest.get('h')],
                weight: 100
              }
            ]);
            return _.defer(function() {
              G.render();
              return done();
            });
          });
          it('w == 200', function() {
            return assert.equal(this.boxStrengthTest.get('w').value(), 200);
          });
          return it('h == 200', function() {
            return assert.equal(this.boxStrengthTest.get('h').value(), 200);
          });
        });
      }
    });
    Test.create({
      title: 'Constraint Layout Basics',
      boxes: App.Box.create([
        {
          'id': 'b0'
        }, {
          'id': 'b1'
        }
      ]).invoke('append'),
      describe: function() {
        var b0, b1, _ref,
          _this = this;
        _ref = this.boxes, b0 = _ref[0], b1 = _ref[1];
        it('instance of G.View', function() {
          return assert.ok(b1 instanceof G.View);
        });
        it('batch add constraints', function() {
          var cs;
          cs = constrain([
            {
              c: [b1.get('r'), "==", b0.get('l')]
            }, {
              c: [500, "<=", b1.get('x')]
            }, {
              c: [1000, "<=", b1.get('r'), "<=", 1500]
            }, {
              c: [150, "<=", b1.get('h')]
            }, {
              c: [1000, "<=", b0.get('w')]
            }, {
              c: [100, "<=", b1.get('w')]
            }, {
              c: [_this.get('t'), "==", b0.get('y'), "==", b1.get('y')]
            }
          ]);
          return assert.ok(cs);
        });
        return it('values', function(done) {
          G.render();
          return _.defer(function() {
            assert.equal(b1.get('r').value(), b0.get('l').value());
            assert.equal(_this.get('t'), b0.get('t').value());
            assert.equal(_this.get('t'), b1.get('t').value());
            return done();
          });
        });
      }
    });
    Test.create({
      title: 'Synchronously 3 Level Nested Views',
      boxes: App.Box.create([
        {
          id: 'nest0'
        }, {
          id: 'nest1'
        }, {
          id: 'nest2'
        }
      ]),
      describe: function() {
        var n0, n1, n2, test, _ref,
          _this = this;
        _ref = this.boxes, n0 = _ref[0], n1 = _ref[1], n2 = _ref[2];
        test = this;
        it('should align when synchronously appended & styled', function(done) {
          n0.append();
          return _.defer(function() {
            n0.pushChild(n1);
            return _.defer(function() {
              n1.pushChild(n2);
              return _.defer(function() {
                constrain([
                  {
                    c: [n0.get('l'), '==', 450]
                  }, {
                    c: [test.get('t'), '==', n0.get('t')]
                  }, {
                    equal: ['t', [n0, n1, n2]],
                    strength: G.required
                  }, {
                    equal: ['l', [n0, n1, n2]],
                    strength: G.required
                  }
                ]);
                G.render();
                return done();
              });
            });
          });
        });
        it('Var: n0 offset left is n1 ~1px', function() {
          return assert.ok((n0.get('_x') - n1.get('_x')) <= 1);
        });
        it('DOM: n0 offset top is n1 ~1px', function() {
          return assert.ok((Math.abs(n0.$().offset().top - n1.$().offset().top)) <= 1);
        });
        it('DOM: n1 offset top is n2 ~1px', function() {
          return assert.ok((Math.abs(n1.$().offset().top - n2.$().offset().top)) <= 1);
        });
        it('DOM: n0 offset left is n1 ~1px', function() {
          return assert.ok((Math.abs(n0.$().offset().left - n1.$().offset().left)) <= 1);
        });
        return it('DOM: n1 offset left is n2 ~1px', function() {
          return assert.ok((Math.abs(n1.$().offset().left - n2.$().offset().left)) <= 1);
        });
      }
    });
    Test.create({
      title: 'Asynchronously 3 Level Nested Views',
      boxes: App.Box.create([
        {
          id: 'nest0a'
        }, {
          id: 'nest1a'
        }, {
          id: 'nest2a'
        }
      ]),
      describe: function() {
        var n0, n1, n2, test, _ref,
          _this = this;
        _ref = this.boxes, n0 = _ref[0], n1 = _ref[1], n2 = _ref[2];
        test = this;
        it('should align when asynchronously applied styles then appended', function(done) {
          constrain([
            {
              c: [n0.get('l'), '==', 500]
            }, {
              c: [test.get('t'), '==', n0.get('t')]
            }, {
              equal: ['t', [n0, n1, n2]]
            }, {
              equal: ['l', [n0, n1, n2]]
            }
          ]);
          n0.append();
          G.render();
          return _.defer(function() {
            n0.$().append('<div><div id="nest0ainsert" style="position:absolute; left: 100px; right:100px; width: 100px; height:100px;"></div></div>');
            return _.defer(function() {
              n0.pushChild(n1);
              G.render();
              return _.defer(function() {
                n1.pushChild(n2);
                G.render();
                return _.defer(function() {
                  G.render();
                  assert.ok(true);
                  return done();
                });
              });
            });
          });
        });
        it('n0 offset top is n1 ~1px', function() {
          return assert.ok((Math.abs(n0.$().offset().top - n1.$().offset().top)) <= 1);
        });
        it('n1 offset top is n2 ~1px', function() {
          return assert.ok((Math.abs(n1.$().offset().top - n2.$().offset().top)) <= 1);
        });
        it('n0 offset left is n1 ~1px', function() {
          return assert.ok((Math.abs(n0.$().offset().left - n1.$().offset().left)) <= 1);
        });
        return it('n1 offset left is n2 ~1px', function() {
          return assert.ok((Math.abs(n1.$().offset().left - n2.$().offset().left)) <= 1);
        });
      }
    });
    Test.create({
      title: 'VFL Basix',
      boxes: App.Box.create([
        {
          'id': 'vflBasix0'
        }, {
          'id': 'vflBasix1'
        }, {
          'id': 'vflBasix2'
        }, {
          'id': 'vflBasix3'
        }
      ]).invoke('append'),
      describe: function() {
        var b1, b2, b3, b4, _ref,
          _this = this;
        _ref = this.boxes, b1 = _ref[0], b2 = _ref[1], b3 = _ref[2], b4 = _ref[3];
        it('h: v: [b1] [b2]', function(done) {
          constrain([
            {
              h: [[b1], [b2]]
            }, {
              v: [[b1], [b2]]
            }
          ]);
          G.resolve();
          return done();
        });
        it('h works: VAR', function() {
          assert.equal(b1.get('r').value(), b2.get('l').value());
          return assert.ok(b1.get('r').value() > 0);
        });
        /*
              it 'h works: DOM', (done)=>
                Ember.run.once =>
                  _.defer =>
                    b1$ = $('#vflBasix0')
        
                    assert.equal b1$.offset().left + b1$.width(), $('#vflBasix1').offset().left
                    done()
        */

        it('v works', function() {
          return assert.equal(b1.get('b').value(), b2.get('t').value());
        });
        it('h: [b2][b4]-[b3] v: [b4]-[b3]', function(done) {
          return _.defer(function() {
            constrain([
              {
                h: [[b2], [b4], '-', [b3]],
                v: [[b4], '-', [b3]],
                gap: 20
              }, {
                c: [_this.get('t'), '==', b1.get('t'), '==', b4.get('t')]
              }
            ]);
            G.resolve();
            return done();
          });
        });
        it('h works w/ gap', function() {
          assert.equal(b2.get('r').value(), b4.get('l').value());
          return assert.equal(b4.get('r').value() + 20, b3.get('l').value());
        });
        return it('v works w/ gap', function() {
          return assert.equal(b4.get('b').value() + 20, b3.get('t').value());
        });
      }
    });
    Test.create({
      title: "VFL w/ Sub Options & Equal",
      boxes: App.Box.create([
        {
          'elementId': 'bh1'
        }, {
          'elementId': 'bh2'
        }, {
          'elementId': 'bh3'
        }, {
          'elementId': 'bh4'
        }
      ]).invoke('append'),
      describe: function() {
        var bh1, bh2, bh3, bh4,
          _this = this;
        bh1 = this.boxes[0];
        bh2 = this.boxes[1];
        bh3 = this.boxes[2];
        bh4 = this.boxes[3];
        it("[['#bh2'], '-', ['#bh1',['>=', 300]], '-', [bh3], '-', ['#bh4', ['<=', 25], ['==', 10]]]", function(done) {
          var c;
          c = constrain({
            h: [['#bh2'], '-', ['#bh1', ['>=', 300]], '-', [bh3], '-', ['#bh4', ['<=', 25], ['==', 10]]]
          });
          G.resolve();
          return _.defer(function() {
            assert.equal(bh2.get('r').value(), bh1.get('l').value() - c.get('gap'));
            assert.equal(bh3.get('r').value(), bh4.get('l').value() - c.get('gap'));
            return done();
          });
        });
        it('Should assign width from sub options', function(done) {
          return _.defer(function() {
            assert.equal(bh1.get('w').value(), 300);
            assert.equal(bh4.get('w').value(), 10);
            return done();
          });
        });
        return it("equal: ['t', [bh1, bh2, bh3, b4]]", function(done) {
          var testY;
          testY = _this.get('t');
          constrain({
            equal: ['t', _this.boxes]
          });
          constrain([
            {
              c: [bh3.get('t'), '==', testY]
            }, {
              c: [bh2.get('l'), '==', G.document.get('cx')]
            }
          ]);
          G.render();
          assert.equal(testY, bh4.get('t').value());
          assert.equal(bh4.get('t').value(), bh3.get('t').value());
          assert.equal(bh3.get('t').value(), bh2.get('t').value());
          assert.equal(bh1.get('t').value(), bh1.get('t').value());
          return done();
        });
      }
    });
    Test.create({
      title: "VFL w/ Super View to G.document",
      boxes: App.Box.create([
        {
          'elementId': 'bs1'
        }, {
          'elementId': 'bs2'
        }
      ]).invoke('append'),
      describe: function() {
        var bs1, bs2,
          _this = this;
        bs1 = this.boxes[0];
        bs2 = this.boxes[1];
        it("h: ['|', 400, ['bs1'], 50, [bs2,['>=',G.multiply(bs1.get('w'),2)]], '-', '|']", function(done) {
          _this.c = constrain({
            h: ['|', 400, [bs1], 50, [bs2, ['>=', G.multiply(bs1.get('w'), 2)]], '-', '|'],
            "super": G.document
          });
          return _.defer(function() {
            assert.ok(_this.c);
            G.resolve();
            return done();
          });
        });
        it('bs1 should be against window + 400', function(done) {
          return _.defer(function() {
            assert.equal(bs1.get('l').value(), 400);
            return done();
          });
        });
        it('bs2 should be standard superGap from right of window', function(done) {
          return _.defer(function() {
            assert.equal(bs2.get('r').value(), V$('window').get('w').value() - _this.c.get('superGap'));
            return done();
          });
        });
        return it('---', function(done) {
          constrain({
            equal: ['t', [bs1, bs2]]
          });
          constrain([
            {
              c: [bs1.get('t'), '==', _this.get('t')]
            }, {
              c: [bs1.get('l'), '==', G.document.get('cx')]
            }
          ]);
          G.render();
          return done();
        });
      }
    });
    Test.create({
      title: "VFL w/ Super View as another view",
      boxes: App.Box.create([
        {
          'elementId': 'bsv1'
        }, {
          'elementId': 'bsv2'
        }, {
          'elementId': 'bsv3'
        }, {
          'elementId': 'bsv4'
        }
      ]).invoke('append'),
      describe: function() {
        var b1, b2, b3, b4, boxes,
          _this = this;
        boxes = this.boxes;
        b1 = boxes[0];
        b2 = boxes[1];
        b3 = boxes[2];
        b4 = boxes[3];
        return it("setup container", function(done) {
          return _.defer(function() {
            _this.align(b1);
            constrain([
              {
                h: ['|', 500, [b1], 500, '|'],
                "super": G.window
              }, {
                h: ['|', 10, [b2, ['>=', 100]], [b4], [b3], 10, '|'],
                "super": b1,
                strength: G.required
              }, {
                v: ['|', 10, [b2, ['>=', 100]], [b4], [b3], 10, '|'],
                "super": b1,
                strength: G.required
              }, {
                equal: ['h', [b2, b4, b3]],
                strength: G.required
              }, {
                equal: ['w', [b2, b4, b3]],
                strength: G.required
              }
            ]);
            G.render();
            return done();
          });
        });
      }
    });
    Test.create({
      title: "Grid Template Parse: [\"aabcc\", \"dddcc\"]",
      describe: function() {
        var grid, t;
        t = ["aabcc", "dddcc"];
        G.GridTemplate.parse(t);
        grid = t.__parsed;
        it("item count is 4", function() {
          return assert.equal(grid.slotCount, 4);
        });
        it("2 horizontal stacks", function() {
          return assert.equal(grid.hStacks.length, 2);
        });
        it("horizontal stacks are [['a','b','c'],['d','c']]", function() {
          return assert.equal(grid.hStacks.toString(), [['a', 'b', 'c'], ['d', 'c']].toString());
        });
        it("width map is {a:2,b:1,c:2,d:3}", function() {
          return assert.equal(grid.widthMap.toString(), {
            a: 2,
            b: 1,
            c: 2,
            d: 3
          }.toString());
        });
        it("3 vertical stacks", function() {
          return assert.equal(grid.vStacks.length, 3);
        });
        it("vertical stacks are [['a','d'],['b','d'],['c']]", function() {
          return assert.equal(grid.vStacks.toString(), [['a', 'd'], ['b', 'd'], ['c']].toString());
        });
        return it("heightMap is {a:1,b:1,c:2,d:1}", function() {
          assert.equal(grid.heightMap.a, 1);
          assert.equal(grid.heightMap.b, 1);
          assert.equal(grid.heightMap.c, void 0);
          return assert.equal(grid.heightMap.d, 1);
        });
      }
    });
    Test.create({
      title: "Grid Template Constraints Arithmetic",
      boxes: App.Box.create([
        {
          'elementId': 'gt1',
          "class": 'zone'
        }, {
          'elementId': 'gt2',
          "class": 'zone'
        }, {
          'elementId': 'gt3',
          "class": 'zone'
        }, {
          'elementId': 'gt4',
          "class": 'zone'
        }, {
          'elementId': 'gtContainer'
        }
      ]).invoke('append'),
      describe: function() {
        var b1, b2, b3, b4, container, _ref,
          _this = this;
        _ref = this.boxes, b1 = _ref[0], b2 = _ref[1], b3 = _ref[2], b4 = _ref[3], container = _ref[4];
        it('should setup', function(done) {
          constrain([
            {
              c: [container.get('w'), '>=', 500],
              strength: G.required
            }, {
              c: [container.get('h'), '>=', 500],
              strength: G.required
            }
          ]);
          G.GridTemplate.create({
            $: '.zone',
            "in": '#gtContainer',
            template: ["11122333", "44444333"],
            gap: [16, 16]
          });
          _this.align(container);
          G.render();
          return done();
        });
        it('align left edge of gt1 and gt4', function(done) {
          return _.defer(function() {
            assert.equal(V$('#gt1')[0].get('x').value(), V$('#gt4')[0].get('x').value());
            return done();
          });
        });
        return it('align right edge of gt2 and gt4', function(done) {
          return _.defer(function() {
            assert.equal(b2.get('x').value() + b2.get('w').value(), b4.get('x').value() + b4.get('w').value());
            return done();
          });
        });
      }
    });
    return describe('GRAIL Underscore', function() {
      return it('exists', function() {
        return assert.ok(_.randomInt);
      });
    });
    /*  
    describe 'Hello Test World',  () ->
    
      describe 'Araay#indexOf()', () ->
        it 'should return -1 when not present', () ->
          assert.equal(-1, [1,2,3].indexOf(4))
    
      describe 'Strings', ->
        it 'foo is string', ->
          foo = 'bar'
          expect(foo).to.be.a('string')
        it 'bob is not ok', ->
          expect(@bob).to.not.be.ok
    */

  });

}).call(this);
