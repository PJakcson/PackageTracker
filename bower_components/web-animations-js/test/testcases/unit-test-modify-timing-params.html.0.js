
"use strict";

var anim = new Animation(document.getElementById("anim"), {left: "100px"},
    1.0);

// Test that updates to a TimedItem's startTime, or duration
// cause corresponding updates to its endTime.
test(function() {assert_equals(anim.endTime,  1.0)},
     "endTime should reflect initial duration");
test(function() {
  assert_throws(new TypeError(), function() {
    anim.startTime = 2.0;
  });
  assert_equals(anim.startTime,  0.0);
}, "startTime should be read-only");
anim.timing.duration = 3.0;
test(function() {assert_equals(anim.endTime,  3.0)},
     "endTime should reflect Timing.duration");
anim.timing.duration = 4.0;
test(function() {assert_equals(anim.endTime,  4.0)},
     "endTime should reflect duration");

test(function() {
  assert_throws(new TypeError(), function() {
    anim.endTime = 6.5;
  });
  assert_true(anim.endTime !=  6.5);
}, "TimedItem.endTime should be read-only");

// Test that updates to a TimedItem's endTime cause re-layout of a parent
// parallel group.
anim.timing.duration = 3;
var animationGroup = new AnimationGroup([anim]);
test(function() {assert_equals(animationGroup.duration,  3.0)},
     "Parallel group duration should reflect child endTime");
test(function() {assert_equals(animationGroup.endTime,  3.0)},
     "Parallel group end time should reflect child endTime");
// Update via Timing.duration
anim.timing.duration = 8.0;
test(function() {assert_equals(animationGroup.duration,  8.0)},
     "Parallel group duration should reflect updated child Timing.duration");
test(function() {assert_equals(animationGroup.endTime,  8.0)},
     "Parallel group end time should reflect updated child Timing.duration");
// Update via duration
anim.timing.duration = 9.0;
test(function() {assert_equals(animationGroup.duration,  9.0)},
     "Parallel group duration should reflect updated child duration");
test(function() {assert_equals(animationGroup.endTime,  9.0)},
     "Parallel group end time should reflect updated child duration");

// Test that updates to a TimedItem's delay and duration cause
// re-layout of a parent sequence group.
anim.timing.duration = "auto";
var siblingAnim = new Animation(document.getElementById("anim"), {top: "100px"},
    1.0);
var animationSequence = new AnimationSequence([anim, siblingAnim]);
test(function() {assert_equals(anim.startTime,  0.0)},
     "Sequence group should reset child startTime");
test(function() {assert_equals(siblingAnim.startTime,  0.0)},
     "Sequence group should set child startTime");
test(function() {assert_equals(siblingAnim.endTime,  1.0)},
     "Sequence group should set child endTime");
test(function() {assert_equals(animationSequence.duration,  1.0)},
     "Sequence group duration should reflect child durations");
test(function() {assert_equals(animationSequence.endTime,  1.0)},
     "Sequence group end time should reflect child durations");
// delay
anim.timing.delay = 11.0;
test(function() {assert_equals(siblingAnim.startTime,  11.0)},
     "Sequence group should update sibling after updated child delay");
test(function() {assert_equals(animationSequence.duration,  12.0)},
     "Sequence group duration should reflect updated child delay");
test(function() {assert_equals(animationSequence.endTime,  12.0)},
     "Sequence group end time should reflect updated child delay");
// duration
anim.timing.duration = 12.0;
test(function() {assert_equals(siblingAnim.startTime,  23.0)},
     "Sequence group should update sibling after updated child Timing.duration");
test(function() {assert_equals(animationSequence.duration,  24.0)},
     "Sequence group duration should reflect updated child Timing.duration");
test(function() {assert_equals(animationSequence.endTime,  24.0)},
     "Sequence group end time should reflect updated child Timing.duration");

