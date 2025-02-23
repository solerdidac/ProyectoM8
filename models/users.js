const { connectToMongoDB } = require("./mongodb");

async function getUserByUsername(username) {
    const db = await connectToMongoDB();
    const usersCollection = db.collection("users");
    return await usersCollection.findOne({ username });
}

async function createUser(username, password) {
    const db = await connectToMongoDB();
    const usersCollection = db.collection("users");

    const result = await usersCollection.insertOne({ username, password });
    return result.insertedId; 
}

module.exports = { getUserByUsername, createUser };
