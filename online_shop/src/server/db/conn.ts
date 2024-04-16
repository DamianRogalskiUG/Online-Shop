const { MongoClient, Db, ServerApiVersion } = require('mongodb');

require("dotenv").config({path: "./.env"});
const MURI = process.env.MONGO_URI as string;
const uri = "mongodb+srv://damian02:Project123321@project-onlyshop.sdsoopo.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = {
  connect: async (): Promise<any> => {
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      return client;
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    } 
  }
};