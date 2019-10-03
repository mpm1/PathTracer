/**
 * Creates a new shader that will draw the object to the screen. This shader will need to return the values for:
 * 0 - The reflectance color for the hit.
 * 1 - The emmitance color for the hit.
 * 2 - The depth of the current vector.
 * 3 - The point in space for the hit. This becomes important when calculating bounces.
 * 4 - The vector representing the bounce of the ray.
 * @param {*} fragment 
 * @param {*} properties The definition of all input properties for the shader.
 */
var Shader = function(properties, fragment, vertex = null){

    this.init(vertex ? vertex : Shader.basicVertexShader, fragment, properties);
}
{
    Shader.basicVertexShader = `#version 300 es
    layout(location=0) in vec3 a_position;
    
    out vec2 v_texcoord;
    
    void main(){
        v_texcoord = (a_position.xy + 1.0) / 2.0;
        gl_Position = vec4(a_position, 1.0);
    }`

    Shader.prototype.init = function(vertex, fragment, properties){
        this.vertex = vertex;
        this.fragment = fragment;
        this.properties = properties;
        this.program = null;
        this.message = null;
    }

    function createShader(gl, type, source){
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(success){
            return shader;
        }

        this.message = gl.getShaderInfoLog(shader);
        console.error(this.message);
        gl.deleteShader(shader);

        return null;
    }

    function createProgram(gl, vertexShader, fragmentShader){
        if(vertexShader == null || fragmentShader == null){
            return null;
        }

        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(success){
            return program;
        }

        this.message = gl.getProgramInfoLog(program);
        console.error(message);
        gl.deleteProgram(program);

        return null;
    }

    Shader.prototype.getProgram() = function(gl){
        if(this.program == null){
            var program = createProgram(gl, createShader(gl, gl.VERTEX_SHADER, this.vertex), createShader(gl, gl.FRAGMENT_SHADER, this.fragment));
            if(program != null){
                program.properties = {};

                this.properties.foreach(function(property, index){
                    var location;

                    switch(property.type){
                        case "uniform":
                            location = gl.getUniformLocation(program, property.path);
                            break;

                        case "attribute":
                            location = gl.getAttribLocation(program, property.path);
                            break;
                    }
                });

                this.program = program;
            }
        }

        return this.program;
    }

    Shader.prototype.updateProperties = function(gl, model, camera, maxDepth, bufferTextures){
        var properties = this.program.properties;

        gl.vertexAttribPointer(properties.aPosition, 4, gl.FLOAT, false, 0, 0);

        gl.uniform1f(properties.uMaxDepth, maxDepth);
    }
}

var SetupShader = new Shader([
    { name: "aPosition", path: "a_position", type: "attribute" },
    { name: "uAspectRatio", path: "uAspectRatio", type: "uniform" },
    { name: "uFieldOfView", path: "uFieldOfView", type: "uniform" },
    { name: "uRotation", path: "uRotation", type: "uniform" },
    { name: "uPosition", path: "uPosition", type: "uniform" },
    { name: "uMaxDepth", path: "uMaxDepth", type: "uniform" },
], `#version 300 es
precision mediump float;

in vec2 v_texcoord;

uniform float uMaxDepth;

layout(location=0) out vec4 reflectance;
layout(location=1) out vec4 emittance;
layout(location=2) out float depth;
layout(location=3) out vec3 position;
layout(location=4) out vec3 vector;

void main(){
    reflectance = vec4(0.0f, 0.0f, 0.0f, 1.0f);
    emittance = vec4(0.0f, 0.0f, 0.0f, 1.0f);
    depth = uMaxDepth;
}
`,`#version 300 es
layout(location=0) in vec3 a_position;

uniform float uAspectRatio;
uniform float uFieldOfView;
uniform vec4 uRotation;
uniform vec4 uPosition;

out vec2 v_texcoord;

void main(){
    v_texcoord = a_position.xy;
    gl_Position = vec4(a_position, 1.0);
}`);
SetupShader.updateProperties = function(gl, screenAttributes, model, camera, maxDepth, bufferTextures){
    var properties = this.program.properties;

    Shader.prototype.updateProperties.call(this, gl, screenAttributes, model, camera, maxDepth, bufferTextures);

    gl.uniform1f(properties.uAspectRatio, camera.ratio);
    gl.uniform1f(properties.uFieldOfView, camera.fieldOfView);
    gl.uniform4fv(properties.uRotation, camer.rotation);
    gl.uniform4fv(properties.uPosition, camera.position);
}

var SphereShader = new Shader([], `#version 300 es
precision mediump float;

in vec2 v_texcoord;

uniform sampler2D uPoints;
uniform sampler2D uVectors;

uniform float uRadius;
uniform vec3 uLocation;
uniform vec3 uReflectance;
uniform vec3 uEmittance;

layout(location=0) out vec4 reflectance;
layout(location=1) out vec4 emittance;
layout(location=2) out float depth;
layout(location=3) out vec3 position;
layout(location=4) out vec3 vector;

void main(){
    vec3 lastPoint = texture(uPoints, v_texcoord).rgb;
    vec3 lastVector = normalize(uVectors, v_texcoord).xyz;
}
`);