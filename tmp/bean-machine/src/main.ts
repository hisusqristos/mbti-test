import "./style.css";

import {
  Bodies,
  Common,
  Composite,
  Composites,
  Engine,
  Render,
  Runner,
  Mouse,
  MouseConstraint,
} from "matter-js";

// create an engine
var engine = Engine.create({
  gravity: { x: 0, y: 0.35 },
});

// create a renderer
const container = document.getElementById("app");
if (container == null) {
  throw new Error("No wrapper element found");
}

const render = Render.create({
  element: container,
  engine: engine,
  options: {
    width: 960,
    height: 720,
    // showCollisions: true,
    wireframes: false,
    showAngleIndicator: false,
    background: "transparent",
  },
});

// main attributes
const width = render.bounds.max.x;
const height = render.bounds.max.y;
const radius = 6;
const n = 16;
const gap = (width - (n + 1) * (2 * radius)) / n;
const bucketHeight = 96;

// add bodies

const drop = Bodies.circle(width / 2, 20, radius * 2, {
  friction: 0.00001,
  restitution: 0.6,
  density: 0.002,
  render: {
    fillStyle: "#B48EAD",
    strokeStyle: "#EBCB8B",
    lineWidth: 2,
  },
});
Composite.add(engine.world, drop);

const bucketWallAt = (x: number, y: number) => {
  return Bodies.rectangle(x, y, radius * 2, bucketHeight, {
    isStatic: true,
    render: {
      fillStyle: "#2E3440",
      lineWidth: 0,
    },
  });
};
const buckets = Composites.stack(
  0,
  height - bucketHeight,
  n + 1,
  1,
  gap,
  0,
  bucketWallAt
);
Composite.add(engine.world, buckets);

const ground = Bodies.rectangle(width / 2, height - radius, width, 2 * radius, {
  isStatic: true,
  restitution: 0,
  frictionStatic: 0.8,
  render: {
    fillStyle: "#2E3440",
    lineWidth: 0,
  },
});
Composite.add(engine.world, ground);

const pinAt = (x: number, y: number, col: number, row: number) => {
  const offset = () => {
    // offset only the first column
    if (col > 0) return 0;
    // offset every other row
    return row % 2 === 0 ? gap / 2 + 2 * radius : radius;
  };
  return Bodies.polygon(x + offset(), y, 5, radius, {
    angle: Common.random(0, 2 * Math.PI),
    restitution: 0.5,
    frictionStatic: 0.1,
    isStatic: true,
    render: {
      fillStyle: "#2E3440",
      strokeStyle: "#3B4252",
      lineWidth: 2,
    },
  });
};
const pins = Composites.stack(0, 108, 17, 9, gap, gap, pinAt);
Composite.add(engine.world, pins);

// add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false,
    },
  },
});
Composite.add(engine.world, mouseConstraint);

// run the renderer
Render.run(render);

// create runner
const runner = Runner.create();

// run the engine
Runner.run(runner, engine);
