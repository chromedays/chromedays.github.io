import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.2.1/lit-element.js?module";
//import * as glMatrix from "https://unpkg.com/gl-matrix@3.1.0/gl-matrix.js?module";
//const { mat4 } = glMatrix;
import * as common from "https://unpkg.com/gl-matrix@3.1.0/esm/common.js?module";
import * as mat4 from "https://unpkg.com/gl-matrix@3.1.0/esm/mat4.js?module";
import * as vec3 from "https://unpkg.com/gl-matrix@3.1.0/esm/vec3.js?module";

var canvas;
var gl;

class MainPage extends LitElement {
  constructor() {
    super();
  }

  firstUpdated() {
    canvas = this.shadowRoot.querySelector("#glCanvas");
    gl = canvas.getContext("webgl");

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

    const shader = gl.createProgram();
    gl.attachShader(shader, vs);
    gl.attachShader(shader, fs);
    gl.linkProgram(shader);
    if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
      console.log("failed to link shader");
    }

    const vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    const edgeCount = 6;
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

    requestAnimationFrame(draw);

    var then = 0;

    var angleDeg = 0.0;

    function draw(now) {
      now *= 0.001;
      const dt = now - then;
      then = now;

      resize();

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

      angleDeg += 30.0 * dt;
      const modelMat = mat4.create();
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

      gl.bindBuffer(gl.ARRAY_BUFFER, vb);
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

      gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexCount);

      requestAnimationFrame(draw);
    }

    function resize() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
  }

  static get styles() {
    return css`
      :host {
        color: white;
        font-family: Open Sans;
        font-weight: lighter;
      }

      canvas {
        width: 100vw;
        height: 100vh;
        display: block;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: -1;
      }

      h1 {
        color: white;
        text-align: center;
      }

      h2,
      h3,
      h4,
      h5,
      h6,
      p,
      li,
      a {
        color: white;
        text-align: center;
        text-decoration: none;
        font-weight: lighter;
      }

      .content-container {
        color: white;
        text-decoration: none;
        font-weight: lighter;
        margin: 100px 30px 30px 30px;
      }

      .title {
        font-size: 50px;
        margin: 30px 10px 10px 10px;
      }

      .subtitle {
        font-size: 15px;
        margin-top: 0px;
      }

      .menu-container {
        display: flex;
        flex-direction: row;
        list-style: none;
        justify-content: center;
        padding: 0px 0px 0px 0px;
        margin: 30px 20% 0% 20%;
      }

      .menu-item {
        flex: auto;
        list-style: none;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }
    `;
  }

  render() {
    return html`
      <canvas id="glCanvas"></canvas>
      <header>
        <h1 class="title">ILGWON HA</h1>
        <h3 class="subtitle">GRAPHICS PROGRAMMER</h4>
      </header>
      <ul class="menu-container">
        <li class="menu-item" @click=${() => {
          console.log("Portfolio");
        }}><a href="#">PORTFOLIO</a></li>
        <li class="menu-item" @click=${() => {
          console.log("About Me");
        }}><a href="#">ABOUT ME</a></li>
        <li class="menu-item" @click=${() => {
          console.log("Contact");
        }}><a href="#">CONTACT</a></li>
      </ul>
      <div class="content-container">
      </div>
    `;
  }
}

window.customElements.define("main-page", MainPage);
