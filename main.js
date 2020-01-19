import * as common from "https://unpkg.com/gl-matrix@3.1.0/esm/common.js?module";
import * as mat4 from "https://unpkg.com/gl-matrix@3.1.0/esm/mat4.js?module";
import * as vec3 from "https://unpkg.com/gl-matrix@3.1.0/esm/vec3.js?module";

function createPolygonVertexBuffer(gl, edgeCount) {
  const vb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  const vertexCount = edgeCount + 2;
  var vertices = [0.0, 0.0, 0.0];
  {
    var step = common.toRadian(360.0 / edgeCount);
    var i;
    for (i = 0; i < edgeCount + 1; i++) {
      vertices.push(Math.cos(step * i), Math.sin(step * i), 0.0);
    }
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  return {
    buffer: vb,
    vertexCount: vertexCount
  };
}

function destroyPolygonVertexBuffer(gl, vb) {
  gl.deleteBuffer(vb.buffer);
}

function createPolygonShader(gl) {
  const vsSource = `
      attribute vec3 v_pos;
      uniform mat4 u_model;
      uniform mat4 u_view;
      uniform mat4 u_proj;
      void main() {
        gl_Position = u_proj * u_view * u_model * vec4(v_pos, 1);
      }
    `;

  const fsSource = `
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    `;

  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vsSource);
  gl.compileShader(vs);
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    console.log("failed to compile vertex shader");
  }

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fsSource);
  gl.compileShader(fs);
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    console.log("failed to compile fragment shader");
  }

  var shader = gl.createProgram();
  gl.attachShader(shader, vs);
  gl.attachShader(shader, fs);
  gl.linkProgram(shader);
  if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
    console.log("failed to link shader");
  }

  return shader;
}

function drawPolygon(gl, canvas, vb, shader, angleDeg) {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);

  const viewHeight = 5.0;
  const viewWidth = viewHeight * (canvas.width / canvas.height);
  const projMat = mat4.create();
  mat4.ortho(
    projMat,
    -viewWidth * 0.5,
    viewWidth * 0.5,
    -viewHeight * 0.5,
    viewHeight * 0.5,
    0.1,
    100.0
  );

  const modelMat = mat4.create();
  const translation = vec3.create();
  vec3.set(translation, 0, -0.5, 0);
  mat4.translate(modelMat, modelMat, translation);
  const rotateAxis = vec3.create();
  vec3.set(rotateAxis, 0, 0, 1);
  mat4.rotate(modelMat, modelMat, common.toRadian(angleDeg), rotateAxis);
  const viewMat = mat4.create();
  var eye = vec3.create();
  vec3.set(eye, 0, 0, 1);
  var center = vec3.create();
  var up = vec3.create();
  vec3.set(up, 0, 1, 0);
  mat4.lookAt(viewMat, eye, center, up);

  gl.bindBuffer(gl.ARRAY_BUFFER, vb.buffer);
  const posAttrib = gl.getAttribLocation(shader, "v_pos");
  const modelUniform = gl.getUniformLocation(shader, "u_model");
  const viewUniform = gl.getUniformLocation(shader, "u_view");
  const projUniform = gl.getUniformLocation(shader, "u_proj");
  gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posAttrib);

  gl.useProgram(shader);

  gl.uniformMatrix4fv(modelUniform, false, modelMat);
  gl.uniformMatrix4fv(viewUniform, false, viewMat);
  gl.uniformMatrix4fv(projUniform, false, projMat);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, vb.vertexCount);
}

class GLCanvas extends HTMLElement {
  constructor() {
    super();
    this.render();

    this.canvas = this.querySelector("#gl");
    this.gl = this.canvas.getContext("webgl");
    this.polygonShader = createPolygonShader(this.gl);
    this.polygonVb = createPolygonVertexBuffer(this.gl, 6);
    this.polygonAngleDeg = 0.0;
    this.then = 0.0;

    requestAnimationFrame(this.draw.bind(this));
  }

  draw(now) {
    now *= 0.001;
    const dt = now - this.then;
    this.then = now;

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.polygonAngleDeg += 30.0 * dt;

    drawPolygon(
      this.gl,
      this.canvas,
      this.polygonVb,
      this.polygonShader,
      this.polygonAngleDeg
    );

    requestAnimationFrame(this.draw.bind(this));
  }

  resetShape(edgeCount) {
    destroyPolygonVertexBuffer(this.gl, this.polygonVb);
    this.polygonVb = createPolygonVertexBuffer(this.gl, edgeCount);
  }

  render() {
    this.innerHTML = `
        <canvas id='gl'></canvas>
        `;
  }
}
customElements.define("gl-canvas", GLCanvas);

class MenuItem extends HTMLElement {
  constructor(name, onClick) {
    super();

    this.className = "menu-item";

    this.name = name;
    this.onClick = onClick;

    this.render();
  }

  render() {
    this.innerHTML = `
    <li id="${this.name}" ><a href="#">${this.name.toUpperCase()}</a></li>
    `;
    this.querySelector("a").addEventListener("click", this.onClick);
  }
}
customElements.define("menu-item", MenuItem);

class MenuBar extends HTMLElement {
  constructor() {
    super();

    this.items = [];

    this.render();
  }

  render() {
    this.innerHTML = `
        <ul id="menu-container">
        </ul>
    `;

    var container = this.querySelector("ul");
    this.items.forEach(item => {
      container.appendChild(item);
    });
  }

  addItem(item) {
    this.items.push(item);
    this.render();
  }
}
customElements.define("menu-bar", MenuBar);

class ResumePage extends HTMLElement {
  constructor() {
    super();
    this.id = "content-container";
    this.render();
  }

  render() {
    // TODO:
    this.innerHTML = `
      <div style="width: 100vw; height: 100%">
        <embed src="resume.pdf" width="100%" height="100%">
      </div>
    `;
  }
}
customElements.define("resume-page", ResumePage);

class MainApp extends HTMLElement {
  constructor() {
    super();

    this.contentType = "home";

    this.render();
  }

  render() {
    this.innerHTML = "";
    // TODO: gl context is created every time the render func gets called
    this.innerHTML = `
        <gl-canvas></gl-canvas>
        <header>
          <h1 class="title">ILGWON HA</h1>
          <h3 class="subtitle">GRAPHICS PROGRAMMER</h4>
        </header>
        <menu-bar></menu-bar>
    `;

    const canvas = this.querySelector("gl-canvas");
    const menuBar = this.querySelector("menu-bar");

    switch (this.contentType) {
      case "blog":
        break;
      case "about":
        break;
      case "resume":
        console.log("resume page added");
        this.appendChild(new ResumePage());
        break;
    }

    menuBar.addItem(
      new MenuItem("blog", () => {
        console.log("blog");
        canvas.resetShape(3);
        this.contentType = "blog";
        this.render();
      })
    );
    menuBar.addItem(
      new MenuItem("about", () => {
        console.log("about");
        canvas.resetShape(6);
        this.contentType = "about";
        this.render();
      })
    );
    menuBar.addItem(
      new MenuItem("resume", () => {
        console.log("resume");
        canvas.resetShape(12);
        this.contentType = "resume";
        this.render();
      })
    );
  }
}
customElements.define("main-app", MainApp);
