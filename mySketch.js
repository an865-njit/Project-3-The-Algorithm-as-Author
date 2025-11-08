/*
Frozen brush

Makes use of a delaunay algorithm to create crystal-like shapes.
The delaunay library was developed by Jay LaPorte at https://github.com/ironwallaby/delaunay/blob/master/delaunay.js

Controls:
  - Drag the mouse.
    - Press any key to toggle between fill and stroke.

Inspired by:
  Makio135's sketch www.openprocessing.org/sketch/385808

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com

ORIGINAL: https://openprocessing.org/sketch/2749320
*/

/*
Frozen brush with rainbow coloring
*/

var allParticles = [];
var maxLevel = 15;
var useFill = false;

var data = [];

function Particle(x, y, level) {
  this.level = level;
  this.life = 0;

  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(map(this.level, 0, maxLevel, 5, 2));

  this.move = function () {
    this.life++;
    this.vel.mult(0.8161);
    this.pos.add(this.vel);

    if (this.life % 10 == 0) {
      if (this.level > 0) {
        this.level -= 1;
        var newParticle = new Particle(this.pos.x, this.pos.y, this.level - 1);
        allParticles.push(newParticle);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360);
  textAlign(CENTER);
  background(0);
}

function draw() {
  noStroke();
  fill(0, 30);
  rect(0, 0, width, height);

  for (var i = allParticles.length - 1; i > -1; i--) {
    allParticles[i].move();
    if (allParticles[i].vel.mag() < 0.1) {
      allParticles.splice(i, 1);
    }
  }

  if (allParticles.length > 0) {
    data = Delaunay.triangulate(allParticles.map(function (pt) {
      return [pt.pos.x, pt.pos.y];
    }));

    strokeWeight(0.1);

    for (var i = 0; i < data.length; i += 3) {
      var p1 = allParticles[data[i]];
      var p2 = allParticles[data[i + 1]];
      var p3 = allParticles[data[i + 2]];

      var distThresh = 75;
      if (dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y) > distThresh) continue;
      if (dist(p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y) > distThresh) continue;
      if (dist(p1.pos.x, p1.pos.y, p3.pos.x, p3.pos.y) > distThresh) continue;

      // Rainbow hue based on life
      var hueVal = random(360);

      if (useFill) {
        noStroke();
        fill(hueVal, 360, 360);
      } else {
        noFill();
        stroke(hueVal, 360, 360);
      }

      triangle(p1.pos.x, p1.pos.y,
               p2.pos.x, p2.pos.y,
               p3.pos.x, p3.pos.y);
    }
  }

  noStroke();
  fill(255);
  text("Click and drag the mouse\nPress any key to change to fill/stroke", width / 2, height - 50);
}

function mouseDragged() {
  allParticles.push(new Particle(mouseX, mouseY, maxLevel));
}

function keyPressed() {
  useFill = !useFill;
}
