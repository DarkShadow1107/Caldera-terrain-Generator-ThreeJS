"use strict";

import * as THREE from "three";

import { OrbitControls as e } from "three/addons/controls/OrbitControls.js";

import { ImprovedNoise as t } from "three/addons/math/ImprovedNoise.js";

import { OBJExporter as n } from "three/addons/exporters/OBJExporter.js";

import { GLTFExporter as o } from "three/addons/exporters/GLTFExporter.js";

import { GUI as r } from "three/addons/libs/lil-gui.module.min.js";

!(function () {
	function i() {
		(T = 1e3), (R = 500), (S = 2.5), (C = 4), (H = 5), (M = 0), (j = 1);
	}
	function a() {
		g.remove(y), y.material.dispose(), y.geometry.dispose(), d();
	}
	function d() {
		const e = (function (e, n) {
			const o = e * n;
			let r = new Uint8Array(o);
			r = Array.from(r);
			let i = new t(),
				a = 100 * Math.random(),
				d = 1;
			for (let t = 0; t < C; t++) {
				for (let t = 0; t < o; t++) {
					let n = t % e,
						o = ~~(t / e);
					r[t] += Math.abs(i.noise(n / d, o / d, a) * d);
				}
				d *= H;
			}
			const l = Math.ceil(Math.min(e / 5, n / 5));
			let s = new THREE.Vector3(e / 2, n / 2, 0),
				c = 0.99 * Math.floor(Math.min(e / 2, n / 2));
			for (let t = 0; t < o; t++) {
				let n = t % e,
					o = ~~(t / e),
					i = new THREE.Vector3(n, o, 0);
				var u = Math.abs(i.distanceTo(s));
				u >= c
					? (r[t] = 0)
					: u <= l
					? ((r[t] *= (Math.sin(((u - l) / (c - l)) * Math.PI) * S) / (1 / (1 - j))), (r[t] += M))
					: ((r[t] *= Math.sin(((u - l) / (c - l)) * Math.PI) * S), (r[t] += M));
			}
			return r;
		})(R, R);
		(x = new THREE.PlaneGeometry(T, T, R - 1, R - 1)).rotateX(-Math.PI / 2);
		const n = x.attributes.position.array;
		let o,
			r = 0;
		for (let t = 0, i = 0, a = n.length; t < a; t++, i += 3) (o = 1 * e[t]), (n[i + 1] = o), r < o && (r = o);
		x.translate(0, -1 * S, 0), (x.attributes.position.needsUpdate = !0), x.computeVertexNormals(), x.computeBoundingBox();
		let i = {
			colorTexture: {
				value: L,
			},
			limits: {
				value: r,
			},
		};
		(b = new THREE.MeshLambertMaterial({
			side: THREE.DoubleSide,
			onBeforeCompile: (e) => {
				(e.uniforms.colorTexture = i.colorTexture),
					(e.uniforms.limits = i.limits),
					(e.vertexShader = `\n      varying vec3 vPos;\n      ${e.vertexShader}\n    `.replace(
						"#include <fog_vertex>",
						"#include <fog_vertex>\n      vPos = vec3(position);\n      "
					)),
					(e.fragmentShader =
						`\n      uniform float limits;\n      uniform sampler2D colorTexture;\n      \n      varying vec3 vPos;\n      ${e.fragmentShader}\n    `.replace(
							"vec4 diffuseColor = vec4( diffuse, opacity );",
							"\n        float h = (vPos.y - (-limits))/(limits * 2.);\n        h = clamp(h, 0., 1.);\n        vec4 diffuseColor = texture2D(colorTexture, vec2(0, h));\n      "
						));
			},
		})),
			(y = new THREE.Mesh(x, b)),
			g.add(y);
	}
	function l() {
		c(new n().parse(y), "object.obj");
	}
	function s() {
		new o().parse(
			y,
			function (e) {
				if (e instanceof ArrayBuffer) saveArrayBuffer(e, "object.glb");
				else {
					c(JSON.stringify(e, null, 2), "object.gltf");
				}
			},
			function () {},
			{
				trs: !1,
				onlyVisible: !0,
				binary: !1,
				maxTextureSize: 4096,
			}
		);
	}
	function c(e, t) {
		!(function (e, t) {
			(B.href = URL.createObjectURL(e)), (B.download = t), B.click();
		})(
			new Blob([e], {
				type: "text/plain",
			}),
			t
		);
	}
	function u() {
		(w.aspect = window.innerWidth / window.innerHeight),
			w.updateProjectionMatrix(),
			E.setSize(window.innerWidth, window.innerHeight);
	}
	function m() {
		E.render(g, w);
	}
	let p = document.createElement("canvas"),
		f = p.getContext("2d");
	var h = f.createLinearGradient(0, p.height, 0, 0);
	h.addColorStop(0, "navy"),
		h.addColorStop(0.35, "navy"),
		h.addColorStop(0.45, "midnightblue"),
		h.addColorStop(0.48, "midnightblue"),
		h.addColorStop(0.5, "royalblue"),
		h.addColorStop(0.5, "yellowgreen"),
		h.addColorStop(0.6, "peru"),
		h.addColorStop(0.78, "saddlebrown"),
		h.addColorStop(0.85, "saddlebrown"),
		h.addColorStop(1, "white"),
		(f.fillStyle = h),
		f.fillRect(0, 0, p.width, p.height);
	let w,
		g,
		E,
		v,
		x,
		b,
		y,
		T,
		R,
		S,
		C,
		H,
		M,
		j,
		P,
		L = new THREE.CanvasTexture(p);
	i(),
		(function () {
			(P = {
				size: T,
				seg: R,
				dynamic_scale: S,
				complexity: C,
				quality_ratio: H,
				elevation_adjust: M,
				flat_scale: j,
				regenerate: function () {
					a(), m();
				},
				reset: function () {
					o.children[0].controllers.forEach((e) => e.setValue(e.initialValue)), i(), a(), m();
				},
				exportToObj: l,
				exportGLTF: s,
			}),
				((g = new THREE.Scene()).background = 0),
				(E = new THREE.WebGLRenderer({
					antialias: !0,
				})).setPixelRatio(window.devicePixelRatio),
				E.setSize(window.innerWidth, window.innerHeight),
				document.body.appendChild(E.domElement),
				(w = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 3 * T)).position.set(
					0,
					0.5 * T,
					1 * T
				),
				w.lookAt(0, 0, 0);
			const t = new THREE.AmbientLight("white", 1);
			g.add(t);
			const n = new THREE.DirectionalLight("white", 1);
			n.position.set(0, 3, 8), g.add(n);
			const o = new r();
			let c = o.addFolder("Settings");
			c
				.add(P, "seg", 101, 800)
				.name("segment")
				.step(1)
				.onChange(function (e) {
					(R = e), a(), m();
				}),
				c
					.add(P, "elevation_adjust", 0, 10)
					.name("ground level")
					.step(1)
					.onChange(function (e) {
						(M = e), a(), m();
					}),
				c
					.add(P, "flat_scale", 0, 1)
					.name("center flat scale")
					.step(0.1)
					.onChange(function (e) {
						(j = e), a(), m();
					}),
				c.add(P, "reset").name("Reset"),
				c.add(P, "regenerate").name("Regenerate"),
				(c = o.addFolder("Export")).add(P, "exportToObj").name("Export OBJ (not include color)"),
				c.add(P, "exportGLTF").name("Export GLTF"),
				o.open(),
				d(),
				((v = new e(w, E.domElement)).autoRotate = !0),
				(v.autoRotateSpeed = 2),
				(v.enableDamping = !0),
				(v.enablePan = !1),
				(v.minDistance = 0.1),
				(v.maxDistance = 2 * T),
				v.target.set(0, 0, 0),
				v.update(),
				window.addEventListener("resize", u);
		})(),
		(function e() {
			requestAnimationFrame(e), v.update(), m();
		})();
	const B = document.createElement("a");
	(B.style.display = "none"), document.body.appendChild(B);
})();
