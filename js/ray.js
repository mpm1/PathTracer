var Ray = function(vector, origin){
    this.origin = origin;
    this.direction = vector;
}
{
    var vectorBuffer = new Vector();
    Ray.prototype.cast = function(scene, maxDepth, resultPointBuffer, normalBuffer, tangentBuffer){
        var depth = 0.0;
        
        var point = resultPointBuffer;
        point[0] = this.origin[0];
        point[1] = this.origin[1];
        point[2] = this.origin[2];

        var vector = vectorBuffer;
        var step = 100;
        var result;
        do{
            result = scene.findNearest(this, point, maxDepth);
            if(result == null){
                break;
            }

            depth += result.distance;
            
            if(result.target != null){
                Vector.scale(this.direction, depth, vector);
                Vector.add(this.origin, vector, point);
                var target = result.target;

                if(target.isPointOnObject(point)){
                    return {
                        target: target,
                        position: point,
                        depth: depth,
                        normal: target.getNormal(point, normalBuffer),
                        tangent: target.getTangent(point, tangentBuffer),
                    }
                }
            }

            --step;
        }while(depth < maxDepth && step > 0);   

        return null;
    }
}