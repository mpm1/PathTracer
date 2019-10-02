/**
 * Creates a new shader that will draw the object to the screen. This shader will need to return the values for:
 * 0 - The depth of the current vector.
 * 1 - The point in space for the hit. This becomes important when calculating bounces.
 * 2 - The vector representing the bounce of the ray.
 * 3 - The reflectance color for the hit.
 * 4 - The emmitance color for the hit.
 * @param {*} fragment 
 * @param {*} properties The definition of all input properties for the shader.
 */
var Shader = function(fragment, properties){
    //this.vertex = vertex; // All shaders will have the same vertex shader since we will just be covering the screen in a quad.
    this.fragment = fragment;
    this.properties = properties;
}
{
    var basicVertexShader = ``;
    Shader.prototype.load = function(gl){

    }
}