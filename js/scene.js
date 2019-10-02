var BinaryTree = function(axis = 0, value = 0){
    this.axis = axis; // 0 = x, 1 = y, 2 = z
    this.value = value;
    this.less = null;
    this.greater = null;
    this.elements = [];
}
{
    BinaryTree.prototype.add = function(sceneObject){
        var position = sceneObject.position[this.axis];
        var size = sceneObject.size[this.axis] / 2.0;
        var min = position - size;
        var max = position + size;

        if(max < this.value){
            if(this.less == null){
                var newAxis = (this.axis + 1) % 3;
                this.less = new BinaryTree(newAxis, sceneObject.position[newAxis]);
            }

            this.less.add(sceneObject);
        }else if(min > this.value){
            if(this.greater == null){
                var newAxis = (this.axis + 1) % 3;
                this.greater = new BinaryTree(newAxis, sceneObject.position[newAxis]);
            }

            this.greater.add(sceneObject);
        }else{
            this.elements.push(sceneObject);
        }
    }

    BinaryTree.prototype.findNearest = function(point){
        // TODO
    }
}


var SceneObject = function(){
    this.init(0.0, 0.0, 0.0);
}
{
    SceneObject.EPSILON = 0.00001;

    SceneObject.prototype.init = function(x, y, z){
        this.position = new Vector(x, y, z);
        this.size = new Float32Array([0.0, 0.0, 0.0]);
        this.children = null;
        this.material = null;
    }

    SceneObject.prototype.addChild = function(childObject){
        if(this.children == null){
            this.children = [childObject];
        }else{
            this.children.push(childObject);
        }
    }

    SceneObject.prototype.findNearest = function(ray, position, maxDepth){
        var distance = maxDepth;
        var result = null;

        if(this.children != null){
            this.children.forEach(function(child){
                var nearest = child.findNearest(ray, position, maxDepth);

                if(nearest != null && nearest.distance < distance){
                    result = nearest;
                    distance = result.distance;
                }
            });
        }

        return result;
    }

    SceneObject.prototype.isPointOnObject = function(point){
        return false;
    }

    SceneObject.prototype.getNormal = function(outputVector){
        outputVector[0] = 0.0;
        outputVector[1] = 1.0;
        outputVector[2] = 0.0;

        return outputVector;
    }

    SceneObject.prototype.getTangent = function(point, outputVector){
        outputVector[0] = 1.0;
        outputVector[1] = 0.0;
        outputVector[2] = 0.0;
    }
}

var Sphere = function(x, y, z, r){
    this.init(x, y, z, r);
}
{
    Sphere.prototype = Object.create(SceneObject.prototype);

    Sphere.prototype.init = function(x, y, z, r){
        SceneObject.prototype.init.call(this, x, y, z);

        this.radius = r;

        var size = this.size;
        size[0] = size[1] = size[2] = r + r;
    }

    var lBuffer = new Vector();
    Sphere.prototype.findNearest = function(ray, position, maxDepth){
        var t0, t1;
        var r2 = this.radius * this.radius;
        var L = Vector.subtract(position, this.position, lBuffer);
        var a = 1.0;//Vector.dot(ray.direction, ray.direction);
        var b = 2.0 * Vector.dot(ray.direction, L);
        var c = Vector.lengthSquared(L) - r2;
        var result = maxDepth;
        
        // Solve the quadratic equation
        var discr = b * b - 4.0 * a * c;

        if(discr < 0.0){
            return null;
        }

        if(discr == 0.0){
            t0 = t1 = -0.5 * b / a;
        }else{
            var q = (b > 0.0) ? -0.5 * (b + Math.sqrt(discr)) : -0.5 * (b - Math.sqrt(discr));

            t0 = q / a;
            t1 = c / q;
        }

        if(t0 > t1){
            if(t1 >= 0.0){
                result = t1;
            }else if(t0 >= 0.0){
                result = t0;
            }
        }else{
            if(t0 >= 0.0){
                result = t0;
            }else if(t1 >= 0.0){
                result = t1;
            }
        }

        return {
            target: this,
            distance: result
        };
    }

    Sphere.prototype.isPointOnObject = function(point){
        var distance = Vector.distance(this.position, point);

        return Math.abs(distance - this.radius) < SceneObject.EPSILON;
    }

    Sphere.prototype.getNormal = function(point, outputVector){
        Vector.subtract(point, this.position, outputVector);
        Vector.normalize(outputVector);

        return outputVector;
    }
}
