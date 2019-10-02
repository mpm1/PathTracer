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
    }

    Shader.prototype.load = function(gl){

    }
}

var SetupShader = new Shader([], `#version 300 es
precision mediump float;

in vec2 v_texcoord;

uniform float uAspectRatio;
uniform float uFieldOfView;
uniform vec3 uRotation;
uniform vec3 uPosition;

layout(location=0) vec4 reflectance;
layout(location=1) vec4 emittance;
layout(location=2) vec4 depth;
layout(location=3) vec4 position;
layout(location=4) vec4 vector;

void main(){
    
}
`)

var SphereShader = new Shader([], `#version 300 es
precision mediump float;

in vec2 v_texcoord;

uniform sampler2D uPoints;
uniform sampler2D uVectors;

uniform float uRadius;
uniform vec3 uLocation;
uniform vec3 uReflectance;
uniform vec3 uEmittance;

layout(location=0) vec4 reflectance;
layout(location=1) vec4 emittance;

void main(){
    vec3 lastPoint = texture(uPoints, v_texcoord).rgb;
    vec3 lastVector = normalize(uVectors, v_texcoord).xyz;
}
`);