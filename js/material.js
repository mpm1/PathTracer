var Material = function(){
    this.init();
}
{
    const p = 1 / (2 * Math.PI);
    const piDiv = 1.0 / Math.PI;

    Material.prototype.init = function(){
        this.reflectance = new Vector();
        this.emittance = new Vector();
        this.roughness = 0.0; 
    }

    Material.prototype.calculateResultingColorCombination = function(cos_theta, outputColor){
        var emittance = this.emittance;
        var BRDF = Vector.scale(this.reflectance, piDiv, new Vector());
        var amount = cos_theta / p;

        outputColor[0] = emittance[0] + (BRDF[0] * outputColor[0] * amount);
        outputColor[1] = emittance[1] + (BRDF[1] * outputColor[1] * amount);
        outputColor[2] = emittance[2] + (BRDF[2] * outputColor[2] * amount);

        return outputColor;
    }

    Material.prototype.reflectedRay = function(incident, normal, tangent, outputVector){
        var newNormal;
        var roughness = this.roughness;
        
        // Calcualte the bounce offset.
        if(roughness <= 0.0){
            newNormal = normal;
        }else{
            newNormal = Vector.normalize(new Vector(
                normal[0] + ((Math.random() * 2.0) - 1.0) * roughness,
                normal[1] + ((Math.random() * 2.0) - 1.0) * roughness,
                normal[2] + ((Math.random() * 2.0) - 1.0) * roughness
            ));
        }

        Vector.reflect(incident, newNormal, outputVector);

        outputVector[0] = -outputVector[0];
        outputVector[1] = -outputVector[1];
        outputVector[2] = -outputVector[2];

        return outputVector;
    }
}

var GlossMaterial = function(){
    this.init();
}
{
    GlossMaterial.prototype = Object.create(Material.prototype);

    GlossMaterial.prototype.init = function(){
        Material.prototype.init.call(this);

        this.reflectAmount = 0.5; // Probability of reflected rays.
    }

    GlossMaterial.prototype.reflectedRay = function(incident, normal, tangent, outputVector){
        var newNormal;
        var roughness = Math.random() <= this.reflectAmount ? 0.0 : this.roughness;
        
        // Calcualte the bounce offset.
        if(roughness <= 0.0){
            newNormal = normal;
        }else{
            newNormal = Vector.normalize(new Vector(
                normal[0] + ((Math.random() * 2.0) - 1.0) * roughness,
                normal[1] + ((Math.random() * 2.0) - 1.0) * roughness,
                normal[2] + ((Math.random() * 2.0) - 1.0) * roughness
            ));
        }

        Vector.reflect(incident, newNormal, outputVector);

        outputVector[0] = -outputVector[0];
        outputVector[1] = -outputVector[1];
        outputVector[2] = -outputVector[2];

        return outputVector;
    }
}