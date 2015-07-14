// A baseclass for all animation classes.
// Not intended to be instantiated alone, should be inherited from.
function BaseAnimation(options) {
  this.reset();

  this.playCount = 0;
  if(options) {
    this.loop = options.loop || false;
  }
}

BaseAnimation.prototype.reset = function() {
  this.active = false;

  this._currentFrame = 0;
  this._frameElapsed = 0;
  this._remainingDelta = 0;
};

BaseAnimation.prototype.start = function() {
  this.reset();
  this.active = true;
  this.playCount += 1;
};

BaseAnimation.prototype.update = function(dt) {
  this._remainingDelta = dt;

  while(this._shouldUpdate()) {
    this._handleCurrentFrame();
  }
};

BaseAnimation.prototype._shouldUpdate = function() {
  return (this.active && this._remainingDelta > 0 && this._currentFrame < this._totalFrameCount());
};

BaseAnimation.prototype._currentFrameTiming = function() {
  throw new Exception('Not implemented');
};

BaseAnimation.prototype._totalFrameCount = function() {
  throw new Exception('Not implemented');
};

BaseAnimation.prototype._handleCurrentFrame = function() {
  var usableTime = Math.min(this._remainingDelta, this._currentFrameTiming() - this._frameElapsed);
  var percentOfTotal = usableTime / this._currentFrameTiming();

  this._advanceFrameByPercentage(percentOfTotal);

  this._remainingDelta -= usableTime;
  this._frameElapsed += usableTime;

  if(this._frameElapsed >= this._currentFrameTiming()) {
    this._nextFrame();
  }
};

BaseAnimation.prototype._nextFrame = function() {
  this._currentFrame++;
  this._frameElapsed = 0;

  if(this.loop) {
    this._currentFrame %= this._totalFrameCount();
  }
  else if(this._currentFrame >= this._totalFrameCount()) {
    this.reset();
  }
};

BaseAnimation.prototype._advanceFrameByPercentage = function(percentage) {
  throw new Exception('Not implemented');
};

module.exports = BaseAnimation;