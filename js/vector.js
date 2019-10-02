const Vector = function(x = 0.0, y = 0.0, z = 0.0, w = 1.0){
    return new Float32Array([x, y, z, w]);
}
{
    Vector.zero = new Vector(0.0, 0.0, 0.0, 1.0);
    Vector.one = new Vector(1.0, 1.0, 1.0, 1.0);
    Vector.up = new Vector(0.0, 1.0, 0.0, 1.0);
    Vector.down = new Vector(0.0, -1.0, 0.0, 1.0);
    Vector.right = new Vector(1.0, 0.0, 0.0, 1.0);
    Vector.left = new Vector(-1.0, 0.0, 0.0, 1.0);
    Vector.forward = new Vector(0.0, 0.0, -1.0, 1.0);
    Vector.backward = new Vector(0.0, 0.0, 1.0, 1.0);

    Vector.fromBuffer = function(buffer, index = 0){
        // Each index contain
        return new Float32Array(buffer, index << 4, 4);
    }
    Vector.createArrayBuffer = function(count){
        return new Float32Array(count);
    }

    // Mathimatical functions
    Vector.distance = function(v1, v2){
        var x = v2[0] - v1[0];
        var y = v2[1] - v1[1];
        var z = v2[2] - v1[2];

        return Math.sqrt(x * x + y * y + z * z);
    }

    Vector.length = function(v){
        var x = v[0];
        var y = v[1];
        var z = v[2];

        return Math.sqrt(x * x + y * y + z * z);
    }

    Vector.lengthSquared = function(v){
        var x = v[0];
        var y = v[1];
        var z = v[2];

        return x * x + y * y + z * z;
    }

    Vector.normalize = function(v, outputVector){
        if(!(outputVector)){
            outputVector = v;
        }

        var x = v[0];
        var y = v[1];
        var z = v[2];
        var dist = Math.sqrt(x * x + y * y + z * z);

        if(dist == 0.0){
            outputVector[0] = 0.0;
            outputVector[1] = 0.0;
            outputVector[2] = 0.0;
        }else{
            outputVector[0] = x / dist;
            outputVector[1] = y / dist;
            outputVector[2] = z / dist;
        }

        return outputVector;
    }

    Vector.scale = function(v, s, outputVector){
        outputVector[0] = v[0] * s;
        outputVector[1] = v[1] * s;
        outputVector[2] = v[2] * s;

        return outputVector;
    }

    Vector.add = function(a, b, outputVector){
        outputVector[0] = a[0] + b[0];
        outputVector[1] = a[1] + b[1];
        outputVector[2] = a[2] + b[2];

        return outputVector;
    }

    Vector.subtract = function(a, b, outputVector){
        outputVector[0] = a[0] - b[0];
        outputVector[1] = a[1] - b[1];
        outputVector[2] = a[2] - b[2];

        return outputVector;
    }

    Vector.dot = function(a, b){
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    Vector.reflect = function(v, n, outputVector){
        var scale = 2 * Vector.dot(n, v);
        
        Vector.scale(n, scale, outputVector);
        Vector.subtract(outputVector, v, outputVector);
        
        return outputVector;
    }
}