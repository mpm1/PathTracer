var Renderer = function(canvas, camera = null){
    this.init(canvas, camera);
}
{
    const MaxBounce = 2;

    Renderer.prototype.init = function(canvas, camera){
        this.canvas = canvas;
        this.camera = camera;
        this.context = canvas.getContext('2d');
        this.maxDepth = 100.0;

        this.imgBuffer = this.context.getImageData(0, 0, canvas.width, canvas.height);
    }

    Renderer.prototype.clearBuffer = function(){
        this.imgBuffer.data.fill(0);
    }

    var rayBufferBuffer = new Float32Array(4 * (MaxBounce + 1) * 5); // Vectors have 4 floats and we grab a position, direction, resulting point, resulting normal, and resulting tangent vector for each bounce. This should be the max amount of ray vectors per pixel.
    var rayBuffer = new Array((MaxBounce + 1) * 5);
    var rayBufferIndex = 0;

    for(; rayBufferIndex < rayBuffer.length; ++rayBufferIndex){
        rayBuffer[rayBufferIndex] = new Float32Array(rayBufferBuffer.buffer, rayBufferIndex << 4, 4);
    }

    rayBufferIndex = 0;

    function resetRayBuffer(){
        rayBufferIndex = 0;
    }

    function getNewVector(){
        var vector = rayBuffer[rayBufferIndex]; //rayBuffer.subarray(rayBufferIndex, rayBufferIndex + 4);
        rayBufferIndex++;

        //vector.fill(0, 0, 2);
        vector[0] = 0.0;
        vector[1] = 0.0;
        vector[2] = 0.0;
        vector[3] = 1.0;        

        return vector;
    }

    function tracePath(ray, camera, scene, depth, maxDepth, outputColor){
        if(depth >= MaxBounce){
            outputColor[0] = 0;
            outputColor[1] = 0;
            outputColor[2] = 0;
            outputColor[3] = 1.0;
            return;
        }

        var rayHit = ray.cast(scene, maxDepth, getNewVector(), getNewVector(), getNewVector());
        if(rayHit == null){
            outputColor[0] = 0;
            outputColor[1] = 0;
            outputColor[2] = 0;
            outputColor[3] = 1.0;
            return;
        }
        maxDepth -= rayHit.depth;

        var material = rayHit.target.material;

        var newRay = new Ray(material.reflectedRay(ray.direction, rayHit.normal, rayHit.tangent, getNewVector()), getNewVector());
        Vector.scale(rayHit.normal, SceneObject.EPSILON, newRay.origin);
        Vector.add(newRay.origin, rayHit.position, newRay.origin); 
        
        var cos_theta = Vector.dot(newRay.direction, rayHit.normal);

        this.tracePath(newRay, camera, scene, depth + 1, maxDepth, outputColor);

        return material.calculateResultingColorCombination(cos_theta, outputColor);
    }
    
    var outColorBuffer = new Vector();
    function calculateColor(x, y, camera, scene, maxDepth, colorIndex, colorBuffer){
        resetRayBuffer();

        let vector = getNewVector();
        vector[0] = x;
        vector[1] = y;
        vector[2] = -camera.nearPlane;
        vector = Vector.normalize(vector);

        let ray = new Ray(vector, Vector.zero);
        let outputColor = outColorBuffer;
        outputColor[0] = 0.0;
        outputColor[1] = 0.0;
        outputColor[2] = 0.0;

        tracePath(ray, camera, scene, 0, maxDepth, outputColor);

        colorBuffer[colorIndex] = (colorBuffer[colorIndex] * 0.75) + Math.floor(outputColor[0] * 63);
        colorBuffer[colorIndex + 1] = (colorBuffer[colorIndex + 1] * 0.75) + Math.floor(outputColor[1] * 63);
        colorBuffer[colorIndex + 2] = (colorBuffer[colorIndex + 2] * 0.75) + Math.floor(outputColor[2] * 63);

        colorBuffer[colorIndex + 3] = 255;
    }

    Renderer.prototype.updateBuffer = function(timeDelta, scene){
        var width = this.canvas.width;
        var height = this.canvas.height;
        var divW = 1.0 / (width >> 1);
        var divH = 1.0 / (height >> 1);
        var data = this.imgBuffer.data;

        // TODO: Handle aspect ratio.
        var x = -1.0;
        var y = -1.0;
        var w = 0;
        var h = 0;
        var index = 0;

        for(h = 0; h < height; ++h){
            x = -1.0;

            for(w = 0; w < width; ++w){
                calculateColor(x, y, this.camera, scene, this.maxDepth, index << 2, data);

                x += divW;
                ++index;
            }

            y += divH
        }

    }

    Renderer.prototype.draw = function(){
        this.context.putImageData(this.imgBuffer, 0, 0);
    }
}