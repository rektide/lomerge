#!/usr/bin/env node
"use strict"

var
  fs= require("fs"),
  isArray= require("lodash.isarray"),
  mergeWith= require("lodash.mergewith")

function arrayMergeCustomization(o, n){
	if(isArray(o)){
		return o.concat(n)
	}
}

function lomerge(args){
	if(!args.jsons&& args.deserialize){
		args.jsons= args.deserialize(args.files)
	}
	return Promise.all(args.jsons).then(function(a){
		a.push(arrayMergeCustomization)
		return mergeWith.apply(null, a)
	})
}

function readJson(filename){
	return new Promise(function(resolve, reject){
		fs.readFile(filename, "utf8", function(err, file){
			if(err) reject(err)
			resolve(JSON.parse(file))
		})
	})
	return defer.promise
}

function readJsons(files){
	return files.map(readJson)
}

function main(args){
	args= args|| {}

	// input
	args.stdin= args.stdin|| process.stdin
	args.files= args.files|| process.argv.slice(2)
	args.deserialize= args.deserialize|| readJsons

	// output
	args.stdout= args.stdout|| process.stdout
	args.serialize= args.serialize|| JSON.stringify
	return lomerge(args)
}

function mainAndPrint(args){
	args= {}
	main(args).then(function(o){
		console.log(args.serialize(o))
	})
}

function uncaught(){
	process.on("unhandledRejection", console.error)
}

if(require.main === module){
	uncaught()
	mainAndPrint()
}

module.exports= main
module.exports.main= mainAndPrint
module.exports.readJson= readJson
module.exports.readJsons= readJsons
module.exports.lomerge= lomerge
module.exports.arrayMergeCustomization= arrayMergeCustomization
