import Matter, { Vector } from "matter-js";
import clone from "clone";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Events = Matter.Events,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies;

let canvas_present = document.querySelector<HTMLCanvasElement>("#canvas_present")!;
let canvas_future = document.querySelector<HTMLCanvasElement>("#canvas_future")!;
canvas_future.width = canvas_future.clientWidth;
canvas_future.height = canvas_future.clientHeight;
let ctx_future = canvas_future.getContext("2d")!;

// create user engine
var engine_real = Engine.create(),
    world_real = engine_real.world;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine_real,
    canvas: canvas_present,
    options: {
        showAngleIndicator: true
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine_real);

// add bodies
var ground = Bodies.rectangle(395, 600, 815, 50, { isStatic: true, render: { fillStyle: '#060a19' } }),
    rockOptions = { density: 0.004 },
    rock = Bodies.polygon(170, 450, 8, 20, rockOptions),
    anchor = { x: 170, y: 450 },
    elastic = Constraint.create({
        pointA: anchor,
        bodyB: rock,
        length: 0.01,
        damping: 0.01,
        stiffness: 0.05
    });

var pyramid = Composites.pyramid(500, 300, 9, 10, 0, 0, function (x, y) {
    return Bodies.rectangle(x, y, 25, 40);
});

var ground2 = Bodies.rectangle(610, 250, 200, 20, { isStatic: true, render: { fillStyle: '#060a19' } });

var pyramid2 = Composites.pyramid(550, 0, 5, 10, 0, 0, function (x, y) {
    return Bodies.rectangle(x, y, 25, 40);
});

Composite.add(engine_real.world, [ground, pyramid, ground2, pyramid2, rock, elastic]);

Events.on(engine_real, 'afterUpdate', function () {
    if (mouseConstraint.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < 430)) {
        // Limit maximum speed of current rock.
        if (Vector.magnitudeSquared(rock.velocity) > 45 * 45) {
            Body.setVelocity(rock, Vector.mult(Vector.normalise(rock.velocity), 45));
        }

        // Release current rock and add a new one.
        rock = Bodies.polygon(170, 450, 7, 20, rockOptions);
        Composite.add(engine_real.world, rock);
        elastic.bodyB = rock;
    } /*else {
        // let engine_future = clone(engine_real);
        // let engine_future = Matter.Common.clone(engine_real, true);
        // for (let s = 0; s < 5; s += 1 / 60) {
        //     Engine.update(engine_future, 1000 / 60);
        // }
    }*/
});

Events.on(runner, "tick", e => {
    let engine_future = Engine.create();
    Composite.allBodies(world_real).forEach(thing => {
        let copied = clone(thing);
        Composite.add(engine_future.world, copied);
    });

    for (let s = 0; s < 5; s += 1 / 60) {
        Engine.update(engine_future, 1000 / 60);
    }

    ctx_future.clearRect(0, 0, canvas_future.width, canvas_future.height);
    ctx_future.strokeStyle = "blue";
    ctx_future.beginPath();
    Composite.allBodies(engine_future.world).forEach(thing => {
        ctx_future.moveTo(thing.vertices[thing.vertices.length - 1].x, thing.vertices[thing.vertices.length - 1].y);
        thing.vertices.forEach(vert => {
            ctx_future.lineTo(vert.x, vert.y);
        });
    });
    ctx_future.stroke();
});

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine_real, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

Composite.add(world_real, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});
