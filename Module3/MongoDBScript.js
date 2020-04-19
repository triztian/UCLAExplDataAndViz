//for Windows
//https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

//to install
//https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows///install-mongodb-community-edition

//for MacOS
// Download Mongo
// Create the data directory
mkdir -p /data/db
//Make data directory readable/writeable
sudo chown -R ael-annan /data


/* After one-time Mongo installation above */
//Step 1: Spin up a server (a machine that manages access to a service, usually centeralized, and on a //network), this runs the 'mongo program'
//Run the mongo server
mongod

//Hack check
http://localhost:27017/

//Should get this message
//It looks like you are trying to access MongoDB over HTTP on the native driver port.

//Step 2: Start a client (can be any machine that access/calls or uses a server, or generally any human //service that interfaces with another program), this runs allows the user to 'interact with mongo'
////// Use the mongo server via the client
// Open a new terminal/window and connect to that server running on localhost (i.e. your computer)
// on 127.0.0.1 (same thing as local host)
mongo --host 127.0.0.1:27017

// (Optional) further reading
//More detail on Mongos' architecture, scripting, shell (client)
//https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows///install-mongodb-community-edition
//https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/
//https://docs.mongodb.com/manual/reference/mongo-shell/

//Long list of methods if you want to run more commands
//db.help()  

//Step 3a.1: Create your database
//create your own database (although we use the term 'database' here it is not a relational database) //mongo just names certain things equivalently to the concept they map to in the relational world
use testDB

//Step 3a.2: Create your collection (and a test key/value pair)
//collection is the datastructure that stores document

//create key/value pair to store
testJSON = { Name : "Ali", Lastname: "El-Annan" }

//create collection
db.testCollection.insert( testJSON );

//check that record was created

//return all documents (the term for 'rows'/items/objects in Mongo)
db.testCollection.find()

//return like %Annan%
db.testCollection.find({"Lastname": /.*Annan.*/})

//Clean up, drop collection
db.testCollection.drop()

//Step 3b.1: Create your database
//create your own database (although we use the term 'database' here it is not a relational database) 
//mongo just names certain things equivalently to the concept they map to in the relational world
use cfpbDB

//Step 3b.2: Import into your collection
//download a dataset
//Consumer Complaint Database - CFPB, complaints we’ve received about financial products and services
//https://catalog.data.gov/dataset/consumer-complaint-database

//Step 3: Import your data, in this case it's csv data
////// We will briefly exit mongo client and use the mongoimport program to pull in a csv file

// exit mongo client
exit

// let's do the import
// Change to your path/where you downloaded the file
//import data, -d [your database name], -c [your collection name], etc.

mongoimport -d cfpbDB -c cfbCollection --type csv --file /Users/ael-annan/Desktop/Storage/MveMveMve/UCLAInstructor/Modules/Module3/Consumer_Complaints.csv --headerline;

//re-enter the mongo client
mongo --host 127.0.0.1:27017

//switch to cfpb database
use cfpbDB

//get a look at a document, see what key's we have available to select from
db.cfbCollection.findOne()

//////////// OPTIONAL
// Find the count of unique issues

//MapReduce compared to Aggregation compare to Distinct
//Aggregation is faster (written in C++ directly, uses optimizations) than MapReduce (but if you can't 
//do something in Aggregation, use MapReduce (or if you've somehow found a more performant way to do it 
//that is maintainable, or you have multiple machines and need to write your own unique functions), and 
//finally, there are SOMETIMES functions, like Distinct which are more readable/convenient but has a 16 
//mb document size limit

////// From the MongoDB tickets
//https://jira.mongodb.org/browse/DOCS-9120
//'...distinct command / wrapper method as a convenience method with limited result size...'

// Option 1: Use MapReduce
//https://docs.mongodb.com/manual/reference/command/mapReduce/
//Declare variables for convenience/clarity
var originalCollection = db.cfbCollection;
var distinctCollection = db.cfbCollectionUniqueIssues;

//incase the collection is already created
distinctCollection.drop();

//map
//find all unique keys
map = function() {
  emit( this.Issue , {count: 1}); //this.Issue, because we want to focus/zero in on Issues key
}

//reduce
//count the unique keys (Issues in oru case that we specified in the mapping function)
reduce = function(key, values) {
  var count = 0;

  values.forEach(function(v) {
    count += v['count'];   
  });

  return {count: count};
};

//run the actual mapReduce function with the 2 declared functions above (map, reduce)
res = originalCollection.mapReduce( map, reduce, 
    { out: 'distinct', 
     verbose: true
    }
    );

print( "Total number of Issues", res.counts.output );

// Option 2: Use Aggregation
//https://docs.mongodb.com/manual/reference/command/aggregate/
// Or use the built-in Mongo aggregation pipeline 
// Basically it's 'faster'/more 'convenient' for many/most cases
// Find the count of unique Issues'
db.cfbCollection.aggregate( 
   {$group : {_id : "$Issue"} }, 
   {$group: {_id:1, count: {$sum : 1 }}});


// Option 3: Sometimes there are even more convenient methods than the pipeline/aggregate in Mongodb
//https://docs.mongodb.com/manual/reference/command/distinct/
db.cfbCollection.distinct( "Issue" ).length


// Well how many different keys are there? what things do not contain foreclosures?
//let's search for all complaints containing the word 'foreclosure'
db.cfbCollection.find({"Issue": /.*foreclosure.*/})

//let's find the count of those issues, that have foreclosure
//https://docs.mongodb.com/manual/aggregation/
db.cfbCollection.aggregate(
    [
        {"$match" : {
                "Issue" : /^.*foreclosure.*$/i
            }
        }, 
        {"$group" : {
                "_id" : {}, 
                "TotalIssuesWithForeclosures" : {
                    "$sum" : NumberInt(1)}
                    }}]);

//let's find the total number of documents
db.cfbCollection.aggregate(
    [{"$group" : {
                "_id" : {}, 
                "TotalIssues" : {
                    "$sum" : NumberInt(1)}
                    }}]);


// About 11% of the issues are foreclosures
//1-((1015280-112314) / 1015280)

//clean up, bring down your mongo server
use admin
db.shutdownServer()