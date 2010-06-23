var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");
var FEATURE = require("geoscript/feature");

exports["test: constructor"] = function() {
    
    var field;
    
    field = new FEATURE.Field();
    ASSERT.ok(field instanceof FEATURE.Field, "correct instance");
    
    ASSERT.throws(function() {
        field = new FEATURE.Field({name: "foo"});
    }, Error, "type is required");

    ASSERT.throws(function() {
        field = new FEATURE.Field({type: "String"});
    }, Error, "name is required");

    ASSERT.throws(function() {
        field = new FEATURE.Field({type: "foo"});
    }, Error, "unsupported type throws error");
    
    field = new FEATURE.Field({
        name: "place",
        type: "String"
    });
    ASSERT.strictEqual(field.name, "place", "correct name");
    ASSERT.strictEqual(field.type, "String", "correct type");
    
    field = new FEATURE.Field({
        name: "place",
        type: "Point",
        projection: "EPSG:4326"
    });
    ASSERT.strictEqual(field.type, "Point", "correct type");
    ASSERT.ok(field.projection instanceof PROJ.Projection, "correct projection");
    
};

exports["test: fromValue"] = function() {
    
    var field;
    
    field = FEATURE.Field.fromValue("place", "Guatemala");
    ASSERT.strictEqual(field.name, "place", "correct name");
    ASSERT.strictEqual(field.type, "String", "correct type");

    field = FEATURE.Field.fromValue("pop", 100);
    ASSERT.strictEqual(field.name, "pop", "correct name");
    ASSERT.strictEqual(field.type, "Double", "correct type");

    field = FEATURE.Field.fromValue("loc", new GEOM.Point([1, 2]));
    ASSERT.strictEqual(field.name, "loc", "correct name");
    ASSERT.strictEqual(field.type, "Point", "correct type");    
    
};

if (require.main == module.id) {
    require("test").run(exports);
}