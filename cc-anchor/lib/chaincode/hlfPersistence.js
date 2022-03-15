function HLFPersistenceStrategy(stub){
    const ccPersistence = stub;
    const self = this;
    const chainCodeOperations = new ChainCodeOperations();

    /*index, {101}
    0, Ghhhh
    1, ...
    2, ....
*/

  //  101,, ././

    self.getAnchorIdOnIndex = function(index, callback){
        chainCodeOperations.getAnchorIdOnIndex(index, ccPersistence, (err, data) =>{
            if (err){
                return callback(undefined,null);
            }
            return callback(undefined, data);
        });
    }

    self.getTotalNumberOfAnchors = function(callback){
        chainCodeOperations.getTotalNumberOfAnchors(ccPersistence, (err, data) =>{
            if (err){
                return callback(undefined,null);
            }
            return callback(undefined, data);
        });
    }

    self.anchorExist = function(anchorId, callback){
        chainCodeOperations.anchorExist(anchorId,ccPersistence,(err,exists) =>{
            if (err){
                return callback(err);
            }
            if (!exists){
                return callback(undefined,null);
            }
            return callback(undefined,true)
        })
    }

    self.getLastVersion = function (anchorId, callback){
        chainCodeOperations.anchorExist(anchorId,ccPersistence,(err,exists) =>{
            if (err){
                return callback(undefined,null);
            }
            if (!exists){
                return callback(undefined,null);
            }
            //read the last hashlink for anchorId
            return chainCodeOperations.getlastVersion(anchorId,ccPersistence, callback);
        })
    }
    self.getAllVersions = function (anchorId, callback){
        // read all hashlinks for anchorId
        chainCodeOperations.anchorExist(anchorId,ccPersistence,(err, exists) =>{
            if (err){
                return callback(undefined,[]);
            }
            if (!exists){
                return callback(undefined,[]);
            }
            //read the last hashlink for anchorId
            return chainCodeOperations.getAllVersions(anchorId,ccPersistence,callback);
        });
    }
    self.createAnchor = function (anchorId, anchorValueSSI, callback){
        chainCodeOperations.anchorExist(anchorId,ccPersistence,(err, exists) =>{
            if (err){
                return callback(err);
            }
            if (!exists){
                //file doesnt exist
                return chainCodeOperations.createAnchor(anchorId, anchorValueSSI,ccPersistence, callback);
            }
            //if anchor exist, return error
            return callback(Error(`anchor ${anchorId} already exist`));
        })
    }
    self.appendAnchor = function(anchorId,anchorValueSSI, callback){
        chainCodeOperations.anchorExist(anchorId,ccPersistence,(err,exists) =>{
            if (err){
                return callback(err);
            }
            if (!exists){
                return callback(new Error(`Anchor ${anchorId} doesn't exist`));
            }
            return chainCodeOperations.appendAnchor(anchorId, anchorValueSSI,ccPersistence, callback);
        })
    }

}



function ChainCodeOperations(){
    const self =  this;

    self.getAnchorIdOnIndex = function(index, ccPersistence, callback){
        ccPersistence.getState(index).then(
            (data) => {
                callback(undefined, JSON.parse(data.toString('utf8')).anchorId);
            },
            (err) => {
                console.log(err);
                return callback(err);
            }
        )
    }

    self.getTotalNumberOfAnchors = function(ccPersistence,callback){
        ccPersistence.getState("NoOfAnchors").then(
            (data) => {
                let count = 0;
                if (data && data.length > 0){
                    count = JSON.parse(data.toString('utf8')).count;
                }
                callback(undefined, count);
            },
            (err) => {
                console.log(err);
                return callback(err);
            }
        )
    }

    self.incrementTotalNumberOfAnchors = function(anchorId, ccPersistence, callback){
        self.getTotalNumberOfAnchors(ccPersistence, (err, data) => {
            if (err){
                console.log(err);
                return callback(err);
            }
            const currentAnchorCount = data+1;
            const jsonStr = JSON.stringify({
                count : currentAnchorCount
            });
            ccPersistence.putState("NoOfAnchors", Buffer.from(jsonStr)).then(
                ()=>{
                    const currentAnchorIndex = currentAnchorCount-1;
                    ccPersistence.putState(currentAnchorIndex, Buffer.from(JSON.stringify({
                        anchorId: anchorId
                    }))).then(
                        ()=>{
                            return callback(undefined);
                        },
                        (err)=>{
                            console.log(err);
                            return callback(err);
                        }
                    )
                },
                (err)=>{
                    console.log(err);
                    return callback(err);
                }
            )
        })

    }
    self.anchorExist = function(anchorId,ccPersistence, callback){
        ccPersistence.getState(anchorId).then(
            (data) => {
                return callback(undefined, data && data.length > 0);
            },
            (err) =>{
                console.log(err);
                return callback(err);
            }
        )
    }

    self.getlastVersion = function(anchorId,ccPersistence, callback){
        self.getAllVersions(anchorId,ccPersistence, (err, allVersions) =>{
            if (err){
                return callback(err);
            }
            if (allVersions.length === 0){
                return callback(undefined,null);
            }
            return callback(undefined,allVersions[allVersions.length-1]);
        });
    }

    self.getAllVersions = function(anchorId,ccPersistence, callback){

        ccPersistence.getState(anchorId).then(
            (data) =>{
                const jsonData = JSON.parse(data.toString('utf8'));
                console.log('Reading stored anchor : ',jsonData);
                //return []
                return callback(undefined,jsonData.hashLinks);
            },
            (err) =>{
                console.log(err);
                return callback(err);
            }
        )
    }

    self.createAnchor = function(anchorId, anchorValueSSI,ccPersistence, callback){
        console.log('Storing normal anchor information : ',anchorId,anchorValueSSI);
        const jsonStr = JSON.stringify({
            "hashLinks" : [anchorValueSSI]
        });
        ccPersistence.putState(anchorId, Buffer.from(jsonStr)).then(
            ()=>{
                self.incrementTotalNumberOfAnchors(anchorId, ccPersistence,(err) =>{
                    if (err){
                        console.log(err);
                        return callback(err);
                    }
                    return callback(undefined);
                });
            },
            (err)=>{
                console.log(err);
                return callback(err);
            }
        )
    }

    self.appendAnchor = function(anchorId, anchorValueSSI,ccPersistence, callback){
        ccPersistence.getState(anchorId).then(
            (data) =>{
                const jsonData = JSON.parse(data.toString('utf8'));
                console.log('Read anchor for append : ',anchorId, jsonData);
                jsonData.hashLinks.push(anchorValueSSI);
                console.log('Append anchor : ',anchorId, jsonData);
                const jsonStr = JSON.stringify(jsonData);
                ccPersistence.putState(anchorId, Buffer.from(jsonStr)).then(
                    () => {
                        return callback(undefined);
                    },
                    (err) =>{
                        console.log(err);
                        return callback(err);
                    }
                )
            },
            (err) =>{
                console.log(err);
                return callback(err);
            }
        )
    }
}




module.exports = HLFPersistenceStrategy;
