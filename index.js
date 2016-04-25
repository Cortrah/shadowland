var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');

// Import our dummy data
var data = require('./data/turn1.json');

//====================
// Species
//====================
const Species = new graphql.GraphQLObjectType({
    name: 'Species',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        code: { type: graphql.GraphQLString },
        description: { type: graphql.GraphQLString }
    })
});

//====================
// Faction
//====================
const Faction = new graphql.GraphQLObjectType({
    name: 'Faction',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        code: { type: graphql.GraphQLString },
        description: { type: graphql.GraphQLString }
    })
});

//====================
// Host
//====================
const Host = new graphql.GraphQLObjectType({
    name: 'Host',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString }
    })
});


//====================
// Turn
//====================
const Turn = new graphql.GraphQLObjectType({
    name: 'Turn',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        number: { type: graphql.GraphQLInt },
        introduction: { type: graphql.GraphQLString },
        results: { type: graphql.GraphQLString }
    })
});

//====================
// Position
//====================
const Position = new graphql.GraphQLObjectType({
    name: 'Position',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        code: { type: graphql.GraphQLString },
        color: { type: graphql.GraphQLInt },
        firstTurn: { type: graphql.GraphQLInt },
        lastTurn: { type: graphql.GraphQLInt },
        isSecret: { type: graphql.GraphQLBoolean }
    })
});

//====================
// TerrainType
//====================
const TerrainType = new graphql.GraphQLObjectType({
    name: 'TerrainType',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        code: { type: graphql.GraphQLString },
        description: { type: graphql.GraphQLString }
    })
});

//====================
// BorderType
//====================
const BorderType = new graphql.GraphQLObjectType({
    name: 'BorderType',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        code: { type: graphql.GraphQLString },
        isdirectional: { type: graphql.GraphQLBoolean },
        description: { type: graphql.GraphQLString },
        effect: { type: graphql.GraphQLString }
    })
});

//====================
// RegionsBorder
//====================
const RegionsBorder = new graphql.GraphQLObjectType({
    name: 'RegionsBorder',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        code: { type: graphql.GraphQLString },
        sourceRegionId: {type: graphql.GraphQLID},
        sinkRegionId: { type: graphql.GraphQLID},
        borderTypeId: { type: graphql.GraphQLID },
        isSecret: { type: graphql.GraphQLBoolean }
    })
});

//====================
// Region
//====================
const Region = new graphql.GraphQLObjectType({
    name: 'Region',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        code: { type: graphql.GraphQLString },
        row: { type: graphql.GraphQLInt },
        col: { type: graphql.GraphQLInt },
        terrainType: { type: TerrainType },
        positionId: {type: Position },
        isSecret: { type: graphql.GraphQLBoolean },
        //borders: {
        //    type: new graphql.GraphQLList( RegionsBorder )
        //}
    })
});

//====================
// Map
//====================
const Map = new graphql.GraphQLObjectType({
    name: 'Map',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        code: { type: graphql.GraphQLString },
        rows: { type: graphql.GraphQLInt },
        cols: { type: graphql.GraphQLInt },
        bg: { type: graphql.GraphQLString },
        //regions: {
        //    type: new graphql.GraphQLList(Region)
        //}
    })
});

//====================
// GameStatus
//====================
const GameStatus = new graphql.GraphQLEnumType({
    name: 'GameStatus',
    description: 'Processing stages for game turns',
    values: {
        PREPARING: {
            value: 1,
            description: 'Inviting and waiting for players.'
        },
        PLAYING: {
            value: 2,
            description: 'Players filling out turns.'
        },
        PROCESSING: {
            value: 3,
            description: 'System processing turn.'
        },
        COMPLETED: {
            value: 4,
            description: 'Game has finished.'
        }
    }
});

//====================
// The Game Schema
//====================
const GameSchema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'GameQuery',
        fields: () => ({
            id: { type: graphql.GraphQLString },
            name: { type: graphql.GraphQLString },
            //positions: {
            //    type: graphql.GraphQLList( Position),
            //    args: {
            //        id: {
            //            type: graphql.GraphQLString
            //        }
            //    },
            //    resolve: function (_, args) {
            //        return data[args.id];
            //    }
            //},
            map: {
                type: Map,
                args: {
                    id: {
                        type: graphql.GraphQLString
                    }
                },
                resolve: function (_, args) {
                    return data[args.id];
                }
            },
            //turns: {
            //    type: graphql.GraphQLList(Turn),
            //    args: {
            //        id: {
            //            type: graphql.GraphQLString
            //        }
            //    },
            //    resolve: function (_, args) {
            //        return data[args.id];
            //    }
            //},
            currentTurn: { type: graphql.GraphQLInt},
            status: { type: GameStatus},
            nextTick: { type: graphql.GraphQLString},
            host: {
                type: Host,
                args: {
                    id: { type: graphql.GraphQLString }
                },
                resolve: function (_, args) {
                    return data[args.id];
                }
            }
        })
    })
});

console.log('Gogo Gadget');
express()
    .use('/graphql', graphqlHTTP({ schema: GameSchema, pretty: true }))
    .listen(3000);