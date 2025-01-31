var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize WebGL context
var gl = canvas.getContext("webgl", { alpha: true }); // Enable transparency
if (!gl) {
  console.error("Unable to initialize WebGL.");
}

// Time tracking
var time = 0.0;

// ************** Shader sources **************

var vertexSource = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

var fragmentSource = `
precision highp float;

uniform float width;
uniform float height;
vec2 resolution = vec2(width, height);

uniform float time;

float getWaveGlow(vec2 pos, float radius, float intensity, float speed, float amplitude, float frequency, float shift){
    float dist = abs(pos.y + amplitude * sin(shift + speed * time + pos.x * frequency));
    dist = 1.0 / dist;
    dist *= radius;
    dist = pow(dist, intensity);
    return dist;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float widthHeightRatio = resolution.x / resolution.y;
    vec2 centre = vec2(0.5, 0.5);
    vec2 pos = centre - uv;
    pos.y /= widthHeightRatio;

    float intensity = 1.5;
    float radius = 0.02;
    
    vec3 col = vec3(0.0);
    float dist = 0.0;

    dist = getWaveGlow(pos, radius, intensity, 2.0, 0.018, 3.7, 0.0);
    col += dist * (vec3(0.1) + 0.5 + 0.5 * cos(3.14 + time + vec3(0, 2, 4)));

    dist = getWaveGlow(pos, radius, intensity, 4.0, 0.018, 6.0, 2.0);
    col += dist * (vec3(0.1) + 0.5 + 0.5 * cos(1.57 + time + vec3(0, 2, 4)));

    dist = getWaveGlow(pos, radius * 0.5, intensity, -5.0, 0.018, 4.0, 1.0);
    col += dist * (vec3(0.1) + 0.5 + 0.5 * cos(time + vec3(0, 2, 4)));

    // Apply radial fade to edges
    float edgeFade = smoothstep(0.6, 1.2, length(pos) * 1.5);
    col *= (1.0 - edgeFade);

    // Enhance glow and blending
    col = 1.0 - exp(-col * 1.2);
    col = pow(col, vec3(0.4545));

    // Set final transparency to blend with background
    float alpha = (1.0 - edgeFade) * 0.9;
    gl_FragColor = vec4(col, alpha);
}
`;

// ************** Utility functions **************

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(widthHandle, window.innerWidth);
    gl.uniform1f(heightHandle, window.innerHeight);
}

// Compile shader
function compileShader(shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
    }
    return shader;
}

// Utility to get attributes and uniforms
function getAttribLocation(program, name) {
    var attributeLocation = gl.getAttribLocation(program, name);
    if (attributeLocation === -1) {
        throw "Cannot find attribute " + name + ".";
    }
    return attributeLocation;
}

function getUniformLocation(program, name) {
    var attributeLocation = gl.getUniformLocation(program, name);
    if (attributeLocation === -1) {
        throw "Cannot find uniform " + name + ".";
    }
    return attributeLocation;
}

// ************** Create shaders **************

// Create vertex and fragment shaders
var vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
var fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

// Create shader program
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Set up rectangle covering entire canvas
var vertexData = new Float32Array([
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, 1.0,
    1.0, -1.0,
]);

// Create vertex buffer
var vertexDataBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

// Layout of vertex buffer data
var positionHandle = getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionHandle);
gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 2 * 4, 0);

// Set uniform handles
var timeHandle = getUniformLocation(program, "time");
var widthHandle = getUniformLocation(program, "width");
var heightHandle = getUniformLocation(program, "height");

gl.uniform1f(widthHandle, window.innerWidth);
gl.uniform1f(heightHandle, window.innerHeight);

var lastFrame = Date.now();
var thisFrame;

function draw() {
    thisFrame = Date.now();
    time += (thisFrame - lastFrame) / 3000;
    lastFrame = thisFrame;

    // Ensure transparency
    gl.clearColor(0, 0, 0, 0); // Fully transparent
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(timeHandle, time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(draw);
}

draw();
