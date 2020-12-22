const fs=require('fs');

let usage = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;

var JSONFILE = "./todo.json";
var DONEJSONFILE = "./done.json";
var TEXTFILE = "./todo.txt";
var DONETEXTFILE = "./done.txt";


function jsontodototext(){
	var contents = fs.readFileSync(JSONFILE);  //read file contents
	var data1 = JSON.parse(contents);  //parse contents
	fs.writeFileSync(TEXTFILE,"");

	var array=[];
	data1.forEach(function (task,index){
		array[index]=task.task;
	});

	for( i=data1.length-1; i>=0; i--){
		var dataString = (data1[i].task);  //strigify JSON
	    fs.appendFileSync(TEXTFILE,dataString+"\r\n");  //write to  file
	}
	
}

function jsondonetotext(){
	var contents = fs.readFileSync(DONEJSONFILE);  //read file contents
	var data1 = JSON.parse(contents);  //parse contents
	fs.writeFileSync(DONETEXTFILE,"");
	
	var array=[];
	data1.forEach(function (task,index){
		array[index]=task.task;
	});
	
	for( i=data1.length-1; i>=0; i--){
		var dataString = ("x "+data1[i].donedate+" "+data1[i].task);  //strigify JSON
		fs.appendFileSync(DONETEXTFILE,dataString+"\r\n");  //write to  file
	}
	
}


function initialize(){    //create file if it's not present.
	if(!fs.existsSync(JSONFILE)){
		setData([]);	
	}		
}

function initialize1(){    //create file if it's not present.
	if(!fs.existsSync(DONEJSONFILE)){
		setData([]);	
	}	
}

function date(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    today = yyyy+'-'+mm+'-'+dd;
    return today;
}

function getData(){
    var contents = fs.readFileSync(JSONFILE);  //read file contents
    var data = JSON.parse(contents);  //parse contents
    return data;
}   
    
function getDoneData(){
    var contents = fs.readFileSync(DONEJSONFILE);  //read file contents
    var data = JSON.parse(contents);  //parse contents
    return data;
}
    
function setData(data){
    var dataString = JSON.stringify(data);  //strigify JSON
    fs.writeFileSync(JSONFILE,dataString);  //write to  file
}
    
function add(task) {
	if(task){
    var data = getData();  //get data
    data.push({task:task,completed:false});  //add item
	console.log(`Added todo: \"`+ task+`\"`);
	setData(data);  //set data
	jsontodototext();}
	else{
		console.log( "Error: Missing todo string. Nothing added!")
	}
}
        
function done(task) {  
	var today= date();
    var data = getData();  //get data
    var x=data.length;
    var no=Number(task)+1;
    if(task+1<1||task+1>x){
		console.log("Error: todo #"+no+" does not exist.");
    }
    else{
        console.log("Marked todo #"+ no+ " as done.");
		data[task].completed = !data[task].completed; // (true->false)
		// data[task].completed = true;
        if(data[task].completed==true){
			data[task].donedate=today;
            var contents = fs.readFileSync(DONEJSONFILE);  //read file contents
            var data1 = JSON.parse(contents);  //parse contents
			data1.push(data[task]);  //add item
            var dataString = JSON.stringify(data1);  //strigify JSON
            fs.writeFileSync(DONEJSONFILE,dataString);  //write to  file
            data.splice(task,1);  //delete item from JSONFILE
			setData(data);//set data
			jsontodototext();
			jsondonetotext();
        }
	}}

	
function del(task){
    var data = getData();  //get data
    var x=data.length;
    var no=Number(task)+1;
    if(task+1<1||task+1>x){
        console.log("Error: todo #"+no+" does not exist. Nothing deleted.");
	}

    else{
        console.log("Deleted todo #"+ no);
        data.splice(task,1);  //delete item
		setData(data);  //set data
		jsontodototext();
		
	}}
    

function list(){
	var data = getData();
    if(data.length > 0){

		var array=[];
		data.forEach(function (task,index){
            array[index]=task.task;
		});

		for( i=data.length-1; i>=0; i--){
			console.log("["+(i+1)+"] ",array[i]);
		}

    }
    else{
        console.log("There are no pending todos!");
    }
}
    
    
function repo(){
	var today= date();
    var data = getData();
	var ddone = getDoneData();
	var pend=data.length;
	var compl=ddone.length;
	console.log(today+" Pending : " +pend+" Completed : "+ compl);
}
    
    
var command = process.argv[2];
var argument = process.argv[3];
    
initialize();
initialize1();

switch(command){
    case "help":
        console.log(usage);
        break;
    case "ls":
        list();
        break;
    case "add":
        add(argument);
        break;
    case "del":
			if(!argument){
			console.log("Error: Missing NUMBER for deleting todo.");
		}
		else{
        del(argument-1);}
        break;
    case "done":
		if(!argument){
			console.log("Error: Missing NUMBER for marking todo as done.");
		}
		else{
        done(argument-1);}
        break;
    case "report":
        repo();
        break;
    default:
        console.log(usage);
        break;
    }
