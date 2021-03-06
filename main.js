import * as THREE from "three";
import { OrbitControls } from './js/OrbitControls.js';
import { CSS3DObject, CSS3DRenderer } from './js/CSS3DRenderer.js';
var TWEEN = require('@tweenjs/tween.js');
require('./css/common.css');
require('./css/reset.css');
var _table = [
    "img/1.jpg",
    "img/2.jpg",
    "img/3.jpg",
    "img/4.jpg",
    "img/5.jpg",
    "img/6.jpg",
    "img/7.jpg",
    "img/8.jpg",
    "img/9.jpg",
    "img/10.jpg",
    "img/11.jpg",
    "img/12.jpg"
];
var MAXNUMBER = 256;
var table = [];
var camera, scene, renderer;
var controls;

var objects = [];
var targets = {
    sphere: []
};
initTable();
init();
animate();

function initTable() {
    var index;
    for (let i = 0; i < MAXNUMBER; i++) {
        index = parseInt(Math.random() * _table.length);
        table.push(_table[index]);
    }
}

function init() {

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 3000;

    scene = new THREE.Scene();

    // table

    for (var i = 0; i < table.length; i++) {

        var element = document.createElement('div');
        element.className = 'element';
        element.style.background = `rgba(0,127,127,${(Math.random() * 0.5 + 0.25)}) url(${table[i]}) no-repeat center center`;
        element.style.backgroundSize = `100% 100%`;

        var object = new CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);

        objects.push(object);

    }

    // sphere

    var vector = new THREE.Vector3();
    var spherical = new THREE.Spherical();

    for (var i = 0, l = objects.length; i < l; i++) {

        var phi = Math.acos(-1 + (2 * i) / l);
        var theta = Math.sqrt(l * Math.PI) * phi;

        var object = new THREE.Object3D();

        spherical.set(800, phi, theta);

        object.position.setFromSpherical(spherical);

        vector.copy(object.position).multiplyScalar(2);

        object.lookAt(vector);

        targets.sphere.push(object);

    }
    //

    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new OrbitControls(camera);
    controls.autoRotateSpeed = 4;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.enableDamping = true;
    controls.dampingFactor = 0.16;
    controls.addEventListener('change', render);

    var button = document.getElementById('zoom');
        var zoomState = 0;
        button.addEventListener('click', function (event) {

            var pos = camera.position;
            var duration = 2000;
            if (zoomState == 0) {
                new TWEEN.Tween(pos)
                    .to({
                        x: 0,
                        y: -120,
                        z: 1800
                    }, duration / 2)
                    .onUpdate(render)
                    .start();
                zoomState = 1;
            } else {
                new TWEEN.Tween(pos)
                    .to({
                        x: 0,
                        y: 0,
                        z: 3000
                    }, duration / 4)
                    .onUpdate(render)
                    .start();
                zoomState = 0;
            }

        }, false);

        var button = document.getElementById('rotate');
        button.addEventListener('click', function (event) {
            if (!controls.autoRotate) {
                controls.autoRotate = true;
            }
            if (controls.autoRotateSpeed == 4) {
                controls.autoRotateSpeed = 0.5;
            } else {
                controls.autoRotateSpeed = 4;
            }

        }, false);

        transform(targets.sphere, 2000);

    window.addEventListener('resize', onWindowResize, false);

}

function transform(targets, duration) {

    TWEEN.removeAll();

    for (var i = 0; i < objects.length; i++) {

        var object = objects[i];
        var target = targets[i];

        new TWEEN.Tween(object.position)
            .to({
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(object.rotation)
            .to({
                x: target.rotation.x,
                y: target.rotation.y,
                z: target.rotation.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

    }

    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();

    //相机推进
    /* var pos = camera.position;
    new TWEEN.Tween(pos)
        .to({
            x: 0,
            y: -120,
            z: 1200
        }, duration / 2)
        .onUpdate(render)
        .delay(duration * 2)
        .start().onComplete(function () {
            controls.autoRotate = true;
        }); */

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function animate() {

    requestAnimationFrame(animate);

    TWEEN.update();

    controls.update();

}

function render() {

    renderer.render(scene, camera);

}