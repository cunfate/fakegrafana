let HinocSerializerSet = {
    eocDevChanInfo : (data, graphtype='line')=>{
        if(data) {
            if(graphtype === 'line' || graphtype === 'bar' || graphtype === 'pie') {
                return data.map(x =>{
                    let first, paras;
                    [first, ...paras] = x;
                    return { 
                        name: x[0].split(".")[0].replace("T", " "),
                        value:[x[0].split(".")[0].replace("T", " "), ...paras] 
                    }; 
                });
            }
            else if(graphtype === '3d') {
                let retdata = [];
                data.forEach(items => {
                    let time = items[0].split(".")[0];
                    for(let i = 1; i < items.length; i++) {
                        retdata.push([new Date(time), i - 1, items[i]]);
                    }
                });
                return retdata;
            }
        }
    },
    serialize : (type, data, graphtype='line')=>{
        if(HinocSerializerSet[type]) {
            return HinocSerializerSet[type](data, graphtype);
        }
        return HinocSerializerSet.defaultSerialize(data);
    },

    defaultSerialize: (data, graphtype='line')=>{
        return data.map( x => {
            let first, paras;
            [first, ...paras] = x; 
            return { 
                name: x[0].split(".")[0].replace("T", " "),
                value:[x[0].split(".")[0].replace("T", " "), ...paras] 
            }
        });
    }
};

export {HinocSerializerSet}