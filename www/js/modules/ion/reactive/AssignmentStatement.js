(function(){require.register('ion/reactive/AssignmentStatement',function(module,exports,require){// Generated by CoffeeScript 1.6.3
(function() {
  var AssignmentStatement, Context, Operation, Statement, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function ___extends(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Operation = require('./Operation');

  Statement = require('./Statement');

  Context = require('./Context');

  module.exports = AssignmentStatement = (function(_super) {
    __extends(AssignmentStatement, _super);

    function AssignmentStatement() {
      _ref = AssignmentStatement.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AssignmentStatement.prototype.activate = function _activate() {
      var _this = this;
      AssignmentStatement.__super__.activate.call(this);
      if (this.leftExpression == null) {
        this.leftExpression = Operation.createRuntime(this.context, this.args[0]);
      }
      if (this.rightExpression == null) {
        this.rightExpression = Operation.createRuntime(this.context, this.args[1]);
      }
      this.leftExpression.watch(this.leftWatcher != null ? this.leftWatcher : this.leftWatcher = function _leftWatcher(leftValue) {
        _this.leftValue = leftValue;
        return _this._assign();
      });
      return this.rightExpression.watch(this.rightWatcher != null ? this.rightWatcher : this.rightWatcher = function _rightWatcher(rightValue) {
        _this.rightValue = rightValue;
        return _this._assign();
      });
    };

    AssignmentStatement.prototype._assign = function __assign() {
      if ((this.leftValue != null) && this.rightValue !== void 0) {
        if (this.original == null) {
          this.original = {};
        }
        if (!this.original.hasOwnProperty(this.leftValue)) {
          this.original[this.leftValue] = this.context["this"].hasOwnProperty(this.leftValue) ? this.context["this"][this.leftValue] : void 0;
        }
        return this.context["this"][this.leftValue] = this.rightValue;
      }
    };

    AssignmentStatement.prototype.deactivate = function _deactivate(revert) {
      var key, value, _ref1, _results;
      if (revert == null) {
        revert = true;
      }
      AssignmentStatement.__super__.deactivate.call(this);
      this.leftExpression.unwatch(this.leftWatcher);
      this.rightExpression.unwatch(this.rightWatcher);
      if (revert && (this.original != null)) {
        _ref1 = this.original;
        _results = [];
        for (key in _ref1) {
          value = _ref1[key];
          if (value === void 0) {
            _results.push(delete this.context["this"][key]);
          } else {
            _results.push(this.context["this"][key] = value);
          }
        }
        return _results;
      }
    };

    AssignmentStatement.prototype.dispose = function _dispose() {
      var _ref1, _ref2;
      AssignmentStatement.__super__.dispose.call(this);
      if ((_ref1 = this.leftExpression) != null) {
        _ref1.dispose();
      }
      return (_ref2 = this.rightExpression) != null ? _ref2.dispose() : void 0;
    };

    return AssignmentStatement;

  })(Statement);

  module.exports.test = function _test(done) {
    var a, context, object;
    object = {
      x: 1,
      y: 2,
      z: -1
    };
    context = new Context(object);
    a = Operation.createRuntime(context, {
      op: ':',
      args: [
        "z", {
          op: "+",
          args: [
            {
              op: 'member',
              args: [
                {
                  op: 'ancestor',
                  args: [0]
                }, "x"
              ]
            }, {
              op: 'member',
              args: [
                {
                  op: 'ancestor',
                  args: [0]
                }, "y"
              ]
            }
          ]
        }
      ]
    });
    a.activate();
    if (object.z !== 3) {
      throw "object.z != 3";
    }
    a.deactivate();
    if (object.z !== -1) {
      throw "object.z != -1";
    }
    object.x = 10;
    a.activate();
    if (object.z !== 12) {
      throw "object.z != 12";
    }
    Object.observe(object, function(changes) {
      if (object.z === 22) {
        a.deactivate();
        return done();
      }
    });
    return object.x = 20;
  };

}).call(this);

})})()