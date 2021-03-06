var expect = require('chai').expect;
var BaseAnimation = require('../../src/animation/baseanimation');

// ==================================================================
// An animation subclass to test that the internal
// mechanisms of all animations stay consistent and
// functional.
var FRAME_TIMING = 1000;
var TOTAL_FRAMES = 10;

function TestAnimation() {
  this.percentageAdvances = [];

  BaseAnimation.call(this);
}
TestAnimation.prototype = Object.create(BaseAnimation.prototype);

TestAnimation.prototype._currentFrameTiming = function() {
  return FRAME_TIMING;
};

TestAnimation.prototype._totalFrameCount = function() {
  return TOTAL_FRAMES;
};

TestAnimation.prototype._advanceFrameByPercentage = function(percentage) {
  this.percentageAdvances.push(percentage);
};

// ==================================================================

describe('BaseAnimation', function() {
  var animation;

  beforeEach(function() {
    animation = new TestAnimation();
  });

  it('does not update when the animation has not been started', function() {
    animation.update(FRAME_TIMING);
    expect(animation.percentageAdvances.length).to.equal(0);
  });

  it('updates at the correct percentages', function() {
    animation.start();
    animation.update(FRAME_TIMING * 2);

    expect(animation.percentageAdvances.length).to.equal(2);
    expect(animation.percentageAdvances[0]).to.equal(1);
    expect(animation.percentageAdvances[1]).to.equal(1);
  });

  it('will not move more than the max amount of frames', function() {
    animation.start();
    animation.update(FRAME_TIMING * TOTAL_FRAMES);
    animation.update(FRAME_TIMING);

    expect(animation.percentageAdvances.length).to.equal(TOTAL_FRAMES);
  });

  it('can loop', function() {
    animation.start({ loop: true });
    
    animation.update(FRAME_TIMING * TOTAL_FRAMES);
    expect(animation.percentageAdvances.length).to.equal(TOTAL_FRAMES);

    animation.update(FRAME_TIMING * TOTAL_FRAMES);
    expect(animation.percentageAdvances.length).to.equal(TOTAL_FRAMES * 2);
  });

  it('can loop a set amount of times', function() {
    animation.start({ loop: 1 });
    
    animation.update(FRAME_TIMING * TOTAL_FRAMES);
    expect(animation.percentageAdvances.length).to.equal(TOTAL_FRAMES);

    animation.update(FRAME_TIMING * TOTAL_FRAMES);
    expect(animation.percentageAdvances.length).to.equal(TOTAL_FRAMES * 2);

    // Should only loop the first time.
    animation.update(FRAME_TIMING * TOTAL_FRAMES);
    expect(animation.percentageAdvances.length).to.equal(TOTAL_FRAMES * 2);
  });

  it('can be played again', function() {
    animation.start();
    animation.update(FRAME_TIMING * TOTAL_FRAMES);

    animation.start();
    animation.update(FRAME_TIMING * TOTAL_FRAMES);

    expect(animation.percentageAdvances.length).to.equal(TOTAL_FRAMES * 2);
  });

  it('should not reset to first frame after playing', function() {
    animation = new TestAnimation();

    animation.start();
    animation.update(FRAME_TIMING * TOTAL_FRAMES);

    expect(animation._currentFrame).to.equal(TOTAL_FRAMES - 1);
  });

  it('can play in reverse', function() {
    animation.start({ reverse: true });

    expect(animation._currentFrame).to.equal(TOTAL_FRAMES - 1);
    animation.update(FRAME_TIMING * TOTAL_FRAMES);
    expect(animation._currentFrame).to.equal(0);
  });
});