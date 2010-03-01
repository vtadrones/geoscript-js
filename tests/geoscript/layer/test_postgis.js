var assert = require("test/assert");
var Feature = require("geoscript/feature").Feature;
var Layer = require("geoscript/layer").Layer;

var getLayer = function() {
    return new Layer({
        workspace: {type: "postgis", database: "geoscript"},
        name: "states"
    });
};

exports["test: features"] = function() {
    var layer = getLayer();
    var count, features, feature;

    // get all features
    features = layer.features;
    count = layer.count;

    assert.isTrue(features.hasNext(), "hasNext returns true");

    var log = [];
    var testScope = {};
    features.forEach(function() {log.push({args: arguments, scope: this})}, testScope);

    assert.is(count, log.length, "forEach calls block once for each feature");
    assert.isTrue(log[0].args[0] instanceof Feature, "forEach calls block with feature");
    assert.is(testScope, log[0].scope, "forEach calls block with correct scope");

    assert.isTrue(!features.hasNext(), "after forEach, hasNext returns false");
    assert.is(undefined, features.next(), "if not hasNext, next returns undefined");

    // test some additional cursor properties
    features = layer.features;
    assert.is(-1, features.index, "index is -1 to start");
    assert.is(null, features.current, "current is null before read");

    // read 1 - index: 0
    feature = features.next();
    assert.isTrue(feature instanceof Feature, "0: next reads a feature");
    assert.is(0, features.index, "0: index is 0 after 1 read");
    assert.isTrue(feature === features.current, "0: current feature set to most recently read");

    // skip 3 - index: 3
    features.skip(3);
    assert.is(3, features.index, "3: index is 3 after skip");
    assert.isTrue(feature === features.current, "3: current feature is still last read");

    // read 3 - index: 6
    var list = features.read(3);
    assert.is(3, list.length, "6: read 3 returns 3");
    assert.isTrue(list[0] instanceof Feature, "6: list contains features");
    assert.isTrue(list[2] === features.current, "6: current is most recetly read");

    // skip 40 - index: 46
    features.skip(40);
    assert.is(46, features.index, "46: index is 46 after skip");

    // read 10 - index: 48 (only 49 features)
    list = features.read(10);
    assert.is(48, features.index, "48: index is 48 after exhausting cursor");
    assert.is(2, list.length, "48: 2 features read");
    assert.is(null, features.current, "48: current is null after closing cursor");
    
    layer.workspace.close();
};

exports["test: query"] = function() {
    var layer = getLayer();
    var count, features, feature;

    // query with a filter
    features = layer.query("STATE_ABBR EQ 'TX'");
    assert.isTrue(features.hasNext(), "hasNext returns true");

    feature = features.next();
    assert.is("TX", feature.get("STATE_ABBR", "got feature with expected STATE_ABBR"));

    assert.isFalse(features.hasNext(), "only one feature in query results");    

    layer.workspace.close();        
};

// exports["test: remove"] = function() {
//     var layer = getLayer();
//     assert.is(49, layer.count, "49 features before remove");
// 
//     layer.remove("STATE_NAME = 'Illinois'");
//     assert.is(48, layer.count, "48 features after remove");  
//     
//     layer.workspace.close();
// };

if (require.main === module.id) {
    require("test/runner").run(exports);
}